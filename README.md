# ass-06: Class Attendance Management System

A web application for tracking class attendance. Teachers can create subjects, mark daily attendance, and track students with attendance shortage (< 75%). Students can log in to view their subject-wise attendance and class history.

---

## Features

### Teacher / Admin
- Subject management (add, edit, list, delete subjects).
- Mark attendance for any subject and date with a Present/Absent toggle for all students in that semester.
- Duplicate prevention: selecting a date that already has attendance opens the existing records in edit mode.
- Shortage list: view students whose attendance is below 75% in any subject.
- Dashboard with daily statistics and subject averages.

### Student
- Summary dashboard showing total classes, attended classes, and attendance percentage per subject.
- Detailed date-wise attendance records for each subject.
- Shows required consecutive classes needed to reach 75% if in shortage.

---

## Tech Stack

- Frontend: React (Vite)
- Backend: Node.js, Express.js
- Database: MongoDB (database name: `dashly`)
- Authentication: JWT and bcrypt

---

## Test Accounts

The seed script creates the following accounts:

| Role | Email | Password | Description |
| --- | --- | --- | --- |
| Admin | admin@college.edu | admin123 | Full access to subjects and attendance marking |
| Student | aarav@college.edu | student123 | Normal attendance (~90%) |
| Student | diya@college.edu | student123 | Shortage attendance (<75%) |

---

## How to Run Locally

### 1. Backend Setup

```bash
cd backend
npm install
npm run seed
npm start
```

The backend server runs on `http://localhost:5002`.

Backend environment variables (`backend/.env`):
```env
PORT=5002
MONGO_URI=mongodb://127.0.0.1:27017/dashly
JWT_SECRET=attendance_secret_key_12345
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend app runs on `http://localhost:5173`.

---

## API Endpoints

### Auth (`/api/auth`)
- `POST /api/auth/register` - Register a new account
- `POST /api/auth/login` - Log in and receive JWT token
- `GET /api/auth/me` - Get current user profile

### Subjects (`/api/subjects`)
- `GET /api/subjects` - List all subjects (optional filter: `?semester=3`)
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create a subject (Admin only)
- `PUT /api/subjects/:id` - Update subject (Admin only)
- `DELETE /api/subjects/:id` - Delete subject (Admin only)

### Attendance (`/api/attendance`)
- `GET /api/attendance/sheet?subjectId=...&date=...` - Get attendance sheet
- `POST /api/attendance` - Save or update attendance records
- `GET /api/attendance/my-summary` - Student attendance summary
- `GET /api/attendance/my-detail/:subjectId` - Student attendance by subject
- `GET /api/attendance/shortage` - List students below 75% attendance
- `GET /api/attendance/dashboard` - Admin dashboard stats

### Students (`/api/students`)
- `GET /api/students` - List students (filter by `semester`)
- `GET /api/students/:id` - Get student details

---

## Project Structure

```
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── attendanceController.js
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   └── subjectController.js
│   ├── middleware/
│   │   ├── authHandler.js
│   │   ├── errorHandler.js
│   │   └── roleHandler.js
│   ├── models/
│   │   ├── Attendance.js
│   │   ├── Subject.js
│   │   └── User.js
│   ├── routes/
│   │   ├── attendanceRoutes.js
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   └── subjectRoutes.js
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── index.html
│
└── README.md
```
