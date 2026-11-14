/**
 * EduPortal - Vanilla JavaScript Application
 * College Assignment: Program 1 - E-Learning Portal
 * 
 * Demonstrates:
 * - Fetch API with async/await (GET courses & prepared POST enrollment)
 * - DOM manipulation & Event Listeners
 * - Search, filter, and dynamic UI updates
 * - Form input validation and error/success messaging
 */

// ============================================================================
// 1. Central Configuration
// ============================================================================
const APP_CONFIG = {
  // Configurable API URLs in one central place
  COURSES_DATA_URL: 'data/courses.json',
  ENROLLMENT_API_URL: 'http://localhost:3003/api/enrollments'
};

// ============================================================================
// 2. Application State
// ============================================================================
let coursesData = [];
let isSubmitting = false;

// ============================================================================
// 3. Cached DOM Elements
// ============================================================================
const DOM = {
  // Filter & Search Controls
  searchInput: document.getElementById('searchInput'),
  categoryFilter: document.getElementById('categoryFilter'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),
  resultsCount: document.getElementById('resultsCount'),
  activeFilterBadge: document.getElementById('activeFilterBadge'),

  // Courses Catalog Section
  coursesContainer: document.getElementById('coursesContainer'),
  loadingIndicator: document.getElementById('loadingIndicator'),
  coursesErrorBanner: document.getElementById('coursesErrorBanner'),
  coursesErrorMessage: document.getElementById('coursesErrorMessage'),
  retryFetchBtn: document.getElementById('retryFetchBtn'),
  emptyState: document.getElementById('emptyState'),
  emptyResetBtn: document.getElementById('emptyResetBtn'),

  // Enrollment Form Section
  enrollmentSection: document.getElementById('enrollmentSection'),
  enrollmentForm: document.getElementById('enrollmentForm'),
  studentNameInput: document.getElementById('studentName'),
  studentEmailInput: document.getElementById('studentEmail'),
  selectedCourseSelect: document.getElementById('selectedCourse'),
  nameError: document.getElementById('nameError'),
  emailError: document.getElementById('emailError'),
  courseError: document.getElementById('courseError'),
  formGlobalAlert: document.getElementById('formGlobalAlert'),
  formAlertIcon: document.getElementById('formAlertIcon'),
  formAlertMessage: document.getElementById('formAlertMessage'),
  submitEnrollmentBtn: document.getElementById('submitEnrollmentBtn'),
  resetFormBtn: document.getElementById('resetFormBtn'),

  // Course Preview in Form
  coursePreviewBox: document.getElementById('selectedCoursePreview'),
  previewCourseName: document.getElementById('previewCourseName'),
  previewCourseCategory: document.getElementById('previewCourseCategory'),
  previewCoursePrice: document.getElementById('previewCoursePrice')
};

// ============================================================================
// 4. Data Retrieval (Fetch API - GET)
// ============================================================================

/**
 * Fetches course data asynchronously using Fetch API and async/await
 */
async function fetchCourses() {
  setCoursesLoading(true);
  hideCoursesError();

  try {
    const response = await fetch(APP_CONFIG.COURSES_DATA_URL);

    // Validate HTTP response status
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: Failed to load course catalog.`);
    }

    // Parse JSON response
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid JSON format: Expected a list of courses.');
    }

    coursesData = data;

    // Populate dynamic UI elements
    populateCategoryOptions(coursesData);
    populateCourseDropdown(coursesData);
    renderCourses(coursesData);

  } catch (error) {
    console.error('Error fetching course data:', error);
    showCoursesError(error.message || 'Network error while retrieving courses.');
  } finally {
    setCoursesLoading(false);
  }
}

/**
 * Displays or hides the loading state
 */
function setCoursesLoading(isLoading) {
  if (isLoading) {
    DOM.loadingIndicator.style.display = 'flex';
    DOM.coursesContainer.style.display = 'none';
    DOM.emptyState.style.display = 'none';
    DOM.resultsCount.textContent = 'Loading courses...';
  } else {
    DOM.loadingIndicator.style.display = 'none';
  }
}

/**
 * Shows the error notification banner for course fetching
 */
function showCoursesError(message) {
  DOM.coursesErrorMessage.textContent = message;
  DOM.coursesErrorBanner.style.display = 'flex';
  DOM.coursesContainer.style.display = 'none';
  DOM.emptyState.style.display = 'none';
  DOM.resultsCount.textContent = '0 courses available';
}

/**
 * Hides the error notification banner
 */
function hideCoursesError() {
  DOM.coursesErrorBanner.style.display = 'none';
}

// ============================================================================
// 5. Dynamic DOM Rendering & Manipulation
// ============================================================================

/**
 * Extracts unique categories and populates the category filter dropdown
 */
function populateCategoryOptions(courses) {
  // Preserve default "All Categories" option
  DOM.categoryFilter.innerHTML = '<option value="ALL">All Categories</option>';

  const uniqueCategories = [...new Set(courses.map(c => c.category))].sort();

  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    DOM.categoryFilter.appendChild(option);
  });
}

/**
 * Populates the course select dropdown in the enrollment form
 */
function populateCourseDropdown(courses) {
  DOM.selectedCourseSelect.innerHTML = '<option value="">-- Choose a course from list --</option>';

  courses.forEach(course => {
    const option = document.createElement('option');
    option.value = course.id;
    option.textContent = `${course.name} - ₹${course.price.toLocaleString('en-IN')}`;
    DOM.selectedCourseSelect.appendChild(option);
  });
}

/**
 * Renders the course cards dynamically inside the courses grid
 */
function renderCourses(coursesToRender) {
  DOM.coursesContainer.innerHTML = '';

  // Update results counter
  DOM.resultsCount.textContent = `Showing ${coursesToRender.length} of ${coursesData.length} courses`;

  // Handle empty state
  if (coursesToRender.length === 0) {
    DOM.coursesContainer.style.display = 'none';
    DOM.emptyState.style.display = 'flex';
    return;
  }

  DOM.emptyState.style.display = 'none';
  DOM.coursesContainer.style.display = 'grid';

  // Construct course card DOM elements
  coursesToRender.forEach(course => {
    const card = document.createElement('article');
    card.className = 'course-card';
    card.setAttribute('data-id', course.id);

    card.innerHTML = `
      <div>
        <div class="card-header-meta">
          <span class="badge category-badge">${escapeHTML(course.category)}</span>
          ${course.duration ? `<span class="badge duration-badge">${escapeHTML(course.duration)}</span>` : ''}
        </div>
        <h3 class="course-title">${escapeHTML(course.name)}</h3>
        <p class="course-description">${escapeHTML(course.description)}</p>
        ${course.instructor ? `<p class="course-instructor">👨‍🏫 Instructor: <strong>${escapeHTML(course.instructor)}</strong></p>` : ''}
      </div>
      <div class="card-footer">
        <div class="course-price-wrap">
          <span class="price-label">Course Fee</span>
          <span class="course-price">₹${course.price.toLocaleString('en-IN')}</span>
        </div>
        <button type="button" class="btn btn-enroll" data-enroll-id="${course.id}">
          Enroll Now &rarr;
        </button>
      </div>
    `;

    DOM.coursesContainer.appendChild(card);
  });
}

/**
 * Escapes string to prevent XSS during DOM interpolation
 */
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================================================
// 6. Filtering & Searching Logic
// ============================================================================

/**
 * Filters courses by search text (course name) and category dropdown
 */
function handleFilterAndSearch() {
  const searchTerm = DOM.searchInput.value.trim().toLowerCase();
  const selectedCategory = DOM.categoryFilter.value;

  const filtered = coursesData.filter(course => {
    const matchesName = course.name.toLowerCase().includes(searchTerm);
    const matchesCategory = (selectedCategory === 'ALL' || course.category === selectedCategory);
    return matchesName && matchesCategory;
  });

  // Update filter badge UI indicator
  if (selectedCategory !== 'ALL' || searchTerm.length > 0) {
    DOM.activeFilterBadge.style.display = 'inline-block';
    const filterInfo = [];
    if (searchTerm) filterInfo.push(`Search: "${searchTerm}"`);
    if (selectedCategory !== 'ALL') filterInfo.push(`Category: ${selectedCategory}`);
    DOM.activeFilterBadge.textContent = filterInfo.join(' | ');
  } else {
    DOM.activeFilterBadge.style.display = 'none';
  }

  renderCourses(filtered);
}

/**
 * Resets search query and category filters to default
 */
function resetFilters() {
  DOM.searchInput.value = '';
  DOM.categoryFilter.value = 'ALL';
  DOM.activeFilterBadge.style.display = 'none';
  renderCourses(coursesData);
  DOM.searchInput.focus();
}

/**
 * Selects a course in the enrollment form when "Enroll Now" is clicked on a card
 */
function selectCourseForEnrollment(courseId) {
  const course = coursesData.find(c => c.id === Number(courseId));
  if (!course) return;

  DOM.selectedCourseSelect.value = String(course.id);
  updateCoursePreview(course);
  clearFieldError(DOM.selectedCourseSelect, DOM.courseError);

  // Smooth scroll to enrollment section
  DOM.enrollmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Focus student name field for immediate entry
  setTimeout(() => {
    DOM.studentNameInput.focus();
  }, 400);
}

/**
 * Updates the course preview box below the course selection dropdown
 */
function updateCoursePreview(course) {
  if (course) {
    DOM.previewCourseName.textContent = course.name;
    DOM.previewCourseCategory.textContent = course.category;
    DOM.previewCoursePrice.textContent = `₹${course.price.toLocaleString('en-IN')}`;
    DOM.coursePreviewBox.style.display = 'flex';
  } else {
    DOM.coursePreviewBox.style.display = 'none';
  }
}

// ============================================================================
// 7. Form Validation Logic
// ============================================================================

/**
 * Validates student name
 */
function validateName(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Full name is required.';
  }
  if (trimmed.length < 2) {
    return 'Name must contain at least 2 characters.';
  }
  // Allow letters, spaces, dots, hyphens and apostrophes
  const namePattern = /^[A-Za-z\s.'-]+$/;
  if (!namePattern.test(trimmed)) {
    return 'Name must only contain alphabets and standard name punctuation.';
  }
  return '';
}

/**
 * Validates email address format
 */
function validateEmail(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Email address is required.';
  }
  // Standard email validation pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailPattern.test(trimmed)) {
    return 'Please enter a valid email address (e.g. name@domain.com).';
  }
  return '';
}

/**
 * Validates course selection
 */
function validateCourse(value) {
  if (!value) {
    return 'Please select a course to enroll.';
  }
  const courseExists = coursesData.some(c => c.id === Number(value));
  if (!courseExists) {
    return 'Selected course is invalid. Please pick an existing course.';
  }
  return '';
}

/**
 * Sets validation error UI state on a field
 */
function setFieldError(inputElement, errorElement, errorMessage) {
  if (errorMessage) {
    inputElement.classList.add('input-error');
    errorElement.textContent = errorMessage;
    return false;
  } else {
    clearFieldError(inputElement, errorElement);
    return true;
  }
}

/**
 * Clears validation error UI state from a field
 */
function clearFieldError(inputElement, errorElement) {
  inputElement.classList.remove('input-error');
  errorElement.textContent = '';
}

/**
 * Validates all form fields at once
 */
function validateEntireForm() {
  const nameErrorMsg = validateName(DOM.studentNameInput.value);
  const emailErrorMsg = validateEmail(DOM.studentEmailInput.value);
  const courseErrorMsg = validateCourse(DOM.selectedCourseSelect.value);

  const isNameValid = setFieldError(DOM.studentNameInput, DOM.nameError, nameErrorMsg);
  const isEmailValid = setFieldError(DOM.studentEmailInput, DOM.emailError, emailErrorMsg);
  const isCourseValid = setFieldError(DOM.selectedCourseSelect, DOM.courseError, courseErrorMsg);

  return isNameValid && isEmailValid && isCourseValid;
}

/**
 * Displays global alert banner inside enrollment card
 * types: 'success', 'danger', 'warning', 'info'
 */
function showGlobalAlert(type, message) {
  DOM.formGlobalAlert.className = `alert alert-${type}`;

  const icons = {
    success: '✅',
    danger: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  DOM.formAlertIcon.textContent = icons[type] || 'ℹ️';
  DOM.formAlertMessage.innerHTML = message;
  DOM.formGlobalAlert.style.display = 'flex';
}

/**
 * Clears global alert banner
 */
function hideGlobalAlert() {
  DOM.formGlobalAlert.style.display = 'none';
  DOM.formAlertMessage.innerHTML = '';
}

// ============================================================================
// 8. Enrollment Submission (Fetch API - Prepared POST)
// ============================================================================

/**
 * Handles enrollment form submission
 * Prepares and executes a POST request to CONFIG.ENROLLMENT_API_URL
 */
async function handleEnrollmentSubmit(e) {
  e.preventDefault();
  hideGlobalAlert();

  // Validate form before submission
  const isValid = validateEntireForm();
  if (!isValid) {
    showGlobalAlert('danger', 'Please review and fix the validation errors highlighted above.');
    return;
  }

  const selectedCourseId = Number(DOM.selectedCourseSelect.value);
  const selectedCourse = coursesData.find(c => c.id === selectedCourseId);

  // Prepare JSON payload for POST request
  const enrollmentPayload = {
    studentName: DOM.studentNameInput.value.trim(),
    email: DOM.studentEmailInput.value.trim().toLowerCase(),
    courseId: selectedCourseId,
    courseName: selectedCourse ? selectedCourse.name : '',
    price: selectedCourse ? selectedCourse.price : 0,
    enrolledAt: new Date().toISOString()
  };

  setSubmittingState(true);

  try {
    // Send POST request with JSON body and headers
    const response = await fetch(APP_CONFIG.ENROLLMENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(enrollmentPayload)
    });

    if (!response.ok) {
      let serverErrorMsg = `HTTP ${response.status}: Failed to submit enrollment.`;
      try {
        const errorBody = await response.json();
        if (errorBody && errorBody.message) {
          serverErrorMsg = errorBody.message;
        }
      } catch {
        // Fallback to HTTP status text if body is not JSON
      }
      throw new Error(serverErrorMsg);
    }

    const responseData = await response.json();

    // Success response handling
    showGlobalAlert(
      'success',
      `<strong>Enrollment Successful!</strong> Congratulations ${escapeHTML(enrollmentPayload.studentName)}, you have been enrolled in <em>${escapeHTML(enrollmentPayload.courseName)}</em>. (Reference ID: ${responseData.id || 'CONF-' + Date.now().toString().slice(-6)})`
    );

    // Reset form after successful submission
    DOM.enrollmentForm.reset();
    updateCoursePreview(null);

  } catch (error) {
    console.error('Enrollment POST submission error:', error);

    // Handle Network / Backend Offline state gracefully
    // Program 1 is frontend-only; Program 3 will provide backend server on port 3003
    const isNetworkError = error instanceof TypeError || error.name === 'TypeError';

    if (isNetworkError) {
      showGlobalAlert(
        'warning',
        `<strong>POST Request Dispatched &amp; Handled:</strong><br/>
         Sent enrollment payload for <em>${escapeHTML(enrollmentPayload.studentName)}</em> to <code>${escapeHTML(APP_CONFIG.ENROLLMENT_API_URL)}</code>.<br/>
         <small>Status: Backend endpoint is not yet active (<code>${escapeHTML(error.message)}</code>). The backend API will be implemented in Program 3.</small>`
      );
    } else {
      showGlobalAlert(
        'danger',
        `<strong>Enrollment Error:</strong> ${escapeHTML(error.message)}`
      );
    }
  } finally {
    setSubmittingState(false);
  }
}

/**
 * Toggles submitting state and UI loading on submit button
 */
function setSubmittingState(isSubmittingNow) {
  isSubmitting = isSubmittingNow;
  const btnText = DOM.submitEnrollmentBtn.querySelector('.btn-text');
  const btnSpinner = DOM.submitEnrollmentBtn.querySelector('.btn-spinner');

  if (isSubmittingNow) {
    DOM.submitEnrollmentBtn.disabled = true;
    btnText.textContent = 'Submitting...';
    btnSpinner.style.display = 'inline-block';
  } else {
    DOM.submitEnrollmentBtn.disabled = false;
    btnText.textContent = 'Complete Enrollment';
    btnSpinner.style.display = 'none';
  }
}

// ============================================================================
// 9. Event Listeners Setup
// ============================================================================
function setupEventListeners() {
  // Search input: filter on typing
  DOM.searchInput.addEventListener('input', handleFilterAndSearch);

  // Category dropdown: filter on selection change
  DOM.categoryFilter.addEventListener('change', handleFilterAndSearch);

  // Reset filters buttons
  DOM.resetFiltersBtn.addEventListener('click', resetFilters);
  DOM.emptyResetBtn.addEventListener('click', resetFilters);

  // Retry fetching courses button
  DOM.retryFetchBtn.addEventListener('click', fetchCourses);

  // Course Grid delegation: click "Enroll Now"
  DOM.coursesContainer.addEventListener('click', (e) => {
    const enrollBtn = e.target.closest('[data-enroll-id]');
    if (enrollBtn) {
      const courseId = enrollBtn.getAttribute('data-enroll-id');
      selectCourseForEnrollment(courseId);
    }
  });

  // Course Select dropdown in form change: update preview
  DOM.selectedCourseSelect.addEventListener('change', (e) => {
    const courseId = Number(e.target.value);
    const course = coursesData.find(c => c.id === courseId);
    updateCoursePreview(course);
    clearFieldError(DOM.selectedCourseSelect, DOM.courseError);
  });

  // Real-time validation feedback clearing on input
  DOM.studentNameInput.addEventListener('input', () => {
    if (DOM.studentNameInput.classList.contains('input-error')) {
      const error = validateName(DOM.studentNameInput.value);
      setFieldError(DOM.studentNameInput, DOM.nameError, error);
    }
  });

  DOM.studentEmailInput.addEventListener('input', () => {
    if (DOM.studentEmailInput.classList.contains('input-error')) {
      const error = validateEmail(DOM.studentEmailInput.value);
      setFieldError(DOM.studentEmailInput, DOM.emailError, error);
    }
  });

  // Blur validation events
  DOM.studentNameInput.addEventListener('blur', () => {
    const error = validateName(DOM.studentNameInput.value);
    setFieldError(DOM.studentNameInput, DOM.nameError, error);
  });

  DOM.studentEmailInput.addEventListener('blur', () => {
    const error = validateEmail(DOM.studentEmailInput.value);
    setFieldError(DOM.studentEmailInput, DOM.emailError, error);
  });

  DOM.selectedCourseSelect.addEventListener('blur', () => {
    const error = validateCourse(DOM.selectedCourseSelect.value);
    setFieldError(DOM.selectedCourseSelect, DOM.courseError, error);
  });

  // Form submission
  DOM.enrollmentForm.addEventListener('submit', handleEnrollmentSubmit);

  // Form reset
  DOM.resetFormBtn.addEventListener('click', () => {
    clearFieldError(DOM.studentNameInput, DOM.nameError);
    clearFieldError(DOM.studentEmailInput, DOM.emailError);
    clearFieldError(DOM.selectedCourseSelect, DOM.courseError);
    hideGlobalAlert();
    updateCoursePreview(null);
  });
}

// ============================================================================
// 10. Initialization
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  fetchCourses();
});
