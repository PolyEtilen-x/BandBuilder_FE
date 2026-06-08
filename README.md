# 🎯 BandBuilder - IELTS Practice Platform

<div align="center">

[![GitHub Stars](https://img.shields.io/github/stars/PolyEtilen-x/BandBuilder_FE?style=flat-square&logo=github)](https://github.com/PolyEtilen-x/BandBuilder_FE)
[![GitHub Issues](https://img.shields.io/github/issues/PolyEtilen-x/BandBuilder_FE?style=flat-square&logo=github)](https://github.com/PolyEtilen-x/BandBuilder_FE/issues)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-77.1%25-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react)](https://react.dev/)

**An AI-powered IELTS learning platform with real-time feedback, personalized analytics, and AI-powered speaking assessment**

🌐 **[Visit Platform](https://bandbuilder.site)** • 📖 **[View Docs](https://github.com/PolyEtilen-x/BandBuilder_FE/wiki)** • 💬 **[Report Issue](https://github.com/PolyEtilen-x/BandBuilder_FE/issues)**

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 Demo](#-demo)
- [💻 Tech Stack](#-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Configuration](#-configuration)
- [📦 Building & Deployment](#-building--deployment)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [❓ FAQ](#-faq)
- [📝 License](#-license)
- [👥 Team & Credits](#-team--credits)

---

## ✨ Features

### 📚 **IELTS Practice Modules**
- ✅ Full mock tests with exam-like environment
- ✅ Reading, Listening, Writing practice
- ✅ Real-time performance tracking
- ✅ Detailed corrections and feedback
- ✅ Practice with latest Cambridge test sets

### 🤖 **AI Speaking Examiner**
- ✅ Interactive speaking sessions simulating real IELTS interviews
- ✅ Pronunciation and fluency analysis
- ✅ Automated feedback with band score estimation
- ✅ Build confidence through realistic practice

### 📖 **Learning Tools**
- ✅ Integrated dictionary with pronunciation
- ✅ Vocabulary learning system with spaced repetition
- ✅ Grammar lessons and interactive exercises
- ✅ Personalized word collections

### 📊 **Analytics & Progress**
- ✅ Comprehensive learning statistics
- ✅ Performance monitoring dashboard
- ✅ Detailed progress reports
- ✅ Score prediction and progress trends

### 👨‍💼 **Administration Portal**
- ✅ User management and monitoring
- ✅ Content & test management
- ✅ Platform analytics and insights
- ✅ System administration tools

---

## 🎯 Demo

<div align="center">

**🌍 Live Deployments:**

| Platform | URL | Status |
|----------|-----|--------|
| **Main App** | [bandbuilder.site](https://bandbuilder.site) | ✅ Live |


</div>

---

## 💻 Tech Stack

### **Frontend**
<div align="center">

![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38b2ac?style=flat-square&logo=tailwindcss)
![React Router](https://img.shields.io/badge/React_Router-6.x-f44250?style=flat-square)

</div>

**Dependencies:**
- **State Management:** Zustand, Redux Toolkit, TanStack Query
- **HTTP Client:** Axios
- **Real-time:** Socket.IO Client
- **Animation:** Framer Motion
- **UI Components:** Custom + TailwindCSS

### **Backend Stack**
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL + Prisma ORM
- **Cache:** Redis
- **Authentication:** JWT + Passport.js
- **Real-time:** Socket.IO

### **AI & Services**
- **Google Gemini** - Advanced language processing
- **OpenAI** - AI-powered feedback and analysis

### **Infrastructure**
- **Hosting:** AWS EC2
- **Containerization:** Docker
- **Web Server:** Nginx
- **CDN:** Cloudflare
- **CI/CD:** GitHub Actions

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js ≥ 18.0.0
- npm or yarn
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/PolyEtilen-x/BandBuilder_FE.git
cd BandBuilder_FE
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# WebSocket Configuration
VITE_WS_URL=ws://localhost:3000

# Feature Flags
VITE_ENABLE_AI_SPEAKING=true
VITE_ENABLE_ADMIN_PANEL=true

# Analytics
VITE_ANALYTICS_ID=your_analytics_id
```

4. **Start development server**
```bash
npm run dev
```

Server will be available at `http://localhost:5173`

### **Available Scripts**

```bash
# Development
npm run dev          # Start dev server with HMR

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
```

---

## 📁 Project Structure

```
BandBuilder_FE/
├── src/
│   ├── api/              # API client & endpoints
│   ├── assets/           # Static assets (images, fonts, etc.)
│   ├── components/       # Reusable React components
│   │   ├── common/       # Global components (Header, Footer, etc.)
│   │   ├── layout/       # Layout components
│   │   └── features/     # Feature-specific components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components (route-based)
│   ├── routes/           # Route configuration & guards
│   ├── services/         # Business logic & API services
│   ├── store/            # State management (Zustand, Redux)
│   ├── styles/           # Global styles & CSS
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions & helpers
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── public/               # Public static assets
├── .env.example          # Environment variables template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # TailwindCSS configuration
├── package.json          # Project dependencies
└── README.md             # This file
```

---

## 🔧 Configuration

### **Environment Variables**

Essential environment variables for different environments:

**Development:**
```env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
```

**Production:**
```env
VITE_API_URL=https://api.bandbuilder.site
VITE_ENV=production
```

See `.env.example` for complete configuration options.

### **Build Configuration**

The project uses Vite for optimal performance:
- Fast HMR (Hot Module Replacement)
- Optimized bundle splitting
- Tree-shaking and code minification

---

## 📦 Building & Deployment

### **Build for Production**

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### **Preview Production Build**

```bash
npm run preview
```

### **Deployment Targets**

The application is deployed on:
- **Main App:** AWS EC2 with Nginx reverse proxy
- **Admin Panel:** Separate AWS EC2 instance
- **CDN:** Cloudflare for static asset caching
- **CI/CD:** Automated deployment via GitHub Actions

---
## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **Getting Started**

1. **Fork the repository**
```bash
# Click "Fork" on GitHub
```

2. **Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/BandBuilder_FE.git
cd BandBuilder_FE
```

3. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

4. **Make your changes**
- Keep commits atomic and descriptive
- Follow the existing code style
- Update tests if applicable

5. **Commit and push**
```bash
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

6. **Open a Pull Request**
- Provide clear description of changes
- Link to relevant issues
- Wait for review and feedback

### **Code Standards**

- **TypeScript:** Use strict mode, proper typing
- **Formatting:** Run `npm run format` before committing
- **Linting:** Ensure `npm run lint` passes
- **Testing:** Write tests for new features

### **Reporting Issues**

- Use the [Issue Tracker](https://github.com/PolyEtilen-x/BandBuilder_FE/issues)
- Provide detailed reproduction steps
- Include environment information
- Add screenshots or error logs if applicable

---

## ❓ FAQ

**Q: How long does a mock test take?**
A: Full IELTS mock tests typically take 3-4 hours. You can also practice individual sections separately.

**Q: Can I retake tests?**
A: Yes! You can retake any test. Each attempt is tracked in your analytics for progress comparison.

**Q: Is the AI Speaking examiner accurate?**
A: Our AI speaking system uses OpenAI and Google Gemini for analysis. It provides realistic feedback similar to official IELTS scoring.

**Q: Do you offer a mobile app?**
A: Mobile app (React Native) is in development and coming soon!

**Q: Is my data secure?**
A: All data is encrypted in transit (HTTPS/WSS) and at rest. We comply with data protection standards.

**Q: Can I export my test results?**
A: Yes! You can download detailed PDF reports of your test performances.

---

## 📝 License

This project is developed for **educational and research purposes**.

Please ensure you comply with relevant IELTS test content usage policies when using this platform.

---

## 👥 Team & Credits

**Developed with ❤️ by the BandBuilder Team**

### **Key Contributors**
- [@PolyEtilen-x](https://github.com/PolyEtilen-x) - Lead Developer

### **Technologies & Libraries**
We are grateful to the open-source community and all the amazing projects that made BandBuilder possible.

### **Acknowledgments**
- Cambridge IELTS test materials (for reference)
- OpenAI & Google for AI services
- React and Node.js communities

---

## 📞 Support & Contact

- 📧 **Email:** polyetilen.vn@gmail.com
- 💬 **GitHub Issues:** [Report a bug](https://github.com/PolyEtilen-x/BandBuilder_FE/issues)
- 💡 **Discussions:** [Ask a question](https://github.com/PolyEtilen-x/BandBuilder_FE/discussions)

---

<div align="center">

**Made with 💙 by BandBuilder Team**

If you found this project helpful, please consider giving it a ⭐ star!

</div>
