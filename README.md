# ass-06: Class Attendance Management System (PS1)

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed for academic institutions. Teachers record subject-wise daily attendance, prevent duplicate submissions with automatic edit mode, and monitor student shortages (< 75%). Students track their subject-wise attendance percentages, review date-wise history, and see the exact number of consecutive classes required to restore eligibility.

---

## 📌 Problem Statement

In academic institutions, monitoring student attendance across multiple subjects and calculating eligibility for examinations is often error-prone and tedious. 

**PS1: Class Attendance Management System** solves this by providing:
1. Role-based portals for **Faculty/Admins** and **Students**.
2. Subject CRUD and daily attendance tracking per semester on a single streamlined screen with Present/Absent toggles.
3. Intelligent duplicate prevention: selecting an already-marked date automatically loads the sheet in edit mode.
4. Real-time shortage analytics highlighting students below 75% attendance.
5. **Stretch Goal:** An algorithmic calculation indicating exactly how many more consecutive classes a student must attend to reach the mandatory 75% threshold.

---

## 🌟 Key Features

### 👨‍🏫 Faculty / Admin Portal
- **Dashboard Telemetry:** Today's overall attendance %, subject-wise averages, total enrolled students, total classes conducted, and attendance shortage count.
- **Subject CRUD:** Create, read, update, and delete academic subjects (Course code, Subject title, Semester 1–8, Teacher name).
- **Single-Screen Attendance Marking:**
  - Select subject and date.
  - Lists all enrolled semester students with one-click **Present/Absent toggles**.
  - **Duplicate Prevention:** If attendance has already been marked for that subject and date, the system opens the existing sheet in edit mode instead of creating a duplicate entry.
  - Bulk actions: "Mark All Present", "Mark All Absent".
- **Attendance Shortage List (< 75%):** Filter by semester or subject; identifies at-risk students with real-time consecutive recovery metrics.

### 👨‍🎓 Student Portal
- **Subject-Wise Summary:** Total classes conducted, attended classes, attendance percentage, and status badge (Eligible vs. Shortage).
- **Date-Wise Detail Page (`/my-attendance/:subjectId`):** Complete chronological history of attendance with class dates, days, and Present/Absent badges.
- **Consecutive Attendance Target (Stretch Goal):** Shows the exact formula-calculated number of consecutive upcoming classes a student must attend to reach $\ge 75\%$.

---

## 📐 Consecutive Classes Recovery Formula (Stretch Goal)

To determine how many consecutive classes $C$ a student with attended classes $A$ and total classes $T$ must attend to achieve $\ge 75\%$ attendance:

$$\frac{A + C}{T + C} \ge 0.75 \implies A + C \ge 0.75T + 0.75C \implies 0.25C \ge 0.75T - A$$

$$C \ge 3T - 4A$$

- If $3T - 4A \le 0$, the student's attendance is already $\ge 75\%$, so $C = 0$.
- If $3T - 4A > 0$, the student requires at least $\lceil 3T - 4A \rceil$ consecutive present marks.

---

## 🔐 Test Logins

The database seed script provides ready-to-test credentials:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin / Teacher** | `admin@college.edu` | `admin123` | Full access to Dashboard, Mark Sheet, Subjects & Shortage List |
| **Student (Normal &gt;75%)** | `aarav@college.edu` | `student123` | Roll No: `CS2301`, Sem 3, Sec A • Attendance ~90% |
| **Student (Shortage &lt;75%)** | `diya@college.edu` | `student123` | Roll No: `CS2302`, Sem 3, Sec A • Attendance ~50% (Shortage Demo) |

*(You can also click the quick login buttons on the `/login` page for one-click testing)*

---

## 🚀 Setup & Local Execution

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local mongod service or MongoDB Atlas cluster)

### 1. Clone the repository
```bash
git clone https://github.com/armnkumar321-spec/Bloodbank.git
cd Bloodbank
```

### 2. Install dependencies
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
cd ..
```

### 3. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5002
MONGO_URI=mongodb://127.0.0.1:27017/attendance_db
JWT_SECRET=attendance_jwt_secret_super_secure_987654321
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```
*(If using MongoDB Atlas, replace `MONGO_URI` with your connection string. The server automatically falls back to local MongoDB if Atlas connection fails).*

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5002/api
```

### 4. Seed the Database
Populates the database with 1 Admin, 12 Students, 5 Subjects, and 27 attendance sessions:
```bash
cd backend
npm run seed
cd ..
```

### 5. Run the Application

**Terminal 1 (Backend):**
```bash
cd backend
npm start
# Server runs on http://localhost:5002
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 📡 API Endpoint Reference

All endpoints return JSON responses (`res.status(...).json(...)`) and enforce authentication and role checks.

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new Student or Admin account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |

### 📚 Subjects (`/api/subjects`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/subjects` | Authenticated | List all subjects (optional filter `?semester=`) |
| `GET` | `/api/subjects/:id` | Authenticated | Get single subject by ID |
| `POST` | `/api/subjects` | Admin | Create new subject (Code, Name, Sem, Teacher) |
| `PUT` | `/api/subjects/:id` | Admin | Update subject details |
| `DELETE` | `/api/subjects/:id` | Admin | Delete subject and related attendance records |

### 📝 Attendance (`/api/attendance`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/attendance/sheet?subjectId=...&date=...` | Admin | Get sheet for marking or editing |
| `POST` | `/api/attendance` | Admin | Save or update attendance records (upsert) |
| `GET` | `/api/attendance/my-summary` | Student | Subject-wise summary for logged-in student |
| `GET` | `/api/attendance/my-detail/:subjectId` | Student | Date-wise records for a subject |
| `GET` | `/api/attendance/shortage` | Admin | List students below 75% attendance |
| `GET` | `/api/attendance/dashboard` | Admin | Daily telemetry and subject averages |

### 👥 Students (`/api/students`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/students?semester=3` | Admin | List students enrolled in specified semester |

---

## 📁 Project Architecture

```
├── backend/
│   ├── config/
│   │   └── db.js                 # Reads MONGO_URI with local fallback
│   ├── models/
│   │   ├── User.js               # Admin & Student schemas with validation
│   │   ├── Subject.js            # Unique subject code, semester 1-8
│   │   └── Attendance.js         # Compound index { subject: 1, date: 1 }
│   ├── middleware/
│   │   ├── authHandler.js        # JWT verification
│   │   ├── roleHandler.js        # allowRoles('Admin', 'Student')
│   │   └── errorHandler.js       # Centralized JSON error response
│   ├── controllers/
│   │   ├── authController.js     # Register, login, getMe
│   │   ├── subjectController.js  # CRUD operations
│   │   ├── studentController.js  # Student roster by semester
│   │   └── attendanceController.js # Sheets, upsert, shortage & dashboard
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── studentRoutes.js
│   │   └── attendanceRoutes.js
│   ├── seed.js                   # Seeder with 10+ records
│   ├── server.js                 # Express server & CORS
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js         # Axios instance with interceptors
│   │   │   ├── authApi.js
│   │   │   ├── subjectApi.js
│   │   │   ├── studentApi.js
│   │   │   └── attendanceApi.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # NavLink with role-based links
│   │   │   ├── ProtectedRoute.jsx# Role & login redirection
│   │   │   └── SubjectForm.jsx   # Shared Add/Edit form
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── SubjectListPage.jsx
│   │   │   ├── SubjectNewPage.jsx
│   │   │   ├── SubjectEditPage.jsx
│   │   │   ├── AttendanceMarkPage.jsx
│   │   │   ├── ShortageListPage.jsx
│   │   │   ├── StudentSummaryPage.jsx
│   │   │   ├── StudentDetailPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── App.jsx               # Routes & centralized user state
│   │   ├── main.jsx              # BrowserRouter
│   │   ├── App.css               # Clean responsive styling
│   │   └── index.css
│   ├── public/
│   │   └── _redirects            # Netlify SPA rewrite
│   ├── vercel.json               # Vercel SPA rewrite
│   └── package.json
└── README.md
```

---

## 🌐 Deployment Notes
- **Vercel / Netlify:** SPA rewrites are included via `frontend/vercel.json` and `frontend/public/_redirects` so refreshing dynamic routes (e.g. `/my-attendance/67...`) does not cause a 404 error.
- **Environment:** In production, configure `VITE_API_URL` to point to your deployed backend URL (e.g. Render / Railway / Heroku).
