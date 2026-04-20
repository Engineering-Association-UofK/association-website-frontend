# Engineering Association Website - Frontend

## Project Overview

This is a **React-based frontend** for an Engineering Association website. It provides a bilingual (English/Arabic) platform with:

- Public-facing pages (Home, About, Blogs, Gallery)
- Admin dashboard for managing content, users, bot commands, and images
- AI-powered chat bot for visitor assistance
- Markdown editor for rich content creation
- Cloudinary integration for image uploads
- System health monitoring dashboard

The application uses **JWT authentication** with role-based access control (RBAC) and integrates with a backend API (Java Spring Boot assumed).

---

## Tech Stack

| Category | Technologies |
|----------|--------------|
| Core | React 19, React Router DOM 7 |
| Build Tool | Vite 7 |
| UI Library | React Bootstrap 5, Bootstrap Icons |
| State & Data Fetching | TanStack React Query 5 |
| HTTP Client | Axios |
| Markdown | React Markdown + custom editor |
| Authentication | JWT (stored in localStorage/sessionStorage) |
| Image Upload | Cloudinary (via backend signing) |
| Icons | FontAwesome, Bootstrap Icons |
| Styling | CSS Modules, Bootstrap, custom CSS |

---

## Project Structure

```
src/
├── api/                    # Core API configuration
│   ├── axiosClient.js      # Axios instance with interceptors
│   └── upload.service.js   # Cloudinary upload service
│
├── components/             # Reusable UI components
│   ├── AdminSidebar.jsx
│   ├── EditContentButton.jsx
│   ├── Footer.jsx
│   ├── Gallery.jsx
│   ├── ImageUpload.jsx / ImageUpload2.jsx
│   ├── ImagePickerModal/   # Select from existing images
│   ├── LoginForm.jsx / RegisterForm.jsx
│   ├── NavBar.jsx
│   ├── ProtectedRoute.jsx / PublicOnlyRoute.jsx
│   ├── TeamSection.jsx
│   ├── bot/                # Chat bot widget
│   ├── feedback/           # Feedback widget
│   ├── home/               # Home page sections
│   └── markdown/           # Markdown editor & viewer
│
├── config/                 # Environment config
│   └── index.js            # API URLs, timeout
│
├── context/                # React contexts
│   ├── AuthContext.jsx     # Authentication state
│   └── LanguageContext.jsx # i18n (en/ar)
│
├── features/               # Feature-based modules
│   ├── admin users/        # Admin user management
│   ├── auth/               # Authentication service
│   ├── blogs/              # Blog CRUD
│   ├── bot commands/       # Chat bot command management
│   ├── gallery/            # Gallery management
│   ├── generics/           # Editable text content
│   ├── image storage/      # Image library management
│   └── monitoring/         # System health dashboard
│
├── hooks/                  # Custom hooks
│   ├── useBot.js           # Chat bot logic
│   ├── useFileUpload.js    # Image upload abstraction
│   └── useGallery.js       # Gallery data fetching
│
├── layouts/                # Layout wrappers
│   ├── MainLayout.jsx      # With NavBar + Footer
│   └── StandaloneLayout.jsx # Minimal (login/register)
│
├── locales/                # Translation files
│   ├── en.json
│   └── ar.json
│
├── pages/                  # Page components
│   ├── Home/
│   ├── About/
│   ├── Blogs/              # Public blog listing + detail
│   ├── Admin/              # Admin layout + change password
│   ├── Admin Users/        # CRUD for admin users
│   ├── Bot Commands/       # CRUD for bot commands
│   ├── Dashboard/          # System monitoring
│   ├── Gallery/            # Admin gallery CRUD
│   └── Image Storage/      # Image library management
│
├── services/               # API service layer
│   └── api.js              # Generic API client
│
├── utils/                  # Utilities
│   ├── api.js
│   ├── formatters.js       # Bytes, uptime formatting
│   └── images/             # Static images
│
├── App.jsx                 # Routes configuration
├── main.jsx                # Entry point
└── index.css / App.css     # Global styles
```

---

## Core Features

### 1. Authentication & Authorization
- Login as admin or regular user
- JWT stored in `localStorage` (remember me) or `sessionStorage`
- Role-based access: `ROLE_CONTENT_EDITOR`, `ROLE_SUPER_ADMIN`, etc.
- Protected routes via `ProtectedRoute` component
- Two-step verification for admin login (code sent to email)

### 2. Blog Management
- Full CRUD operations for blog posts
- Markdown editor with live preview
- Image upload (Cloudinary) with alt text
- Status: draft / published / archived
- Public blog listing with search and featured post

### 3. Admin User Management
- Create/update/delete admin users
- Assign roles (Content Editor, User Manager, Super Admin, etc.)
- Email update capability
- Verification status tracking

### 4. Bot Commands Management
- Configure conversational flow for the chat bot
- Each command has: keyword, trigger text, response text, next possible keywords
- Multi-language support (English, Arabic, French)
- Visual tree structure via checkbox selection

### 5. Image Storage & Gallery
- Upload images to Cloudinary
- Store metadata in backend
- Publish/unpublish images to news section
- Clear unused images
- Image picker modal to reuse stored images

### 6. Editable Content (Generics)
- Admin-editable text sections (Hero, About, Mission, Vision, etc.)
- Update via inline edit buttons
- Multi-language support
- Supports HTML in body content

### 7. System Monitoring Dashboard
- Real-time system health (CPU, memory, disk)
- Application uptime
- Auto-refresh every 30 seconds
- Visual indicators (success/warning/danger)

### 8. Chat Bot (Floating Widget)
- Contextual conversation with predefined commands
- Appears automatically after 2 seconds for unauthenticated users
- Supports RTL for Arabic
- Options-based navigation

### 9. Feedback Widget
- Floating button for user feedback
- Captures message + optional contact info
- Sends to monitoring backend

### 10. Multi-language Support
- English / Arabic (RTL support)
- Language persisted in localStorage
- All UI text from JSON files

---

## Key Code Patterns to Understand

### Data Fetching with React Query

All API calls are wrapped in custom hooks following this pattern:

```javascript
// service file
export const blogService = {
  getAll: () => apiClient.get('/api/blogs'),
  create: (data) => apiClient.post('/api/blogs', data),
}

// hook file
export const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs', 'list'],
    queryFn: () => blogService.getAll(),
  })
}

export const useCreateBlog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: blogService.create,
    onSuccess: () => queryClient.invalidateQueries(['blogs', 'list']),
  })
}
```

**Usage in components:**
```javascript
const { data: blogs, isLoading } = useBlogs()
const { mutate: createBlog } = useCreateBlog()
```

### Axios Client with Interceptors

`axiosClient.js` is the central HTTP client:
- Automatically attaches JWT token to requests
- Handles 401 responses by clearing auth and redirecting to login
- Returns `response.data` directly (no need for `.data.data`)

**Skip auth when needed:**
```javascript
apiClient.get('/public-endpoint', { skipAuth: true })
```

### Image Upload Flow

1. User selects a file → component stores as `File` object
2. On form submit, `useFileUpload` hook calls `uploadService.uploadImage()`
3. Backend signing endpoint (`/api/sign`) returns Cloudinary signature
4. Image uploaded directly to Cloudinary
5. Returns `{ secureUrl, publicId }` saved to database

### Authentication Context

`AuthContext` provides:
- `user` (with roles, type, name, email)
- `login()`, `logout()`, `register()`, `changePassword()`
- `sendCode()`, `verifyCode()` for two-step verification
- `isAuthenticated` flag

**Important:** Token is stored in `localStorage` if "Remember Me" checked, otherwise `sessionStorage`.

### Markdown Editor

Custom `MDEdit` component features:
- Toolbar with formatting buttons (bold, italic, headings, lists, links, images)
- Live preview toggle
- Image insertion with width/alignment options
- Uses `textarea` with selection manipulation

### Bot Conversation Flow

- Bot starts with `@root` command
- Each response includes `nextKeywords` array
- User clicks option buttons to navigate
- Supports multi-language responses
- `final` flag indicates conversation end

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Backend API (without /api suffix)
VITE_API_BASE_URL_RAW=http://localhost:8080

# Monitoring service (separate backend)
VITE_API_MONITOR_URL=http://localhost:8888

# Cloudinary configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_PRESET=your_upload_preset
```

**Note:** The backend signing endpoint (`/api/sign`) must be implemented to return a signature.

---

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- Backend API running (Java Spring Boot assumed)
- Cloudinary account

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd ea

# Install dependencies
npm install

# Create .env file with your configuration
cp .env.example .env

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## How to Contribute

### Adding a New Feature (e.g., "Events" management)

1. **Create feature folder** under `src/features/events/`
2. **Create API service** (`api/events.service.js`):
   ```javascript
   import apiClient from '../../../api/axiosClient'
   const ENDPOINT = '/api/events'
   export const eventsService = { getAll, create, update, delete }
   ```
3. **Create React Query hooks** (`hooks/useEvents.js`):
   - `useEvents` (query)
   - `useCreateEvent`, `useUpdateEvent`, `useDeleteEvent` (mutations)
4. **Create page components** in `src/pages/Events/`:
   - `EventsDashboard.jsx` (list with CRUD actions)
   - `EventsEntry.jsx` (form for create/edit)
5. **Add routes** in `App.jsx` inside `<Route element={<ProtectedRoute allowedRoles={['admin']} />}>`
6. **Add sidebar link** in `AdminSidebar.jsx`

### Code Style Guidelines

- Use functional components with hooks
- Keep API logic in service files, not in components
- Use React Query for all server state
- Use Bootstrap components with custom CSS modules when needed
- Follow existing naming conventions (PascalCase for components, camelCase for functions)

### Common Patterns to Follow

```javascript
// Form submission with upload
const handleSubmit = async (e) => {
  e.preventDefault()
  const finalImage = await upload(formData.image)
  createMutation.mutate({ ...formData, image: finalImage })
}

// Error handling with Alert
{error && <Alert variant="danger">{error.message}</Alert>}

// Loading state
{isLoading && <Spinner animation="border" />}
```

---

## API Endpoints Reference

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/admin/login` | POST | Admin login | No |
| `/login` | POST | User login | No |
| `/admin/send-code` | POST | Send verification code | No |
| `/admin/verify` | POST | Verify 2FA code | No |
| `/api/blogs` | GET/POST | List/Create blogs | No/Yes |
| `/api/blogs/{id}` | GET/PUT/DELETE | Single blog operations | Yes |
| `/api/gallery` | GET/POST | List/Create gallery items | No/Yes |
| `/api/generics/get-batch` | POST | Fetch editable content | No |
| `/api/bot/manage` | GET/POST | Bot command CRUD | Yes |
| `/admin/get` | GET | List admin users | Yes |
| `/api/sign` | POST | Cloudinary signature | Yes |
| `/api/v1/health/*` | GET | System monitoring | Yes |

---

## Troubleshooting

### "Unauthorized! Redirecting to login..."
- Your JWT token expired or is invalid
- Check `localStorage` / `sessionStorage` for `sea-token`
- Backend might be returning 401

### Images not uploading
- Verify Cloudinary env variables are set
- Check that `/api/sign` endpoint returns a valid signature
- Look for CORS errors in browser console

### React Query data not refreshing
- Ensure `queryKey` matches between query and invalidation
- Check `staleTime` configuration
- Call `refetch()` manually if needed

### RTL layout issues
- Language context sets `document.dir = 'rtl'` for Arabic
- Use Bootstrap's built-in RTL support
- Custom CSS should use `[dir="rtl"]` selectors

---

## Useful Resources

- [React Bootstrap Documentation](https://react-bootstrap.netlify.app/)
- [TanStack React Query](https://tanstack.com/query/latest)
- [Cloudinary Upload Documentation](https://cloudinary.com/documentation/upload_images)
- [React Markdown](https://github.com/remarkjs/react-markdown)

---

**Need help?** Reach out to the original developer or check inline comments in the code. The project follows consistent patterns across all features, so you can use existing modules as templates for new ones.