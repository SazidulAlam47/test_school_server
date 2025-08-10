# 🎓 Test School - Backend API

A comprehensive Node.js/Express backend system for managing digital competency assessments and certificate generation.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Test School Backend is a robust assessment platform that allows students to take digital competency tests across multiple levels (A1, A2, B1, B2, C1, C2) and receive certificates via email upon successful completion. The system includes user authentication, test management, scoring algorithms, and automated certificate generation.

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin, Supervisor, Student)
- Password encryption with bcrypt
- Token refresh mechanism

### 📝 Assessment System

- Multi-level competency tests (A1-C2)
- Step-by-step test progression
- Automatic scoring and level certification
- Test attempt tracking and analytics

### 🏆 Certificate Management

- Automated PDF certificate generation
- Email delivery with custom templates
- Certificate verification and download
- Professional certificate design

### 📧 Email System

- Automated email notifications
- Certificate delivery via email
- Custom HTML email templates
- Nodemailer integration

### 👥 User Management

- User registration and profile management
- Admin user seeding
- User role assignment
- Student progress tracking

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **PDF Generation**: PDFKit
- **Validation**: Zod
- **Password Hashing**: bcrypt
- **Development**: ts-node-dev, ESLint, Prettier

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **pnpm**
- **MongoDB** (local or cloud instance)
- **Git**

## 🚀 Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/SazidulAlam47/test_school_server.git
    cd test_school_server
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    # or
    npm install
    ```

3. **Create environment file**

    ```bash
    cp .env.example .env
    ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables))

5. **Start the development server**

    ```bash
    pnpm dev
    # or
    npm run dev
    ```

6. **Build for production**
    ```bash
    pnpm build
    pnpm start
    ```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=mongodb://localhost:27017/test_school

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d
RESET_PASS_TOKEN=your_reset_password_token
RESET_PASS_TOKEN_EXPIRES_IN=15m

# Password Hashing
BCRYPT_SALT_ROUNDS=12

# Email Configuration (Gmail)
NODE_MAILER_EMAIL=your_email@gmail.com
NODE_MAILER_PASSWORD=your_app_password

# Admin Configuration
ADMIN_PASSWORD=admin_password

# Client Configuration
CLIENT_URL=http://localhost:3000
```

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

```
POST   /auth/register          # User registration
POST   /auth/login             # User login
POST   /auth/refresh-token     # Refresh access token
POST   /auth/forgot-password   # Request password reset
POST   /auth/reset-password    # Reset password
```

### User Endpoints

```
GET    /users/profile          # Get user profile
PUT    /users/profile          # Update user profile
GET    /users                  # Get all users (Admin only)
```

### Question Endpoints

```
GET    /questions              # Get questions for current step
POST   /questions              # Create question (Admin only)
PUT    /questions/:id          # Update question (Admin only)
DELETE /questions/:id          # Delete question (Admin only)
```

### Test Attempt Endpoints

```
POST   /test-attempts/start    # Start a new test
POST   /test-attempts/submit   # Submit test answers
GET    /test-attempts/my       # Get user's test attempts
```

### Certificate Endpoints

```
GET    /certificates/my-certificate  # Get user's certificate
GET    /certificates/pdf            # Get certificate PDF info
GET    /certificates/download/:id   # Download certificate PDF
```

## 📁 Project Structure

```
src/
├── app.ts                      # Express app configuration
├── server.ts                   # Server entry point
└── app/
    ├── config/                 # Configuration files
    │   └── index.ts
    ├── constant/               # Application constants
    │   └── error.ts
    ├── DB/                     # Database utilities
    │   └── seedAdmin.ts
    ├── errors/                 # Error handling
    │   └── ApiError.ts
    ├── interface/              # TypeScript interfaces
    │   ├── index.d.ts
    │   └── jwt.interface.ts
    ├── middlewares/            # Express middlewares
    │   ├── auth.ts
    │   ├── globalErrorHandler.ts
    │   ├── notFound.ts
    │   └── validateRequest.ts
    ├── modules/                # Feature modules
    │   ├── auth/               # Authentication module
    │   ├── certificate/        # Certificate management
    │   ├── question/           # Question management
    │   ├── testAttempt/        # Test attempt handling
    │   └── user/               # User management
    ├── routes/                 # API routes
    │   └── index.ts
    └── utils/                  # Utility functions
        ├── bcrypt.ts
        ├── generateCertificatePdf.ts
        ├── sendCertificateEmail.ts
        ├── sendEmail.ts
        └── ...
```

## 📜 Scripts

```bash
# Development
pnpm dev          # Start development server with hot reload

# Production
pnpm build        # Build TypeScript to JavaScript
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
```

## 🎯 Assessment Levels

The system supports 6 competency levels:

- **A1**: Beginner (0-24 points)
- **A2**: Elementary (25-49 points)
- **B1**: Intermediate (50-74 points)
- **B2**: Upper-Intermediate (75-89 points)
- **C1**: Advanced (90-94 points)
- **C2**: Proficient (95-100 points)

## 🔄 Test Flow

1. **Registration**: User creates an account
2. **Login**: User authenticates and receives JWT token
3. **Start Test**: User begins assessment at their current level
4. **Submit Answers**: User submits responses for evaluation
5. **Scoring**: System calculates score and determines progression
6. **Certification**: Upon completion, user receives certificate via email
7. **Download**: User can download certificate through API

## 📧 Email Templates

The system includes professional HTML email templates for:

- Certificate delivery
- Welcome messages
- Password reset instructions
- Test completion notifications

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with Zod
- CORS configuration
- Error handling middleware
- Rate limiting ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Sazidul Alam**

- GitHub: [@SazidulAlam47](https://github.com/SazidulAlam47)

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ using Node.js, Express, and TypeScript
