import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Home from "./pages/Home/Home";
import AssociationAbout from "./pages/About/association/About.jsx";
import OrganizationStructureAbout from "./pages/About/organizationStructure/About.jsx";
import ThirtiethCouncilAbout from "./pages/About/CouncilOfThirty/About.jsx";
import AdminLayout from "./pages/Admin/AdminLayout";
import Blogs from "./pages/Blogs/blog/Blogs.jsx";
import Donation from "./pages/Blogs/donation/Donation.jsx";
import Issues from "./pages/Blogs/issues/Issues.jsx";
import News from "./pages/Blogs/news/News.jsx";
import Post from "./pages/Blogs/post/Post.jsx";
// import GalleryDashboard from "./pages/Gallery/GalleryDashboard";
// import GalleryEntry from "./pages/Gallery/GalleryEntry";
import MainLayout from "./layouts/MainLayout";
import StandaloneLayout from "./layouts/StandaloneLayout";
import "./App.css";
import RegisterForm from "./components/RegisterForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute.jsx";
import AdminUsersDashboard from "./pages/Admin Users/AdminUsersDashboard.jsx";
import AdminUsersEntry from "./pages/Admin Users/AdminUsersEntry.jsx";
import AdminProfile from "./pages/Admin Profile/AdminProfile.jsx";
import ChangePassword from "./pages/Admin/ChangePassword.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import ImageStorageDashboard from "./pages/Image Storage/ImageStorageDashboard.jsx";
import ImageStorageEntry from "./pages/Image Storage/ImageStorageEntry.jsx";
import { CONFIG } from "./config";
import ProfilePage from "./pages/Profile/ProfilePage.jsx";
import UsersDashboard from './pages/Users/UsersDashboard.jsx';
import UsersEntry from "./pages/Users/UsersEntry.jsx";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton.jsx";
import AdminBotEditor from "./pages/bot/AdminBotEditor.jsx";
import PostsEntry from "./pages/Posts/PostsEntry.jsx";
import PostsDashboard from "./pages/Posts/PostsDashboard.jsx";


function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* PUBLIC ROUTES (Accessible by everyone) */}
            {/* Main Layout containing NavBar and Footer */}
            <Route element={<MainLayout />}  >
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/" element={<Home />} />
              {/* Add other public routes here */}
              <Route path="/about/association" element={<AssociationAbout />} />
              <Route path="/about/organization-structure" element={<OrganizationStructureAbout />} />
              <Route path="/about/council-of-thirty" element={<ThirtiethCouncilAbout />} />
              <Route path="/posts/blogs" element={<Blogs />} />
              <Route path="/posts/donations" element={<Donation />} />
              <Route path="/posts/issues" element={<Issues />} />
              <Route path="/posts/news" element={<News />} />
              <Route path="/posts/:type/:slug" element={<Post />} /> { /* view posts */}
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
            {/* <Route element={<StandaloneLayout />} > */}
            <Route
              element={<ProtectedRoute allowedRoles={CONFIG.ADMIN_ROLES} />}
               
            >
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="posts" element={<PostsDashboard />} />
                  <Route path="posts/:id" element={<PostsEntry />} />
                  {/* <Route path="gallery" element={<GalleryDashboard />} />
                  <Route path="gallery/:id" element={<GalleryEntry />} /> */}

                  <Route element={<ProtectedRoute allowedRoles={["sys:super_admin", "sys:admin_manager"]} />}>
                    <Route path="admin-users" element={<AdminUsersDashboard />} />
                    <Route path="admin-users/:id" element={<AdminUsersEntry />} />
                  </Route>
                  <Route path="users" element={<UsersDashboard />} />
                  <Route path="users/:id" element={<UsersEntry />} />
                  <Route path="admin-profile" element={<AdminProfile />} />
                  <Route path="change-password" element={<ChangePassword />} />
                  <Route
                    path="image-storage"
                    element={<ImageStorageDashboard />}
                  />
                  <Route
                    path="image-storage/:id"
                    element={<ImageStorageEntry />}
                  />
                <Route path="bot" element={<AdminBotEditor />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" />} />
              </Route>
            </Route>
            {/* </Route> */}
            {/* STUDENT ROUTES (Future) */}
            {/* 
            <Route element={<MainLayout />}>
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                 <Route path="/student/courses" element={<Courses />} />
              </Route>
            </Route> 
            */}
            <Route path="*" element={<Navigate to={"/"} />} />
          </Routes>
          <ScrollToTopButton />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
