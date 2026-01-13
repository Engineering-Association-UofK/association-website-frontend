<<<<<<< HEAD
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
            <Route path="/blogs" element={<BlogsPage />} />
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
=======
import { Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import EditorPage from "./Editorpage";
import PreviewPage from "./PreviewPage";
import "./App.css";

function App() {
  const [markdown, setMarkdown] = useState("");

  return (
    <div>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/edit">Editor</Link> | <Link to="/preview">Preview</Link>
      </nav>

      <Routes>
        {}
        <Route
          path="/edit"
          element={<EditorPage markdown={markdown} setMarkdown={setMarkdown} />}
        />
        <Route
          path="/preview"
          element={<PreviewPage markdown={markdown} />}
        />
      </Routes>
    </div>
>>>>>>> 8d577cb (Markdown)
  );
}

export default App;
