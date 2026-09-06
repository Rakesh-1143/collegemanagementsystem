# COLLEGE ERP

College ERP using MERN Stack

# Setup
1. Install Node.js 18+ and MongoDB (Atlas free cluster or MongoDB Community Server).
2. Create a `.env` file in the `server` folder (copy `server/.env.example`).
3. Set `CONNECTION_URL` to your MongoDB connection string and `JWT_SECRET` to a long random string.
4. Open a terminal in the `server` folder and run `npm install` then `npm run start` (API runs on port 5001).
5. Open another terminal in the `client` folder and run `npm install` then `npm run start` (app runs on http://localhost:3000).
6. Go to "localhost:3000/login/adminlogin".
7. On first start the server creates a dummy admin (development only): username = ADMDUMMY, password = 123.

## Security / architecture notes
- Sessions use an **httpOnly, sameSite cookie** (JWT). No tokens or user data are stored in the browser's localStorage; all data lives in MongoDB. The session is restored via `GET /api/me` on app load.
- Login endpoints are rate limited; the API sends security headers (helmet), restricts CORS to `CLIENT_URL` (default http://localhost:3000), and never returns password hashes.
- In production (`NODE_ENV=production`) the dummy admin is **not** created — insert the first admin manually in MongoDB.

# TechStack

1. Reactjs
2. Tailwind CSS
3. MongoDB
4. Express.js
5. Redux
6. Material UI Icons
7. JWT

# Features

1. Fully Functional Admin, Faculty and Student options
2. Login feature using JWT
3. User authentication using JWT
4. Admin can Update profile details, password in profile section
5. Admin can add delete or get any student, admin or faculty
6. Admin can add new departments and subjects
7. Admin can create new notices
8. Faculty can Update profile details, password in profile section
9. Faculty can create new test, mark attendance or students and also upload marks of created tests
10. Student can Update profile details, password in profile section
11. Student can check their attendance, marks and subject list
12. Error display feature available with form validation
14. Modern UI

# Features to be added later in the future

1. Mobile Responsiveness
2. Sections other than academics
3. More freedom to admin while adding new students,admins,faculties or subjects

# Preview

Admin

https://user-images.githubusercontent.com/90241373/156794210-af4db587-1aba-4289-9196-07f2e179d9bb.mp4

<br>

Faculty

https://user-images.githubusercontent.com/90241373/156794428-1a73579c-8116-45dd-bee4-140f3b6de2c8.mp4

<br>

Student

https://user-images.githubusercontent.com/90241373/156794474-1ba1d10e-30c8-4ce7-881b-520d7ab6aec6.mp4
