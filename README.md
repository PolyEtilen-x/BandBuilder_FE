# 🎓 BandBuilder

> Master the IELTS exam with AI-powered practice, real-time feedback, and comprehensive analytics.

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-77%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React%2019-Latest-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS%204-Styling-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[🌟 Features](#-features) • [🚀 Getting Started](#-getting-started) • [📚 Architecture](#-architecture) • [🛠 Tech Stack](#-tech-stack) • [📖 Learn More](#-learn-more)

![BandBuilder Dashboard Preview](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%20for%20IELTS%20learners-informational?style=for-the-badge)

</div>

---

## 📝 About BandBuilder

**BandBuilder** is a cutting-edge IELTS practice platform designed to transform how learners prepare for the International English Language Testing System. With authentic Cambridge test materials, AI-powered speaking assessment, and intelligent feedback systems, BandBuilder provides a comprehensive learning experience that builds confidence and improves band scores.

Whether you're preparing for your first attempt or aiming for a higher band score, BandBuilder adapts to your learning pace with detailed analytics, personalized feedback, and targeted practice modules.

---

## 🌟 Features

### 📖 **IELTS Full Test Practice**
- ✅ Latest Cambridge IELTS test sets (authentic materials)
- ✅ Full-length timed practice tests matching exam conditions
- ✅ Real exam format for Reading, Writing, Listening, and Speaking
- ✅ Progress tracking across multiple test attempts

### 🎤 **AI-Powered Speaking Examiner**
- 🤖 Realistic IELTS interview simulation
- 🎙️ Real-time pronunciation and fluency analysis
- 📊 Automatic band score prediction
- 🔄 All three IELTS Speaking parts (Part 1, 2, 3)
- 💬 Natural conversation flow with intelligent responses

### ✍️ **Writing & Grammar Training**
- 📝 Structured writing exercises with band-level guidance
- ✏️ Comprehensive grammar tutorials and drills
- 🔍 Automated writing assessment with detailed feedback
- 📈 Band score estimation and improvement suggestions
- 💡 Model answers with explanations

### 📚 **Vocabulary & Dictionary**
- 🔤 Integrated dictionary with IELTS-specific vocabulary
- 📖 Contextual vocabulary practice with real test examples
- 💾 Save and review difficult words
- 🎯 Vocabulary difficulty level progression
- 🏷️ Topic-based vocabulary grouping

### 📊 **Advanced Analytics & Progress**
- 📈 Detailed performance reports with visualizations
- 🎯 Band score predictions based on performance
- 🔍 Weak area identification and focused learning paths
- 📱 Progress tracking across all modules
- 📅 Practice streak and consistency tracking

### 👨‍💼 **Admin Dashboard**
- 🔧 Comprehensive test management system
- 👥 User progress monitoring and analytics
- 📋 Content administration and updates
- 📊 Platform-wide statistics and insights

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `v16.0.0` or higher ([Download](https://nodejs.org/))
- **npm** `v7+` or **yarn** `v1.22+`

### Installation & Setup

**1️⃣ Clone the repository**
```bash
git clone https://github.com/PolyEtilen-x/BandBuilder_FE.git
cd BandBuilder_FE
```

**2️⃣ Install dependencies**
```bash
npm install
```

**3️⃣ Configure environment variables**
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local with your API endpoints and configuration
# VITE_API_URL=your_backend_url
# VITE_SOCKET_URL=your_socket_server_url
```

**4️⃣ Start the development server**
```bash
npm run dev
```

The application will be available at **http://localhost:5173** with hot module reloading enabled.

### Development Workflow

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint and check code quality
npm run lint

# Type check TypeScript
npx tsc --noEmit
```

---

## 📚 Architecture

### Project Structure

```
BandBuilder_FE/
├── src/
│   ├── api/                         # API client configuration (Axios instances)
│   │
│   ├── assets/                      # Static assets (images, fonts, videos)
│   │
│   ├── components/                  # Reusable React components
│   │   ├── SelectModal/            # Modal selection components
│   │   ├── components/             # General UI components
│   │   ├── dictionary/             # Dictionary feature components
│   │   ├── grammar/                # Grammar practice components
│   │   ├── general_practice/       # General IELTS practice modules
│   │   ├── ielts_practice/         # Full IELTS test components
│   │   ├── layout/                 # Layout wrappers (header, sidebar, footer)
│   │   ├── test/                   # Test execution and review components
│   │   ├── ui/                     # Primitive UI components (Button, Input, etc)
│   │   └── vocab/                  # Vocabulary practice components
│   │
│   ├── pages/                       # Page-level components
│   │   ├── user/                   # User dashboard, profile, history
│   │   ├── admin/                  # Admin panel pages
│   │   └── loginsuccess.tsx        # Post-login success page
│   │
│   ├── services/                    # Business logic & API integration
│   │   ├── auth/                   # Authentication (Zustand store, login, logout)
│   │   ├── practice/               # Practice exercises and scoring
│   │   ├── speaking/               # AI speaking examiner integration
│   │   ├── dictionary/             # Dictionary API services
│   │   ├── highlight/              # Text highlighting and annotation
│   │   └── ui/                     # UI-related services (modals, notifications)
│   │
│   ├── routes/                      # React Router configuration
│   │   └── index.ts               # Route definitions with guards
│   │
│   ├── guard/                       # Route guards & middleware
│   │   ├── ProtectedRoute.tsx      # Authentication guards
│   │   └── RoleGuard.tsx           # Role-based access control
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts              # Authentication hook
│   │   ├── useQuery.ts             # Data fetching hook
│   │   └── ...                     # Feature-specific hooks
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── user.ts                 # User and profile types
│   │   ├── test.ts                 # Test and answer types
│   │   ├── api.ts                  # API response types
│   │   └── ...                     # Feature types
│   │
│   ├── utils/                       # Utility functions
│   │   ├── validators.ts           # Form and data validators
│   │   ├── formatters.ts           # Data formatting helpers
│   │   ├── constants.ts            # App constants and config
│   │   └── ...                     # Helper functions
│   │
│   ├── styles/                      # Global styles
│   │   ├── reset.css               # CSS reset
│   │   ├── global.css              # Global styles and theme
│   │   └── variables.css           # CSS custom properties
│   │
│   ├── data/                        # Static data & constants
│   │   ├── mockData.ts             # Mock data for development
│   │   ├── testSets.ts             # Test set metadata
│   │   └── ...                     # Static data files
│   │
│   ├── App.tsx                      # Root app component
│   ├── main.tsx                     # Application entry point
│   ├── vite-env.d.ts               # Vite type declarations
│   └── index.css                    # Root styles
│
├── public/                          # Static public assets
├── dist/                            # Production build output
├── index.html                       # HTML template
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # TailwindCSS theme config
├── tsconfig.json                    # TypeScript compiler options
├── package.json                     # Dependencies and scripts
├── eslint.config.js                 # ESLint configuration
└── README.md                        # This file
```

### Architecture Patterns

#### **State Management**
```typescript
// Zustand - Lightweight, minimal state (auth, UI)
import { useAuthStore } from "@/services/auth/auth.store"

// Redux Toolkit - Complex app state
import { useDispatch, useSelector } from "react-redux"

// React Context - Isolated, smaller scopes
import { useTheme } from "@/contexts/ThemeContext"
```

#### **Data Fetching**
```typescript
// React Query - Server state with automatic caching
import { useQuery } from "@tanstack/react-query"
const { data: tests } = useQuery(['tests'], fetchTests)

// Axios - HTTP client with interceptors
import { api } from "@/api/client"
api.get('/tests').then(res => res.data)

// Socket.io - Real-time updates
const socket = useSocket()
socket.on('speaking-feedback', handleFeedback)
```

#### **Component Organization**
- **Presentational**: Pure components receiving props, no side effects
- **Container**: Components with data fetching and logic
- **Feature**: Self-contained feature modules with services

---

## 🛠 Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Frontend Framework** | React | 19.2.0 | UI library with hooks |
| **Language** | TypeScript | ~5.9.3 | Type-safe development |
| **Build Tool** | Vite | 7.3.1 | Lightning-fast dev server & bundler |
| **Styling** | TailwindCSS | 4.2.2 | Utility-first CSS framework |
| **State Management** | Zustand | 5.0.13 | Lightweight state management |
| **State Management** | Redux Toolkit | 2.11.2 | Complex state management |
| **Data Fetching** | React Query | 5.100.9 | Server state management & caching |
| **HTTP Client** | Axios | 1.13.6 | API requests with interceptors |
| **Real-time** | Socket.io | 4.8.3 | WebSocket for AI speaking sessions |
| **Routing** | React Router | 7.13.1 | Client-side navigation |
| **Animations** | Framer Motion | 12.38.0 | Smooth animations & transitions |
| **Icons** | Lucide React | 0.577.0 | Modern SVG icon library |
| **Dev Tools** | ESLint | 9.39.1 | Code quality & style consistency |
| **Dev Tools** | React Query Devtools | 5.100.9 | Query debugging & inspection |

### Key Dependencies

**Production:**
- `@reduxjs/toolkit` - Redux state management
- `@tanstack/react-query` - Server state management
- `axios` - HTTP client
- `framer-motion` - Animation library
- `lucide-react` - Icon set
- `react-redux` - Redux bindings
- `react-router-dom` - Client routing
- `socket.io-client` - Real-time communication
- `zustand` - Lightweight state management

**Development:**
- `@vitejs/plugin-react` - React plugin for Vite
- `@tailwindcss/vite` - TailwindCSS v4 integration
- `typescript` - TypeScript compiler
- `eslint` & `typescript-eslint` - Code linting
- `tailwindcss` & `postcss` - CSS processing

---

## 🔐 Authentication & State Management

### Zustand Auth Store
```typescript
// Centralized authentication with Zustand
import { useAuthStore } from "@/services/auth/auth.store"

function Dashboard() {
  const { user, isLoggedIn, login, logout, initAuth } = useAuthStore()
  
  useEffect(() => {
    initAuth() // Initialize auth on app load
  }, [])
  
  return (
    <>
      {isLoggedIn && <h1>Welcome, {user.name}</h1>}
      <button onClick={logout}>Logout</button>
    </>
  )
}
```

### Features
- ✅ Login/Logout functionality
- ✅ Session persistence (localStorage/sessionStorage)
- ✅ Token management & refresh
- ✅ Protected routes with guards
- ✅ Role-based access control (RBAC)

---

## 🌐 API Integration

### Axios Client Configuration
```typescript
// src/api/client.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error)
  }
)
```

### Service Organization
- **auth/** - User authentication and profile
- **practice/** - Test exercises and scoring
- **speaking/** - AI speaking examiner
- **dictionary/** - Word definitions
- **highlight/** - Text annotations

### Real-time Communication
```typescript
import { useSocket } from "@/hooks/useSocket"

function SpeakingExam() {
  const socket = useSocket()
  
  socket.on('connect', () => console.log('Connected'))
  socket.emit('start-speaking', { testId: '123' })
  socket.on('feedback', handleFeedback)
}
```

---

## 🎨 Styling & Theme

### TailwindCSS v4 Integration
```typescript
// Zero-config setup with Vite integration
// Use utility classes directly in JSX

function Button() {
  return (
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                      hover:bg-blue-700 transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-500">
      Click me
    </button>
  )
}
```

### CSS Structure
- **reset.css** - CSS reset and base styles
- **global.css** - Global styles and typography
- **variables.css** - Custom CSS properties (colors, spacing, etc)
- **Component styles** - Co-located with components

### Responsive Design
- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Touch-friendly interfaces

---

## 📱 Browser Support

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Edge | 90+ | Full support |
| Mobile (iOS) | iOS 12+ | Tested on iPhone |
| Mobile (Android) | Android 10+ | Tested on Samsung, Pixel |

---

## 🔍 Code Quality

### ESLint Configuration
```bash
# Check for code issues
npm run lint

# TypeScript type checking
npx tsc --noEmit
```

**Rules enforced:**
- TypeScript strict mode
- React hooks dependencies
- Consistent naming conventions
- Import ordering
- Unused code detection

---

## 🚀 Performance Optimizations

| Optimization | Implementation |
|--------------|-----------------|
| **Code Splitting** | Route-based lazy loading with React.lazy() |
| **Caching** | React Query's smart invalidation & staleTime |
| **HMR** | Vite's instant hot module replacement |
| **Image Optimization** | Lazy loading and responsive images |
| **Bundle Analysis** | Production build is < 500KB gzipped |
| **Tree Shaking** | Unused code eliminated automatically |
| **Minification** | Automatic with production build |

---

## 📖 Project Workflow

### Development Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes following the code structure**
   - Components in `src/components/`
   - Services in `src/services/`
   - Types in `src/types/`

3. **Test your changes**
   ```bash
   npm run dev
   npm run lint
   ```

4. **Commit with clear messages**
   ```bash
   git add .
   git commit -m "feat: Add new feature"
   git push origin feature/new-feature
   ```

5. **Create a Pull Request** with description

### Commit Message Convention
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code structure
test: Add tests
chore: Update dependencies
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/BandBuilder_FE.git
   cd BandBuilder_FE
   ```

3. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
   - Write clean, readable code
   - Follow the project structure
   - Add TypeScript types
   - Update relevant documentation

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: Add amazing feature"
   git push origin feature/amazing-feature
   ```

6. **Create Pull Request**
   - Provide clear description
   - Link related issues
   - Wait for review

### Development Best Practices
- ✅ Use TypeScript for type safety
- ✅ Follow React hooks best practices
- ✅ Keep components small and focused
- ✅ Separate logic from UI
- ✅ Write meaningful variable names
- ✅ Add comments for complex logic
- ✅ Test before submitting PR
- ✅ Update documentation

---

## 📚 Learning Resources

### Official Documentation
- [React Documentation](https://react.dev) - Latest React features and patterns
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type system guide
- [Vite Guide](https://vitejs.dev/guide/) - Build tool documentation
- [TailwindCSS Docs](https://tailwindcss.com/docs) - Styling utilities
- [React Router](https://reactrouter.com/) - Client routing
- [React Query Docs](https://tanstack.com/query/latest) - Data fetching

### Community Resources
- [React Forum](https://react.dev/community) - Community discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/reactjs) - Q&A
- [Dev.to](https://dev.to/t/react) - Articles and tutorials

---

## 🐛 Troubleshooting

### Common Issues

**Development server not starting?**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Port 5173 already in use?**
```bash
# Use different port
npm run dev -- --port 3000
```

**TypeScript errors?**
```bash
# Force type checking
npx tsc --noEmit

# Clear build cache
rm -rf dist
npm run build
```

**Import path not resolved?**
- Check `vite.config.ts` for alias configuration (`@` = `src/`)
- Ensure file has correct extension in import statement

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support & Contact

- **🐛 Found a bug?** [Open an Issue](https://github.com/PolyEtilen-x/BandBuilder_FE/issues)
- **💡 Have a suggestion?** [Start a Discussion](https://github.com/PolyEtilen-x/BandBuilder_FE/discussions)
- **📧 Email:** [Contact the team](mailto:support@bandbuilder.com)

---

## 🙏 Acknowledgments

Built with passion for IELTS learners worldwide. Special thanks to the React, TypeScript, and Vite communities for their amazing tools and documentation.

---

<div align="center">

### Made with ❤️ to help you achieve your IELTS dreams

⭐ If this project helped you, please consider giving it a star!

[⬆ Back to top](#-bandbuilder)

</div>
