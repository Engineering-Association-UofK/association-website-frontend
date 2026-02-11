import React from 'react'
import { NavLink } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import '../pages/Admin/Admin.css'

const AdminSidebar = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(`/`);
  }

  return (
    <>
      <div className="d-flex flex-column  p-3 bg-body-tertiary" style={{width: "200px", marginBottom: '-16px', height: 'calc(100dvh - 42px - 16px)', borderRight: 'var(--bs-border-width) solid var(--bs-border-color)'}}> 
        <ul className="nav nav-pills flex-column mb-auto"> 
          <li className="nav-item"> 
            <NavLink to="/admin/blogs" className="nav-link">
              <i className="bi pe-none bi-newspaper me-2"></i>
              Blogs
            </NavLink>
          </li> 
          <li className="nav-item"> 
            <NavLink to="/admin/faqs" className="nav-link">
              <i className="bi pe-none bi-chat-left-text me-2"></i>
              FAQs
            </NavLink>
          </li> 
          <li className="nav-item"> 
            <NavLink to="/admin/gallery" className="nav-link">
              <i className="bi pe-none bi-image me-2"></i>
              Gallery
            </NavLink>
          </li>
          <li className="nav-item"> 
            <NavLink to="/admin/admin-users" className="nav-link">
              <i className="bi pe-none bi-person me-2"></i>
              <div>Admin Users</div>
            </NavLink>
          </li>
          <li className="nav-item"> 
            <NavLink to="/admin/bot-commands" className="nav-link">
              <i className="bi pe-none bi-chat me-2"></i>
              <div>Bot Commands</div>
            </NavLink>
          </li>
        </ul> 
        <hr></hr> 
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <img 
              src="/src/utils/images/person.svg" 
              alt="admin" 
              width="32" 
              height="32" 
              className="rounded-circle me-2 bg-dark-subtle"></img>
            <strong>Admin</strong> 
          </div>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={handleLogout}
          >
            <h5 className='m-0'>
              <i className="bi pe-none bi-box-arrow-left"></i>
            </h5>
          </Button>
        </div>
      </div>
    </>
    
  )
}

export default AdminSidebar