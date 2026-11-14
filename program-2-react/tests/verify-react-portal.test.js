import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('=== RUNNING AUTOMATED TESTS FOR PROGRAM 2 (REACT APPLICATION) ===\n');

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

// Helper to check file existence
function checkFileExists(filePath, description) {
  const fullPath = path.join(rootDir, filePath);
  const exists = fs.existsSync(fullPath);
  assert(exists, `${description} exists at ${filePath}`);
  return exists ? fs.readFileSync(fullPath, 'utf-8') : '';
}

async function runTestSuite() {
  console.log('--- Test Suite 1: File Architecture & Project Setup ---');
  const pkgContent = checkFileExists('package.json', 'package.json');
  const pkg = JSON.parse(pkgContent);
  assert(pkg.dependencies && pkg.dependencies.react, 'React is installed in dependencies');
  assert(pkg.dependencies && pkg.dependencies['react-dom'], 'react-dom is installed in dependencies');
  assert(pkg.dependencies && pkg.dependencies['react-router-dom'], 'react-router-dom is installed in dependencies');
  assert(pkg.devDependencies && pkg.devDependencies.vite, 'Vite is configured as build tool');

  const viteConfig = checkFileExists('vite.config.js', 'Vite configuration');
  assert(viteConfig.includes('@vitejs/plugin-react'), 'Vite uses React plugin');

  const indexHtml = checkFileExists('index.html', 'index.html entry');
  assert(indexHtml.includes('<div id="root"></div>'), 'HTML has root container for React DOM');
  assert(indexHtml.includes('src="/src/main.jsx"'), 'HTML loads main.jsx entrypoint');

  console.log('\n--- Test Suite 2: Requirement 1 - Reusable Functional Components using JSX ---');
  const navbarSrc = checkFileExists('src/components/Navbar.jsx', 'Navbar.jsx component');
  const courseCardSrc = checkFileExists('src/components/CourseCard.jsx', 'CourseCard.jsx component');
  const courseListSrc = checkFileExists('src/components/CourseList.jsx', 'CourseList.jsx component');
  const courseFormSrc = checkFileExists('src/components/CourseForm.jsx', 'CourseForm.jsx component');

  assert(navbarSrc.includes('function Navbar(') && navbarSrc.includes('export default Navbar'), 'Navbar is a functional component with export');
  assert(courseCardSrc.includes('function CourseCard(') && courseCardSrc.includes('export default CourseCard'), 'CourseCard is a functional component with export');
  assert(courseListSrc.includes('function CourseList(') && courseListSrc.includes('export default CourseList'), 'CourseList is a functional component with export');
  assert(courseFormSrc.includes('function CourseForm(') && courseFormSrc.includes('export default CourseForm'), 'CourseForm is a functional component with export');

  console.log('\n--- Test Suite 3: Requirement 2 & 10 - Course Entry Form with Fields & Validation ---');
  assert(courseFormSrc.includes('name="name"'), 'CourseForm contains "name" input field');
  assert(courseFormSrc.includes('name="description"'), 'CourseForm contains "description" input field');
  assert(courseFormSrc.includes('name="category"'), 'CourseForm contains "category" select field');
  assert(courseFormSrc.includes('name="price"'), 'CourseForm contains "price" input field');
  assert(courseFormSrc.includes('validateForm'), 'CourseForm contains validation logic function');
  assert(courseFormSrc.includes('newErrors.name'), 'Validation checks course name requirement/length');
  assert(courseFormSrc.includes('newErrors.description'), 'Validation checks description length requirement');
  assert(courseFormSrc.includes('newErrors.category'), 'Validation checks category selection');
  assert(courseFormSrc.includes('newErrors.price'), 'Validation checks positive numeric price');

  console.log('\n--- Test Suite 4: Requirement 3 & 4 - Course Listing View & Props Passing ---');
  const coursesPageSrc = checkFileExists('src/pages/CoursesPage.jsx', 'CoursesPage.jsx page component');
  const addCoursePageSrc = checkFileExists('src/pages/AddCoursePage.jsx', 'AddCoursePage.jsx page component');

  assert(coursesPageSrc.includes('<CourseList'), 'CoursesPage renders CourseList component');
  assert(coursesPageSrc.includes('courses={courses}'), 'CoursesPage passes courses array via props to CourseList');
  assert(courseListSrc.includes('<CourseCard'), 'CourseList renders CourseCard component for each item');
  assert(courseListSrc.includes('course={course}'), 'CourseList passes individual course object via props to CourseCard');
  assert(navbarSrc.includes('totalCourses'), 'Navbar accepts totalCourses via props');

  console.log('\n--- Test Suite 5: Requirement 5 - useState Usage ---');
  const appSrc = checkFileExists('src/App.jsx', 'App.jsx main container');
  assert(appSrc.includes('useState('), 'App component uses useState for courses collection');
  assert(courseFormSrc.includes('useState(') && courseFormSrc.includes('formData'), 'CourseForm uses useState to manage form inputs');
  assert(courseFormSrc.includes('errors'), 'CourseForm uses useState to manage validation errors');
  assert(courseListSrc.includes('useState(') && courseListSrc.includes('searchTerm'), 'CourseList uses useState for search / filtering');
  assert(courseCardSrc.includes('useState(') && courseCardSrc.includes('isEnrolled'), 'CourseCard uses useState for enrollment state');

  console.log('\n--- Test Suite 6: Requirement 6 - useEffect Usage ---');
  assert(appSrc.includes('useEffect('), 'App component uses useEffect hook');
  assert(appSrc.includes('localStorage.setItem'), 'useEffect appropriately persists courses to localStorage');
  assert(appSrc.includes('document.title ='), 'useEffect dynamically updates document title');

  console.log('\n--- Test Suite 7: Requirement 7 & 8 - Conditional Rendering & Event Handling ---');
  assert(courseListSrc.includes('courses.length === 0 ?'), 'CourseList conditionally renders empty state when courses array is empty');
  assert(courseFormSrc.includes('feedback &&'), 'CourseForm conditionally renders submission feedback alert');
  assert(courseCardSrc.includes('isEnrolled ?'), 'CourseCard conditionally renders enrollment status vs action button');
  assert(courseFormSrc.includes('onSubmit={handleSubmit}'), 'CourseForm handles onSubmit event');
  assert(courseFormSrc.includes('onChange={handleChange}'), 'CourseForm handles onChange input events');
  assert(courseCardSrc.includes('onClick='), 'CourseCard handles onClick interactive events');

  console.log('\n--- Test Suite 8: Requirement 9 - React Router Configuration ---');
  assert(appSrc.includes('BrowserRouter'), 'App is wrapped in BrowserRouter');
  assert(appSrc.includes('Routes'), 'App configures Routes container');
  assert(appSrc.includes('Route') && appSrc.includes('path="/"') && appSrc.includes('<CoursesPage'), 'React Router includes Route for Course Listing ("/")');
  assert(appSrc.includes('Route') && appSrc.includes('path="/add-course"') && appSrc.includes('<AddCoursePage'), 'React Router includes Route for Course Entry ("/add-course")');
  assert(navbarSrc.includes('NavLink') || navbarSrc.includes('Link'), 'Navigation uses React Router Link/NavLink for page switching without reload');

  console.log('\n--- Test Suite 9: Seed Data & Styling ---');
  const seedSrc = checkFileExists('src/data/initialCourses.js', 'Initial seed courses dataset');
  assert(seedSrc.includes('Web Development') && seedSrc.includes('Data Structures'), 'Initial seed dataset contains relevant starter courses');

  const cssSrc = checkFileExists('src/index.css', 'index.css stylesheet');
  assert(cssSrc.includes('.course-card') && cssSrc.includes('.course-grid'), 'CSS provides card and responsive grid layouts');
  assert(cssSrc.includes('@media (max-width:'), 'CSS includes responsive breakpoints for mobile screens');

  console.log('\n--- Test Suite 10: Build Verification ---');
  const distHtmlExists = fs.existsSync(path.join(rootDir, 'dist', 'index.html'));
  assert(distHtmlExists, 'Production build artifact dist/index.html is compiled');

  console.log('\n======================================================');
  console.log(`TOTAL TESTS: ${testsPassed + testsFailed}`);
  console.log(`PASSED: ${testsPassed}`);
  console.log(`FAILED: ${testsFailed}`);
  console.log('======================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTestSuite();
