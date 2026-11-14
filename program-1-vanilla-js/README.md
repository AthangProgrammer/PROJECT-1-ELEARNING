# Program 1 – E-Learning Portal

A browser-based E-Learning Portal web application built using **HTML5**, **CSS3**, and **Vanilla JavaScript**. This project serves as **Program 1** of the Full Stack Development laboratory assignments.

---

## 📋 Table of Contents
- [Objective](#objective)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Technical Stack & Architecture](#technical-stack--architecture)
- [API Configuration](#api-configuration)
- [Prerequisites & Installation](#prerequisites--installation)
- [Running the Application](#running-the-application)
- [Testing Guide](#testing-guide)
- [Practical / Viva Explanation](#practical--viva-explanation)

---

## 🎯 Objective
To construct a responsive, dynamic single-page web interface without any frontend frameworks (such as React, Angular, or Vue). It demonstrates asynchronous data fetching (`GET`), dynamic DOM manipulation, real-time client-side form validation, user event handling, and prepared HTTP `POST` submission with comprehensive error handling.

---

## ✨ Key Features
1. **Dynamic Course Catalog Display:**
   - Asynchronously loads courses from `data/courses.json`.
   - Displays course details: title, description, category, instructor, duration, and formatted price.
2. **Search by Course Name:**
   - Real-time case-insensitive keyword search on course titles.
3. **Category Filtering:**
   - Dynamically extracts categories from the dataset and populates the filter dropdown.
   - Filter by specific category or view all categories.
4. **Interactive Course Enrollment:**
   - Clicking **"Enroll Now &rarr;"** on any course card automatically selects the course, updates a live summary badge, and scrolls smoothly to the enrollment form.
5. **Robust Client-Side Form Validation:**
   - Student Full Name validation (non-empty, minimum 2 characters, valid alphabetic characters).
   - Email format validation using regular expressions.
   - Course selection validation.
   - Inline feedback and error states on individual input fields.
6. **Centralized API & State Management:**
   - Single configuration object (`APP_CONFIG`) for API endpoints.
7. **HTTP Requests (GET & Prepared POST):**
   - **GET**: Fetches course data using `fetch()` and `async/await`.
   - **POST**: Dispatches student enrollment payloads as JSON to `http://localhost:3003/api/enrollments`.
   - Gracefully handles loading spinners, empty search states, invalid JSON, and network errors (e.g., when the Program 3 backend is offline).

---

## 📂 Project Structure
```text
PROJECT-1-ELEARNING/program-1-vanilla-js/
├── index.html            # Main HTML5 semantic page structure
├── css/
│   └── style.css         # Custom responsive CSS styling and UI components
├── js/
│   └── app.js           # Vanilla JavaScript logic (Fetch API, DOM manipulation, validation)
├── data/
│   └── courses.json      # Course catalog data (JSON format)
├── package.json          # Node.js project manifest & Vite dev server script
└── README.md             # Project documentation and setup guide
```

---

## ⚙️ API Configuration
All API endpoints are defined in one central location at the top of `js/app.js`:

```javascript
const APP_CONFIG = {
  COURSES_DATA_URL: 'data/courses.json',
  ENROLLMENT_API_URL: 'http://localhost:3003/api/enrollments'
};
```
If the backend endpoint URL changes or moves to a different host/port, update it only in `APP_CONFIG`.

---

## 🚀 Prerequisites & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Modern web browser (Chrome, Edge, Firefox, Safari)

### 2. Install Dependencies
Open your terminal inside this project folder:
```bash
cd PROJECT-1-ELEARNING/program-1-vanilla-js
npm install
```

---

## 🖥️ Running the Application

Start the local Vite development server:
```bash
npm run dev
```

The terminal will display the local URL (typically `http://localhost:5173/`). Open this URL in your web browser.

> **Note on Vite:** Vite is used strictly as a fast static file development server. The project itself uses **100% Vanilla JavaScript, HTML, and CSS** with zero frontend libraries or frameworks.

---

## 🧪 Testing Guide

Follow these steps to verify all practical requirements:

### 1. Course Listing (GET Request)
- On page load, observe the loading spinner while `fetchCourses()` asynchronously retrieves `data/courses.json`.
- The catalog renders 8 distinct course cards with badges, prices, and descriptions.
- The results counter shows `"Showing 8 of 8 courses"`.

### 2. Search by Course Name
- Type `python` into the **Search Courses** input:
  - Only "Python for Data Science & Machine Learning" is displayed.
  - The counter updates to `"Showing 1 of 8 courses"`.
- Type a non-existent course like `quantum`:
  - An empty-state message appears: `"No Courses Found"`.
  - Click **"Clear Filters"** to restore all courses.

### 3. Filter by Category
- Select `Web Development` from the **Filter by Category** dropdown:
  - The grid filters to show only Web Development courses.
  - An active filter badge displays `Category: Web Development`.
- Combine search and category (e.g., Category: `Web Development` and search: `deep`):
  - Only "Modern JavaScript Deep Dive" is shown.
- Click **"Reset Filters"** to reset both inputs.

### 4. Interactive Enrollment Selection
- Click **"Enroll Now &rarr;"** on any course card:
  - The page scrolls down to the **Course Enrollment** form.
  - The course dropdown automatically selects the chosen course.
  - A highlighted summary box previews the selected course name, category, and fee.
  - The cursor automatically focuses on the **Student Full Name** field.

### 5. Form Validation
- Leave fields blank and click **"Complete Enrollment"**:
  - All three inputs highlight in red with inline error messages:
    - *"Full name is required."*
    - *"Email address is required."*
    - *"Please select a course to enroll."*
  - A global danger alert appears at the top of the form.
- Enter an invalid name (e.g. `123` or `A`):
  - Inline error flags: *"Name must contain at least 2 characters."* or *"Name must only contain alphabets..."*
- Enter an invalid email (e.g. `student@invalid`):
  - Inline error flags: *"Please enter a valid email address (e.g. name@domain.com)."*

### 6. Enrollment Submission & Error Handling (POST Request)
- Fill in valid credentials:
  - **Student Full Name:** `Athang Patil`
  - **Email Address:** `athang@example.com`
  - **Select Course:** Any course from the list.
- Click **"Complete Enrollment"**:
  - The button enters a loading state (`"Submitting..."` with a spinner).
  - A `POST` request with JSON headers and body is dispatched to `http://localhost:3003/api/enrollments`.
  - Open the **Browser Console (F12 &rarr; Console/Network)** to inspect the dispatched request payload.
  - Since the backend server will be created later in **Program 3**, the network error (`Failed to fetch`) is caught gracefully.
  - The UI displays an informative alert stating that the POST request was prepared and dispatched to the configured URL, and notes that the backend API will be running in Program 3.

---

## 🎓 Practical / Viva Explanation

### 1. How does `fetchCourses()` work?
```javascript
async function fetchCourses() {
  const response = await fetch(APP_CONFIG.COURSES_DATA_URL);
  if (!response.ok) throw new Error(...);
  const data = await response.json();
  renderCourses(data);
}
```
- It uses the standard browser `fetch()` API.
- The `async/await` syntax allows asynchronous asynchronous Promise-based code to be written synchronously.
- `response.ok` checks if the HTTP status code is in the 200–299 range.
- `response.json()` parses the JSON text body into a native JavaScript array of objects.

### 2. How is DOM manipulation performed?
- Course cards are created programmatically using `document.createElement('article')` and appended to the `#coursesContainer`.
- HTML strings are sanitized using `escapeHTML()` to prevent Cross-Site Scripting (XSS).
- Event delegation is used on `#coursesContainer` to listen for clicks on any `"Enroll Now"` button via `e.target.closest('[data-enroll-id]')`.

### 3. How is the POST request prepared?
```javascript
const response = await fetch(APP_CONFIG.ENROLLMENT_API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(enrollmentPayload)
});
```
- Sets HTTP method to `POST`.
- Sets `Content-Type: application/json` so the server knows the payload format.
- Uses `JSON.stringify()` to convert the JavaScript object into a JSON string.
