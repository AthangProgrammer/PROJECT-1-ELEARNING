# Program 2 – React Application (E-Learning Portal)

> **Course:** Full Stack Development Laboratory  
> **Student Level:** Second-Year Engineering  
> **Topic:** Component-Based UI Development with React, Vite & React Router

---

## 📖 Overview

This application is **Program 2** of the E-Learning Portal project. It implements a modern, single-page frontend application using **React**, **Vite**, and **React Router DOM**. The application allows users to explore available courses, filter and search courses, enroll in courses, and enter new courses into the catalog through a validated form.

---

## ✨ Features & Requirements Fulfilled

1. **Reusable Functional Components using JSX:**
   - `Navbar`: Reusable navigation bar with active route highlighting and live course count badge.
   - `CourseCard`: Individual course card component rendering title, description, category badge, formatted price, and interactive buttons.
   - `CourseList`: Renders the responsive grid of courses or contextual empty states with search & filter controls.
   - `CourseForm`: Dedicated course entry form managing controlled inputs, validation, and feedback alerts.

2. **Course Entry Form:**
   - Fields: **Course Name**, **Description**, **Category**, and **Price (₹)**.

3. **Course Listing View:**
   - Displays submitted and seed courses in a clean responsive grid with real-time category filtering and text search.

4. **Props Passing:**
   - State and handler functions are passed down cleanly through props:
     - `courses` & `onDeleteCourse` from `App` → `CoursesPage` → `CourseList` → `CourseCard`.
     - `totalCourses` from `App` → `Navbar`.
     - `onAddCourse` from `App` → `AddCoursePage` → `CourseForm`.

5. **`useState` Management:**
   - `App.jsx`: Manages the overall `courses` list state.
   - `CourseForm.jsx`: Manages controlled inputs (`formData`), validation errors (`errors`), and feedback state (`feedback`).
   - `CourseList.jsx`: Manages search query (`searchTerm`) and category filter (`selectedCategory`).
   - `CourseCard.jsx`: Manages enrollment toggle state (`isEnrolled`).

6. **`useEffect` Appropriately Used:**
   - **Persistence:** Synchronizes course data with browser `localStorage` whenever `courses` change.
   - **Document Title:** Dynamically updates the browser tab title to reflect the live course count.

7. **Conditional Rendering:**
   - Empty state message displayed when no courses exist in catalog.
   - Empty filter state when no search results match.
   - Dynamic form feedback banner (success/error alerts).
   - Card button state switches to "✓ Enrolled" upon enrolling.

8. **Event Handling:**
   - `onSubmit` for form submission and validation.
   - `onChange` for real-time controlled inputs and search/filter.
   - `onClick` for enrollment, deletion, reset, and navigation.

9. **React Router Configuration:**
   - `/` – Course Catalog page (`CoursesPage`).
   - `/add-course` – Course Entry page (`AddCoursePage`).
   - `*` – Catch-all route redirecting back to `/`.

10. **Form Validation:**
    - Course Name: Required, minimum 3 characters.
    - Description: Required, minimum 10 characters.
    - Category: Required selection.
    - Price: Required, must be a positive numeric value (> 0).

---

## 📁 Project Structure

```text
program-2-react/
├── index.html                   # HTML entry point for Vite
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite configuration with React plugin
├── src/
│   ├── main.jsx                 # React root renderer
│   ├── App.jsx                  # Root component (Router & state management)
│   ├── index.css                # Clean, responsive CSS styling
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation bar with route links
│   │   ├── CourseCard.jsx       # Reusable course card component
│   │   ├── CourseList.jsx       # Course catalog & filter toolbar
│   │   └── CourseForm.jsx       # Course entry form with validation
│   ├── pages/
│   │   ├── CoursesPage.jsx      # Course listing page view
│   │   └── AddCoursePage.jsx    # Course entry form page view
│   └── data/
│       └── initialCourses.js    # Starter course dataset
└── tests/
    └── verify-react-portal.test.js # Automated verification test suite
```

---

## 🚀 Exact Commands to Run and Test

All commands must be executed from the `PROJECT-1-ELEARNING/program-2-react` directory:

### 1. Navigate to directory
```bash
cd PROJECT-1-ELEARNING/program-2-react
```

### 2. Install dependencies (if not already installed)
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
The application will launch at: **http://localhost:5174/**

### 4. Run automated tests
```bash
npm test
```

### 5. Build for production
```bash
npm run build
```

### 6. Preview production build
```bash
npm run preview
```
