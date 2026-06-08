## 🏗️ Technical Architecture

BandBuilder is designed using a modern client-server architecture with separated frontend, mobile, backend, and AI services to ensure scalability, maintainability, and performance.

### System Components

| Layer                   | Technology              |
| ----------------------- | ----------------------- |
| Web Frontend            | React, TypeScript, Vite |
| Mobile App              | React Native, Expo      |
| Backend API             | NestJS, TypeScript      |
| Database                | PostgreSQL              |
| Cache & Session         | Redis                   |
| Authentication          | JWT, Google OAuth 2.0   |
| Real-time Communication | Socket.IO               |
| AI Services             | Gemini API, OpenAI API  |
| Deployment              | AWS EC2, Docker, Nginx  |
| DNS & Security          | Cloudflare              |
| CI/CD                   | GitHub Actions          |

---

### Frontend Architecture

The frontend follows a feature-based architecture and modern React development practices:

* Component-Based Design
* React Router for navigation
* Zustand for lightweight state management
* Redux Toolkit for complex application state
* TanStack Query for server-state management
* Axios for API communication
* Socket.IO Client for real-time features

---

### Backend Architecture

The backend is built using NestJS and follows a modular architecture:

```text
Auth Module
├── JWT Authentication
├── Google OAuth
└── Role-Based Authorization

User Module
├── Profile Management
├── Learning Progress
└── User Analytics

Practice Module
├── IELTS Tests
├── Grammar Practice
└── Vocabulary Practice

AI Module
├── Speaking Evaluation
├── AI Conversation
└── Feedback Generation
```

---

### Database Design

PostgreSQL serves as the primary database for:

* User Management
* Learning Progress Tracking
* Test Results
* Vocabulary Collections
* Practice History
* Analytics Data

Redis is used for:

* Token Management
* Session Storage
* Temporary Caching
* Performance Optimization

---

### Authentication Flow

```text
User
 │
 ├── Email/Password Login
 │
 └── Google OAuth Login
        │
        ▼
     NestJS API
        │
        ▼
   JWT Generation
        │
        ▼
 Access Token + Refresh Token
        │
        ▼
 Protected Resources
```

---

### Infrastructure Architecture

```text
bandbuilder.site
       │
       ▼
Cloudflare
       │
 ┌─────┼─────┐
 │           │
 ▼           ▼
Frontend    API
React       NestJS
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
 PostgreSQL      Redis
      │
      ▼
 AI Services
(Gemini / OpenAI)
```

---

### Software Engineering Practices

* TypeScript Strict Mode
* Modular Architecture
* Feature-Based Structure
* Role-Based Access Control (RBAC)
* RESTful API Design
* Secure Authentication with JWT
* Real-time Communication via WebSockets
* Dockerized Deployment
* Cloudflare CDN & Security Layer
* Automated CI/CD Pipeline

---

### Performance Optimizations

* React Code Splitting
* Lazy Loading
* Query Caching with TanStack Query
* Redis Caching Layer
* Optimized Database Queries
* Static Asset Optimization
* Cloudflare Edge Caching
* Nginx Reverse Proxy

---

### Security Features

* JWT Authentication
* Refresh Token Rotation
* Google OAuth 2.0
* HTTPOnly Cookies
* CORS Protection
* Rate Limiting
* Password Hashing
* Role-Based Access Control
* Cloudflare DDoS Protection
