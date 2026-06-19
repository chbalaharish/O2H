# Mini Project Management Portal

A full-stack project task management web application built for the **O2H Full Stack Application Developer Fresher Hiring Assessment**.

This portal contains both the frontend (React + Vite) and the backend (Node.js + Express + SQLite) services, implementing the full set of requirements (including the **Advanced Version** features).

---

## Key Features

### 🎨 Frontend (React + Custom CSS)
- **Dashboard Page**: Displays tasks in a sleek grid of cards showing title, description, status, and created date. Includes list control bars for searching, filtering, and sorting.
- **Add Task Page**: Form-driven interface for task creation with client-side input validations (Title required, Description minimum 20 characters) and a live character counter.
- **Advanced Version Features**:
  - **User Login & Registration** (JWT Authentication with local storage session retention).
  - **Dashboard Statistics Grid** (live counters for Total, Pending, In Progress, and Completed tasks).
  - **Debounced Search** (reduces API call overhead by delaying execution until typing stops).
  - **Advanced Sorting** (Newest First, Oldest First, Title A-Z, Title Z-A).
  - **Pagination Controls** (displays tasks in pages of 6 items).
  - **Dark Mode Toggle** (persists preference in localStorage and transitions smoothly).
- **Responsive Layout**: Designed mobile-first using modern CSS Flexbox and Grid, with glassmorphism effects.
- **States**: Includes a visual loading indicator and custom empty state illustrations.

### ⚙️ Backend (Node.js + Express + SQLite)
- **Database**: SQLite (via `sqlite` and `sqlite3` engines). SQLite is zero-setup and stores database schemas locally in `backend/database.sqlite`, making evaluations hassle-free.
- **JWT Authentication Middleware**: Secures task endpoints using `jsonwebtoken` and hashes passwords with `bcryptjs`.
- **API Request Validation**: Validates payloads on the server to reject empty titles or description inputs under 20 characters.
- **SQL Injection Prevention**: Whitelists all sorting columns and parameters.
- **Test Suite**: Automated unit tests using Node.js's native `node:test` runner.

---

## Expected Folder Structure

```
O2H/
├─ backend/
│  ├─ config/
│  │  └─ db.js
│  ├─ controllers/
│  │  ├─ authController.js
│  │  └─ taskController.js
│  ├─ models/
│  │  ├─ userModel.js
│  │  └─ taskModel.js
│  ├─ routes/
│  │  ├─ authRoutes.js
│  │  └─ taskRoutes.js
│  ├─ middleware/
│  │  ├─ authMiddleware.js
│  │  └─ validationMiddleware.js
│  ├─ tests/
│  │  └─ backend.test.js
│  ├─ package.json
│  └─ server.js
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ DashboardStats.jsx
│  │  │  ├─ TaskCard.jsx
│  │  │  ├─ TaskFilter.jsx
│  │  │  ├─ ThemeToggle.jsx
│  │  │  └─ Navbar.jsx
│  │  ├─ pages/
│  │  │  ├─ Dashboard.jsx
│  │  │  ├─ AddTask.jsx
│  │  │  ├─ Login.jsx
│  │  │  └─ Register.jsx
│  │  ├─ services/
│  │  │  ├─ api.js
│  │  │  ├─ auth.js
│  │  │  └─ tasks.js
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ package.json
│  └─ vite.config.js
├─ README.md
└─ .gitignore
```

---

## Setup & Running Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- Git

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd O2H
```

### Step 2: Set Up and Start the Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on port `5000` by default):
   ```bash
   npm start
   ```
   *(For development mode with auto-reload, you can run `npm run dev`)*

### Step 3: Set Up and Start the Frontend
1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (usually runs on `http://localhost:5173`):
   ```bash
   npm run dev
   ```

---

## Running Unit Tests

Backend logic can be tested using the native test suite. It executes against an isolated in-memory SQLite database.
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the test command:
   ```bash
   npm test
   ```

---

## API Documentation

### Public Endpoints

#### User Registration
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "username": "candidate",
    "password": "securepassword123"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": 1,
      "username": "candidate"
    }
  }
  ```

#### User Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "username": "candidate",
    "password": "securepassword123"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": 1,
      "username": "candidate"
    }
  }
  ```

---

### Protected Endpoints
*All requests below require the `Authorization: Bearer <JWT_TOKEN>` header.*

#### Get Tasks (with Search, Filter, Sort, Pagination)
- **Endpoint**: `GET /api/tasks`
- **Query Parameters**:
  - `status`: Filter by status (`Pending`, `In Progress`, `Completed`)
  - `search`: Searches query term in title/description
  - `sort`: Order by field (`created_at:desc`, `created_at:asc`, `title:asc`, `title:desc`)
  - `page`: Page number (defaults to `1`)
  - `limit`: Number of items per page (defaults to `6`)
- **Response** (200 OK):
  ```json
  {
    "tasks": [
      {
        "id": 1,
        "user_id": 1,
        "title": "Build Login Page",
        "description": "Create a responsive login page",
        "status": "Pending",
        "created_at": "2026-06-19 17:41:00"
      }
    ],
    "totalCount": 1,
    "page": 1,
    "limit": 6,
    "totalPages": 1
  }
  ```

#### Create a Task
- **Endpoint**: `POST /api/tasks`
- **Request Body**:
  ```json
  {
    "title": "Build Login Page",
    "description": "Create a responsive login page",
    "status": "Pending"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "id": 1,
    "user_id": 1,
    "title": "Build Login Page",
    "description": "Create a responsive login page",
    "status": "Pending",
    "created_at": "2026-06-19 17:41:00"
  }
  ```

#### Update Task Status
- **Endpoint**: `PUT /api/tasks/:id`
- **Request Body**:
  ```json
  {
    "status": "Completed"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "id": 1,
    "user_id": 1,
    "title": "Build Login Page",
    "description": "Create a responsive login page",
    "status": "Completed",
    "created_at": "2026-06-19 17:41:00"
  }
  ```

#### Delete a Task
- **Endpoint**: `DELETE /api/tasks/:id`
- **Response** (200 OK):
  ```json
  {
    "message": "Task deleted successfully",
    "id": 1
  }
  ```

#### Get Task Statistics
- **Endpoint**: `GET /api/tasks/stats`
- **Response** (200 OK):
  ```json
  {
    "total": 3,
    "Pending": 1,
    "In Progress": 1,
    "Completed": 1
  }
  ```

---

## Assumptions Made
1. **SQLite Database**: SQLite was selected instead of a full MySQL/MongoDB engine to enable frictionless local runs. The SQL tables and schemas are easily convertible to MySQL if necessary.
2. **Task Ownership**: Since JWT authentication was implemented, tasks are scoped strictly to the authenticated user. A user can only see, create, update, or delete their own tasks.
3. **Environment**: Port 5000 is open and not blocked by local configurations. The Vite development server uses standard proxying or direct connection.
4. **Validation rules**:
   - Backend routes mirror client validation rules (Description minimum length of 20 characters).
   - Validation is performed in the controller during task creation.
