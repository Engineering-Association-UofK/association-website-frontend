import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import BlogsDashboard from "./pages/blogs/BlogsDashboard.jsx";
import FAQsDashboard from "./pages/faqs/FAQsDashboard.jsx";
import GalleryDashboard from "./pages/gallery/GalleryDashboard.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";

const router = createBrowserRouter([
  {path: "/", element: <p>Home</p>},
  {path: "/about", element: <p>About</p>},
  {
    path: "/admin", 
    element: <AdminLayout />, 
    children: [
      {index: true, element: <h1>ADMIN</h1>},
      {path: "blogs", element: <BlogsDashboard />},
      {path: "faqs", element: <FAQsDashboard />},
      {path: "gallery", element: <GalleryDashboard />},
    ]
  },
  {path: "*", element: <p>404 Not Found</p>},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
