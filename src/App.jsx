import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import AdminLayout from './pages/Admin/AdminLayout';
import BlogsDashboard from './pages/Blogs/BlogsDashboard';
import BlogsPage from './pages/Blogs/BlogsPage';
import BlogsEntry from './pages/Blogs/BlogsEntry';
import FAQsDashboard from './pages/FAQs/FAQsDashboard';
import GalleryDashboard from './pages/Gallery/GalleryDashboard';
<<<<<<< HEAD
import Gallery from './components/Gallery.jsx';
=======
import GalleryEntry from './pages/Gallery/GalleryEntry';
import Secretariats from './pages/Secretariats/Secretariats';
import SecretariatPage from './pages/Secretariats/SecretariatPage';
import SecretariatsDashboard from './pages/Secretariats/SecretariatsDashboard';
import SecretariatsEntry from './pages/Secretariats/SecretariatsEntry';
import Verification from './pages/Verification/Verification';
>>>>>>> 13a0b3e (edited secretariats page to display dynamic content only)
import MainLayout from './layouts/MainLayout';
import StandaloneLayout from './layouts/StandaloneLayout';
import './App.css';
import RegisterForm from "./components/RegisterForm.jsx";
import LoginForm from "./components/LoginForm.jsx";

function App() {
  return (
<<<<<<< HEAD
    <LanguageProvider>
      <Router>
        <Routes>
          {/* Main Layout containing NavBar and Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* Add other public routes here */}
            <Route path="/blogs" element={<BlogsPage />} />
          </Route>
=======
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
              <Route path="/secretariats" element={<Secretariats />} />
              <Route path="/secretariats/:id" element={<SecretariatPage />} />
              <Route path="/verification" element={<Verification />} />
            </Route>
>>>>>>> 13a0b3e (edited secretariats page to display dynamic content only)

          {/* Standalone Layout containing only Back to Home button */}
          <Route element={<StandaloneLayout />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            {/* Admin Routes wrapped in StandaloneLayout so they have the Back button */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<h1>Dashboard</h1>} />
              <Route path="blogs" element={<BlogsDashboard />} />
              <Route path="blogs/:id" element={<BlogsEntry />} />
              <Route path="faqs" element={<FAQsDashboard />} />
              <Route path="gallery" element={<GalleryDashboard />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
