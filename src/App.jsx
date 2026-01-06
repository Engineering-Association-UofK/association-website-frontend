import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import AdminLayout from './pages/Admin/AdminLayout';
import BlogsDashboard from './pages/Blogs/BlogsDashboard';
import BlogsEntry from './pages/Blogs/BlogsEntry';
import FAQsDashboard from './pages/FAQs/FAQsDashboard';
import GalleryDashboard from './pages/Gallery/GalleryDashboard';
import './App.css';
import RegisterForm from "./components/RegisterForm.jsx";
import LoginForm from "./components/LoginForm.jsx";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <NavBar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              {/* Add other routes as placeholders for now */}
              <Route path="/initiatives" element={<div className="container mt-5"><h2>Initiatives Page</h2></div>} />
              <Route path="/news" element={<div className="container mt-5"><h2>News Page</h2></div>} />
              {/* <Route path="/forms" element={<div className="container mt-5"><h2>Forms Page</h2></div>} /> */}
              <Route path="/admin" element={<AdminLayout />} >
                <Route index element={<h1>Dashboard</h1>} />
                <Route path="blogs" element={<BlogsDashboard />} />
                <Route path="blogs/:id" element={<BlogsEntry />} />
                <Route path="faqs" element={<FAQsDashboard />} />
                <Route path="gallery" element={<GalleryDashboard />} />
              </Route>
              <Route path="/login" element={<LoginForm/>} />
              <Route path="/register" element={<RegisterForm />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
