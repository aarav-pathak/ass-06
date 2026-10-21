# ass-06: Class Attendance Management System (PS1)

A full-stack MERN application for managing student attendance, calculating eligibility percentages, and flagging attendance shortages.

---

## Live URL

- **Frontend (Vite on Vercel)**: `https://your-frontend-app.vercel.app` (or deployed Vercel domain)
- **Backend (Express on Render)**: `https://your-backend-api.onrender.com` (or deployed Render domain)
- **Local Development**:
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:5002`

---

## Problem Statement

In academic institutions, managing daily attendance manually across multiple subjects and determining examination eligibility (< 75% rule) is time-consuming and error-prone.

**PS1: Class Attendance Management System** provides a centralized system where:
1. Teachers manage subjects and record daily attendance per semester on a single screen with Present/Absent toggles.
2. Duplicate attendance entries for the same subject and date are prevented by automatically opening the existing sheet in edit mode.
3. Students track their subject-wise attendance percentages, review date-wise class history, and view the exact number of consecutive classes required to reach 75%.
4. Administrators monitor daily overall attendance, subject averages, and shortage student counts through a telemetry dashboard.

---

## Features

### Teacher / Admin
- **Dashboard**: Today's attendance percentage, total sessions held, subject averages, and count of students with attendance shortage.
- **Subject CRUD**: Add, edit, list, and delete subjects with course code, name, semester (1-8), and faculty name.
- **Attendance Marking**: Single screen listing all students in the selected semester with one-click Present/Absent toggles and bulk actions ("Mark All Present", "Mark All Absent").
- **Duplicate Prevention**: Selecting a subject and date that has already been recorded automatically loads the existing attendance sheet for editing instead of creating duplicate records.
- **Shortage List**: Real-time list of all students whose attendance is below 75% in any subject, with filters for semester and subject.

### Student
- **Subject Summary**: Overall attendance percentage, total classes conducted, attended classes, and shortage alerts.
- **Date-Wise History**: Detailed class-by-class log showing date and status (Present/Absent).
- **Attendance Recovery Target**: Calculates the minimum consecutive classes needed to restore attendance to at least 75%.

---

## Test Accounts

The database seeder creates pre-configured accounts:

| Role | Email | Password | Details |
| --- | --- | --- | --- |
| Admin | admin@college.edu | admin123 | Full access to subjects, attendance marking, shortage list |
| Student | aarav@college.edu | student123 | Normal attendance (~90%), Sem 3, Sec A |
| Student (Shortage) | diya@college.edu | student123 | Low attendance (<75%), Sem 3, Sec A |

---

## Screenshots

### 1. Admin Attendance Dashboard
![Admin Attendance Dashboard](screenshots/admin_dashboard.png)

### 2. Single-Screen Attendance Marking (with duplicate sheet edit mode)
![Single-Screen Attendance Marking](screenshots/attendance_mark.png)

### 3. Role-Based Login Page
![Role-Based Login Page](screenshots/login.png)

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5002
MONGO_URI=mongodb+srv://aaravpathak9984_db_user:aaravpathak9984_db_user@cluster0.xdaowzp.mongodb.net/dashly?retryWrites=true&w=majority
JWT_SECRET=attendance_secret_key_12345
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```
*(For local MongoDB, set `MONGO_URI=mongodb://127.0.0.1:27017/dashly`)*

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5002/api
```
*(In production, replace with your deployed Render backend URL, e.g. `https://your-backend.onrender.com/api`)*

---

## Local Setup & Execution

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (local service or MongoDB Atlas cluster `dashly`)

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed
npm start
```
The backend server runs on `http://localhost:5002`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend Vite server runs on `http://localhost:5173`.

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register Student or Admin |
| POST | `/api/auth/login` | Public | Log in and receive JWT token |
| GET | `/api/auth/me` | Authenticated | Retrieve current user profile |

### Subjects (`/api/subjects`)
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/subjects` | Authenticated | List all subjects (filter by `?semester=`) |
| GET | `/api/subjects/:id` | Authenticated | Get subject details by ID |
| POST | `/api/subjects` | Admin | Create subject (Name, Code, Semester, Teacher) |
| PUT | `/api/subjects/:id` | Admin | Update subject details |
| DELETE | `/api/subjects/:id` | Admin | Delete subject and related records |

### Attendance (`/api/attendance`)
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/attendance/sheet?subjectId=...&date=...` | Admin | Load sheet (new or edit mode) |
| POST | `/api/attendance` | Admin | Upsert attendance records |
| GET | `/api/attendance/my-summary` | Student | Student subject-wise attendance summary |
| GET | `/api/attendance/my-detail/:subjectId` | Student | Student date-wise history for subject |
| GET | `/api/attendance/shortage` | Admin | Filter students below 75% |
| GET | `/api/attendance/dashboard` | Admin | Attendance telemetry & subject averages |

### Students (`/api/students`)
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/students` | Admin | List students (filter by `?semester=`) |
| GET | `/api/students/:id` | Admin | Get student by ID |

---

## Deployment Configuration

- **SPA Rewrites**:
  - `frontend/vercel.json` and `frontend/public/_redirects` are included so page reloads on dynamic routes (e.g. `/my-attendance/CS301`) do not return 404 errors.
- **Git Security**:
  - `.env` files are ignored via `.gitignore`; sample configurations are committed in `backend/.env.example` and `frontend/.env.example`.
