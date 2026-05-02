# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


<div align="center">

# 🏛️ Engineering Association — University of Khartoum
### Frontend Web Application

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://association-website-frontend.vercel.app)

[🌐 Live Demo](https://association-website-frontend.vercel.app) · [🐛 Report a Bug](https://github.com/Engineering-Association-UofK/association-website-frontend/issues) · [💡 Request a Feature](https://github.com/Engineering-Association-UofK/association-website-frontend/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Architecture & Key Patterns](#-architecture--key-patterns)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)

---

## 🔭 Overview

This is the **React-based frontend** for the Engineering Association at the University of Khartoum. It serves as a bilingual (English 🇬🇧 / Arabic 🇸🇩) platform with full RTL support, providing both a public-facing website and a feature-rich admin dashboard.

The application integrates with a **Java Spring Boot** backend API, uses **Cloudinary** for image management, and includes an AI-powered chat bot for visitor assistance.

---

## ✨ Features

| Area | Highlights |
|------|-----------|
| **Public Pages** | Home, About, Blogs, Gallery with bilingual content |
| **Authentication** | JWT-based login, two-step email verification, role-based access |
| **Blog Management** | Full CRUD with Markdown editor, live preview, image upload, draft/publish/archive status |
| **Admin Dashboard** | Manage users, bot commands, images, and editable site content |
| **Chat Bot** | Floating widget with options-based conversation tree, multi-language |
| **Image Storage** | Cloudinary integration with metadata management and reusable image picker |
| **System Monitoring** | Real-time CPU, memory, disk usage with auto-refresh every 30 seconds |
| **i18n & RTL** | Full English/Arabic support, direction auto-switching, JSON-based translations |
| **Feedback Widget** | Floating feedback button for visitor messages |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **UI Framework** | React 19 |
| **Build Tool** | Vite 7 |
| **Routing** | React Router DOM 7 |
| **UI Components** | React Bootstrap 5, Bootstrap Icons, FontAwesome |
| **Server State** | TanStack React Query 5 |
| **HTTP Client** | Axios (with interceptors) |
| **Markdown** | React Markdown + custom editor component |
| **Image Uploads** | Cloudinary (via backend-signed upload) |
| **Authentication** | JWT stored in `localStorage` / `sessionStorage` |
| **Styling** | CSS Modules, Bootstrap, custom CSS |
| **Linting** | ESLint |
| **Package Manager** | pnpm |

---

## 📁 Project Structure

```
association-website-frontend/
├── public/                     # Static assets
├── src/
│   ├── api/                    # Core API configuration
│   │   ├── axiosClient.js      # Axios instance with auth interceptors
│   │   └── upload.service.js   # Cloudinary upload service
│   │
│   ├── components/             # Reusable UI components
│   │   ├── AdminSidebar.jsx
│   │   ├── EditContentButton.jsx
│   │   ├── Footer.jsx
│   │   ├── Gallery.jsx
│   │   ├── ImageUpload.jsx / ImageUpload2.jsx
│   │   ├── ImagePickerModal/   # Select from existing images
│   │   ├── LoginForm.jsx / RegisterForm.jsx
│   │   ├── NavBar.jsx
│   │   ├── ProtectedRoute.jsx / PublicOnlyRoute.jsx
│   │   ├── TeamSection.jsx
│   │   ├── bot/                # Chat bot widget
│   │   ├── feedback/           # Feedback widget
│   │   ├── home/               # Home page sections
│   │   └── markdown/           # Markdown editor & viewer
│   │
│   ├── config/
│   │   └── index.js            # API URLs, timeouts
│   │
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state & actions
│   │   └── LanguageContext.jsx # i18n (en/ar) with RTL switching
│   │
│   ├── features/               # Feature-based modules
│   │   ├── admin users/
│   │   ├── auth/
│   │   ├── blogs/
│   │   ├── bot commands/
│   │   ├── gallery/
│   │   ├── generics/           # Editable text content
│   │   ├── image storage/
│   │   └── monitoring/
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useBot.js
│   │   ├── useFileUpload.js
│   │   └── useGallery.js
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx      # NavBar + Footer wrapper
│   │   └── StandaloneLayout.jsx# Minimal layout (login/register)
│   │
│   ├── locales/
│   │   ├── en.json             # English translations
│   │   └── ar.json             # Arabic translations
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── About/
│   │   ├── Blogs/
│   │   ├── Admin/
│   │   ├── Admin Users/
│   │   ├── Bot Commands/
│   │   ├── Dashboard/
│   │   ├── Gallery/
│   │   └── Image Storage/
│   │
│   ├── services/
│   │   └── api.js              # Generic API client
│   │
│   ├── utils/
│   │   ├── api.js
│   │   ├── formatters.js       # Bytes, uptime formatting
│   │   └── images/             # Static images
│   │
│   ├── App.jsx                 # Route configuration
│   ├── main.jsx                # App entry point
│   └── index.css / App.css     # Global styles
│
├── .env.example                # Environment variable template
├── .gitignore
├── contribution-guid.md        # Detailed contribution guide
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** 20+
- **pnpm** (recommended) or npm
- A running instance of the **backend API** (Java Spring Boot)
- A **Cloudinary** account for image uploads

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Engineering-Association-UofK/association-website-frontend.git
cd association-website-frontend

# 2. Install dependencies
pnpm install
# or: npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your actual values (see below)

# 4. Start the development server
pnpm dev
# or: npm run dev
```

The app will be available at **http://localhost:5173**.

---

## 🔧 Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```env
# Primary backend API base URL (no trailing slash, no /api suffix)
VITE_API_BASE_URL_RAW="http://localhost:8080"

# Secondary/new backend API base URL
VITE_API_NEW_BASE_URL_RAW="http://localhost:8081"

# Monitoring service URL (separate backend)
VITE_API_MONITOR_URL="http://localhost:8888"
```

> **Note:** Cloudinary credentials (cloud name, API key, upload preset) are handled server-side via the `/api/sign` backend endpoint — do not expose them in the frontend `.env`.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite development server with HMR |
| `pnpm build` | Create optimized production build |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint across the codebase |

---

## 🏗️ Architecture & Key Patterns

### Authentication Flow

- Login submits credentials → receives JWT token
- **Two-step verification**: admin login sends a code to email → user verifies the code
- Token is stored in `localStorage` (if "Remember Me" is checked) or `sessionStorage`
- `AuthContext` exposes: `user`, `login()`, `logout()`, `register()`, `changePassword()`, `sendCode()`, `verifyCode()`, and `isAuthenticated`
- `ProtectedRoute` checks roles before rendering admin pages

### Data Fetching with React Query

All API calls are wrapped in custom hooks following a consistent service → hook pattern:

```js
// 1. Service layer (src/features/blogs/blogs.service.js)
export const blogService = {
  getAll: () => apiClient.get('/api/blogs'),
  create:  (data) => apiClient.post('/api/blogs', data),
  update:  (id, data) => apiClient.put(`/api/blogs/${id}`, data),
  delete:  (id) => apiClient.delete(`/api/blogs/${id}`),
}

// 2. Query hooks (src/features/blogs/useBlogs.js)
export const useBlogs = () =>
  useQuery({ queryKey: ['blogs'], queryFn: blogService.getAll })

export const useCreateBlog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: blogService.create,
    onSuccess: () => qc.invalidateQueries(['blogs']),
  })
}

// 3. Usage in components
const { data: blogs, isLoading } = useBlogs()
const { mutate: createBlog } = useCreateBlog()
```

### Axios Client

`src/api/axiosClient.js` is the single HTTP entry point:

- Automatically attaches the JWT token from storage to every request
- Handles `401` responses by clearing auth state and redirecting to login
- Returns `response.data` directly — no need to unwrap `.data.data`

```js
// Bypass auth for public endpoints
apiClient.get('/public-endpoint', { skipAuth: true })
```

### Image Upload Flow

1. User selects a file → stored as a `File` object in state
2. On form submit, `useFileUpload` calls `uploadService.uploadImage()`
3. The hook hits the backend `/api/sign` endpoint to get a Cloudinary signature
4. File is uploaded directly to Cloudinary from the browser
5. The returned `{ secureUrl, publicId }` is saved to the database via the backend

### Multi-language / RTL

- `LanguageContext` stores the active language (`en` or `ar`) in `localStorage`
- Switching to Arabic sets `document.dir = 'rtl'` automatically
- All UI strings are sourced from `src/locales/en.json` and `src/locales/ar.json`

### Chat Bot

- Conversation tree starts at the `@root` command
- Each command has a `keyword`, `response`, `nextKeywords`, and a `final` flag
- User navigates by clicking option buttons — no free-text input needed
- Bot auto-appears after **2 seconds** for unauthenticated visitors
- Fully supports RTL and multi-language responses

---

## 📡 API Reference

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|:---:|
| `/admin/login` | POST | Admin login | ❌ |
| `/login` | POST | User login | ❌ |
| `/admin/send-code` | POST | Send 2FA verification code | ❌ |
| `/admin/verify` | POST | Verify 2FA code | ❌ |
| `/api/blogs` | GET | List all blogs | ❌ |
| `/api/blogs` | POST | Create a blog post | ✅ |
| `/api/blogs/{id}` | GET / PUT / DELETE | Single blog operations | ✅ |
| `/api/gallery` | GET | List gallery items | ❌ |
| `/api/gallery` | POST | Add gallery item | ✅ |
| `/api/generics/get-batch` | POST | Fetch editable content sections | ❌ |
| `/api/bot/manage` | GET / POST | Bot command CRUD | ✅ |
| `/admin/get` | GET | List admin users | ✅ |
| `/api/sign` | POST | Generate Cloudinary upload signature | ✅ |
| `/api/v1/health/*` | GET | System monitoring endpoints | ✅ |

---

## 🤝 Contributing

Contributions are welcome! Please read the detailed **[Contribution Guide](./contribution-guid.md)** before submitting a PR.

**Quick summary:**

1. Fork the repository and create a feature branch (`git checkout -b feature/my-feature`)
2. Follow the established patterns: services → hooks → pages
3. Keep API logic in service files, not inside components
4. Use React Query for all server state; use local state only for UI
5. Use Bootstrap components + CSS Modules for styling; avoid inline styles
6. Write clear commit messages
7. Open a pull request with a description of what changed and why

For adding a new feature module (e.g., "Events"), see the step-by-step guide in [`contribution-guid.md`](./contribution-guid.md).

---

## 🔍 Troubleshooting

**`Unauthorized! Redirecting to login...`**
> Your JWT has expired or is missing. Check `localStorage` / `sessionStorage` for the `sea-token` key. Ensure the backend is returning a valid token on login.

**Images not uploading**
> Verify that the backend `/api/sign` endpoint is running and returning a valid Cloudinary signature. Also check your browser console for CORS errors.

**React Query data not refreshing after mutation**
> Make sure the `queryKey` in `invalidateQueries()` exactly matches the one used in `useQuery()`. Call `refetch()` manually as a last resort.

**RTL layout looks broken**
> Check that `LanguageContext` is correctly setting `document.dir = 'rtl'` for Arabic. Use Bootstrap's built-in RTL utilities and `[dir="rtl"]` CSS selectors for custom overrides.

**`pnpm dev` fails on first run**
> Ensure your `.env` file exists and all three variables are set. The app will throw on startup if `VITE_API_BASE_URL_RAW` is missing.

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Bootstrap](https://react-bootstrap.netlify.app)
- [TanStack React Query](https://tanstack.com/query/latest)
- [Cloudinary Upload API](https://cloudinary.com/documentation/upload_images)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [React Router DOM](https://reactrouter.com)

---

<div align="center">

Made with ❤️ by the **Engineering Association — University of Khartoum**

</div>
