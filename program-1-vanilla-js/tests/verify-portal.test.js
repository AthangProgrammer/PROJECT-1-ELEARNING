import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const htmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
const coursesRaw = fs.readFileSync(path.join(rootDir, 'data', 'courses.json'), 'utf-8');
const coursesData = JSON.parse(coursesRaw);

console.log('=== RUNNING AUTOMATED E-LEARNING PORTAL TESTS ===\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  // Setup JSDOM environment
  const dom = new JSDOM(htmlContent, {
    url: 'http://localhost:5173/',
    runScripts: 'dangerously'
  });

  const { window } = dom;
  const { document } = window;

  // Intercept fetch for GET courses and POST enrollment
  let postRequestDispatched = null;

  window.fetch = async (url, options = {}) => {
    if (url === 'data/courses.json' || url.endsWith('/data/courses.json')) {
      return {
        ok: true,
        status: 200,
        json: async () => JSON.parse(coursesRaw)
      };
    }

    if (url === 'http://localhost:3003/api/enrollments') {
      postRequestDispatched = {
        url,
        method: options.method,
        headers: options.headers,
        body: JSON.parse(options.body)
      };
      // Simulate network error because backend server on 3003 is offline
      const netError = new TypeError('Failed to fetch');
      throw netError;
    }

    throw new Error(`Unhandled fetch url: ${url}`);
  };

  // Mock scrollIntoView
  window.HTMLElement.prototype.scrollIntoView = () => {};

  // Load and execute app.js in window context
  const appJsCode = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf-8');
  window.eval(appJsCode);

  // Trigger DOMContentLoaded
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

  // Wait a tick for async fetchCourses to finish
  await new Promise(resolve => setTimeout(resolve, 50));

  console.log('Test Suite 1: Initial Course Listing & Catalog Rendering (GET Request)');
  const courseCards = document.querySelectorAll('#coursesContainer .course-card');
  assert(courseCards.length === 8, `Rendered ${courseCards.length} course cards (expected 8)`);

  const resultsCount = document.getElementById('resultsCount');
  assert(resultsCount.textContent.includes('Showing 8 of 8 courses'), `Results count updated: "${resultsCount.textContent}"`);

  const categoryOptions = document.querySelectorAll('#categoryFilter option');
  assert(categoryOptions.length > 1, `Category filter dropdown populated with ${categoryOptions.length} options`);

  const courseSelectOptions = document.querySelectorAll('#selectedCourse option');
  assert(courseSelectOptions.length === 9, `Course select dropdown populated with 1 placeholder + 8 courses (${courseSelectOptions.length} total)`);

  const firstCardTitle = courseCards[0].querySelector('.course-title').textContent;
  assert(firstCardTitle === 'Full Stack Web Development', `First card title matches: "${firstCardTitle}"`);

  console.log('\nTest Suite 2: Search Functionality');
  const searchInput = document.getElementById('searchInput');
  searchInput.value = 'Python';
  searchInput.dispatchEvent(new window.Event('input'));

  let filteredCards = document.querySelectorAll('#coursesContainer .course-card');
  assert(filteredCards.length === 1, `Searching "Python" displays 1 card (got ${filteredCards.length})`);
  assert(
    filteredCards[0].querySelector('.course-title').textContent.includes('Python'),
    'Filtered card is indeed Python course'
  );
  assert(resultsCount.textContent.includes('Showing 1 of 8 courses'), 'Results counter updated correctly for search');

  // Search non-existent
  searchInput.value = 'NonExistentCourseXYZ';
  searchInput.dispatchEvent(new window.Event('input'));
  const emptyState = document.getElementById('emptyState');
  assert(emptyState.style.display !== 'none', 'Empty state displayed when no courses match search');

  // Reset filters
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  resetFiltersBtn.dispatchEvent(new window.Event('click'));
  assert(document.querySelectorAll('#coursesContainer .course-card').length === 8, 'Reset restored all 8 courses');
  assert(searchInput.value === '', 'Search input cleared upon reset');

  console.log('\nTest Suite 3: Category Filtering');
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.value = 'Web Development';
  categoryFilter.dispatchEvent(new window.Event('change'));

  filteredCards = document.querySelectorAll('#coursesContainer .course-card');
  assert(filteredCards.length === 2, `Filtering by "Web Development" shows 2 courses (got ${filteredCards.length})`);

  // Reset
  resetFiltersBtn.dispatchEvent(new window.Event('click'));
  assert(categoryFilter.value === 'ALL', 'Category filter reset to ALL');

  console.log('\nTest Suite 4: Course Selection via "Enroll Now"');
  const enrollBtn = document.querySelector('[data-enroll-id="2"]');
  assert(enrollBtn !== null, 'Found Enroll Now button for course ID 2');
  enrollBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

  const selectedCourseSelect = document.getElementById('selectedCourse');
  assert(selectedCourseSelect.value === '2', `Course dropdown auto-selected course ID 2 (current value: ${selectedCourseSelect.value})`);

  const previewBox = document.getElementById('selectedCoursePreview');
  assert(previewBox.style.display === 'flex', 'Course preview box is visible');
  assert(
    document.getElementById('previewCourseName').textContent.includes('Python'),
    `Preview box displays selected course name: "${document.getElementById('previewCourseName').textContent}"`
  );

  console.log('\nTest Suite 5: Form Validation');
  const form = document.getElementById('enrollmentForm');
  const nameInput = document.getElementById('studentName');
  const emailInput = document.getElementById('studentEmail');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const courseError = document.getElementById('courseError');
  const globalAlert = document.getElementById('formGlobalAlert');

  // Clear inputs and course selection to test blank validation
  nameInput.value = '';
  emailInput.value = '';
  selectedCourseSelect.value = '';
  form.dispatchEvent(new window.Event('submit', { cancelable: true }));

  assert(nameInput.classList.contains('input-error'), 'Name input has error style on empty submit');
  assert(nameError.textContent.length > 0, `Name error message present: "${nameError.textContent}"`);
  assert(emailInput.classList.contains('input-error'), 'Email input has error style on empty submit');
  assert(emailError.textContent.length > 0, `Email error message present: "${emailError.textContent}"`);
  assert(courseError.textContent.length > 0, `Course error message present: "${courseError.textContent}"`);
  assert(globalAlert.style.display !== 'none', 'Global alert shows danger message on validation failure');

  // Test invalid email
  nameInput.value = 'John Doe';
  emailInput.value = 'invalid-email-address';
  selectedCourseSelect.value = '1';
  form.dispatchEvent(new window.Event('submit', { cancelable: true }));

  assert(emailError.textContent.includes('valid email address'), `Invalid email caught: "${emailError.textContent}"`);
  assert(!nameInput.classList.contains('input-error'), 'Valid name does not have error style');

  console.log('\nTest Suite 6: Prepared POST Request & Offline Backend Handling');
  // Set valid inputs
  nameInput.value = 'Athang Patil';
  emailInput.value = 'athang@example.com';
  selectedCourseSelect.value = '1';

  form.dispatchEvent(new window.Event('submit', { cancelable: true }));
  // Wait a tick for async submit handler
  await new Promise(resolve => setTimeout(resolve, 50));

  assert(postRequestDispatched !== null, 'POST request was dispatched');
  assert(postRequestDispatched.url === 'http://localhost:3003/api/enrollments', `Target URL matches CONFIG: ${postRequestDispatched.url}`);
  assert(postRequestDispatched.method === 'POST', 'HTTP method is POST');
  assert(postRequestDispatched.headers['Content-Type'] === 'application/json', 'Content-Type header is application/json');
  assert(postRequestDispatched.body.studentName === 'Athang Patil', 'Payload contains studentName: "Athang Patil"');
  assert(postRequestDispatched.body.email === 'athang@example.com', 'Payload contains email: "athang@example.com"');
  assert(postRequestDispatched.body.courseId === 1, 'Payload contains courseId: 1');
  assert(postRequestDispatched.body.courseName === 'Full Stack Web Development', 'Payload contains correct courseName');

  assert(globalAlert.style.display !== 'none', 'Global alert displayed after POST dispatch');
  assert(globalAlert.className.includes('alert-warning'), 'Warning alert used for offline backend (Program 3 expectation)');
  assert(globalAlert.textContent.includes('Program 3'), 'Alert explicitly mentions backend will be implemented in Program 3');

  console.log(`\n=== TEST SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED ===\n`);
  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
