import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import AdminLayout from './pages/Admin/AdminLayout';
import BlogsDashboard from './pages/Blogs/BlogsDashboard';
import Blogs from './pages/Blogs/Blogs.jsx';
import BlogsEntry from './pages/Blogs/BlogsEntry';
import FAQsDashboard from './pages/FAQs/FAQsDashboard';
import FAQsEntry from './pages/FAQs/FAQsEntry.jsx';
import GalleryDashboard from './pages/Gallery/GalleryDashboard';
import GalleryEntry from './pages/Gallery/GalleryEntry';
import MainLayout from './layouts/MainLayout';
import StandaloneLayout from './layouts/StandaloneLayout';
import './App.css';
import RegisterForm from "./components/RegisterForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import BlogPage from "./pages/Blogs/BlogPage.jsx";
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicOnlyRoute from './components/PublicOnlyRoute.jsx';
import AdminUsersDashboard from './pages/Admin Users/AdminUsersDashboard.jsx';
import AdminUsersEntry from './pages/Admin Users/AdminUsersEntry.jsx';
import FormsGallery from './pages/forms/FormsGallery';
function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* PUBLIC ROUTES (Accessible by everyone) */}
            {/* Main Layout containing NavBar and Footer */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              {/* Add other public routes here */}
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogPage />} />
              <Route path="/forms" element={<FormsGallery />} />
            </Route>


            {/* GUEST ONLY ROUTES (Login/Register) 
              - Logged in users get kicked out to /admin or / */}
            {/* Standalone Layout containing only Back to Home button */}
            <Route element={<StandaloneLayout />}>
              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
              </Route>
            </Route>

            {/* ADMIN ROUTES (Protected)
                - Only users with role 'admin' can enter */}
            {/* Admin Routes wrapped in StandaloneLayout so they have the Back button */}
            <Route element={<StandaloneLayout />} >
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<h1 className='text-center'>Welcome Admin</h1>} />
                  <Route path="blogs" element={<BlogsDashboard />} />
                  <Route path="blogs/:id" element={<BlogsEntry />} />
                  <Route path="faqs" element={<FAQsDashboard />} />
                  <Route path="faqs/:id" element={<FAQsEntry/>} />
                  <Route path="gallery" element={<GalleryDashboard />} />
                  <Route path="gallery/:id" element={<GalleryEntry />} />
                  <Route path="admin-users" element={<AdminUsersDashboard />} />
                  <Route path="admin-users/:id" element={<AdminUsersEntry />} />
                  



                </Route>
              </Route>
            </Route>
            {/* STUDENT ROUTES (Future) */}
            {/* 
            <Route element={<MainLayout />}>
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                 <Route path="/student/courses" element={<Courses />} />
              </Route>
            </Route> 
            */}
            <Route path='*' element={<Navigate to={'/'} />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
