import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import AdminLayout from './pages/Admin/AdminLayout';
import BlogsDashboard from './pages/Blogs/BlogsDashboard';
import BlogsEntry from './pages/Blogs/BlogsEntry';
import FAQsDashboard from './pages/FAQs/FAQsDashboard';
import GalleryDashboard from './pages/Gallery/GalleryDashboard';
import Gallery from './components/Gallery.jsx';
import MainLayout from './layouts/MainLayout';
import StandaloneLayout from './layouts/StandaloneLayout';
import './App.css';
import RegisterForm from "./components/RegisterForm.jsx";
import LoginForm from "./components/LoginForm.jsx";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* Main Layout containing NavBar and Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* Add other public routes here */}
            <Route path="/news" element={<div className="container mt-5"><h2>News Page</h2></div>} />
          </Route>

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
