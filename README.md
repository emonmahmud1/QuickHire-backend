# QuickHire - Backend

This is the backend API for the QuickHire job listing platform. It handles everything related to users, jobs, and applications. The frontend talks to this server to get data and perform actions.

---

## What this server does

- Manages user registration and login using JWT tokens
- Stores and serves job listings
- Handles job applications submitted by visitors
- Protects certain routes so only logged-in users or admins can use them
- Provides an admin seed script to create the first admin account

---

## Tech stack

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

---

## Requirements

Before running this project, make sure you have:

- Node.js version 18 or higher
- A MongoDB database (local or MongoDB Atlas)

---

## How to run locally

1. Go into the backend folder:

```
cd QuickHire-backend
```

2. Install dependencies:

```
npm install
```

3. Create a `.env` file in the root of the backend folder. Use `.env.example` as a reference:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_NAME=Super Admin
ADMIN_EMAIL=admin@quickhire.com
ADMIN_PASSWORD=Admin@123456
FRONTEND_URL=http://localhost:3000
```

4. Start the development server:

```
npm run dev
```

The server will run at `http://localhost:5000`.

---

## Creating the first admin account

Admin accounts cannot be created through the registration form. You need to run the seed script once to create the admin user.

1. Make sure your `.env` file has `ADMIN_EMAIL` and `ADMIN_PASSWORD` set to what you want
2. Run:

```
npm run seed:admin
```

3. The script will print a confirmation when the admin is created
4. If you run it again, it will skip if the admin already exists

After this, log in from the frontend using those credentials and you will be redirected to the Admin Dashboard automatically.

---

## API routes

### Auth

| Method | Route | Description | Access |
|---|---|---|---|
| POST | /api/auth/register | Create a new user account | Public |
| POST | /api/auth/login | Log in and receive a JWT token | Public |
| GET | /api/auth/me | Get the currently logged-in user | Logged-in users |

### Jobs

| Method | Route | Description | Access |
|---|---|---|---|
| GET | /api/jobs | Get all job listings | Public |
| GET | /api/jobs/:id | Get a single job by ID | Public |
| GET | /api/jobs/my/posted | Get jobs posted by the current user | Logged-in users |
| POST | /api/jobs | Post a new job | Logged-in users |
| DELETE | /api/jobs/:id | Delete a job | Admin only |

### Applications

| Method | Route | Description | Access |
|---|---|---|---|
| POST | /api/applications | Submit a job application | Public |
| GET | /api/applications/my | Get applications for your posted jobs | Logged-in users |

---

## How authentication works

When a user logs in, the server returns a JWT token. The frontend stores this token and sends it in the `Authorization` header for protected requests like this:

```
Authorization: Bearer <token>
```

The token is valid for 7 days. After that, the user needs to log in again.

---

## Available scripts

| Command | What it does |
|---|---|
| npm run dev | Starts the server in development mode with auto-reload |
| npm run build | Compiles TypeScript to JavaScript |
| npm start | Runs the compiled production build |
| npm run seed:admin | Creates the admin user in the database |

---

## Project structure

```
src/
  app.ts              - Express app setup and middleware
  index.ts            - Server entry point
  config/
    db.ts             - MongoDB connection
  controllers/
    auth.controller.ts
    job.controller.ts
    application.controller.ts
  middlewares/
    auth.ts           - JWT protect and adminOnly middleware
    errorHandler.ts
    notFound.ts
    validate.ts
  models/
    user.model.ts
    job.model.ts
    application.model.ts
  routes/
    auth.routes.ts
    job.routes.ts
    application.routes.ts
  scripts/
    seedAdmin.ts      - Admin seed script
```
