import React from 'react'
import { NavLink } from "react-router-dom";
import '../pages/Admin/Admin.css'

const AdminSidebar = () => {
  return (
    <>
    
      <div className="d-flex flex-column  p-3 bg-body-tertiary" style={{width: "200px", height: 'calc(100dvh - 114px)'}}> 
        {/* <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"> 
          <svg className="bi pe-none me-2" width="40" height="32" aria-hidden="true"> <use xlink:href="#bootstrap"></use> </svg> 

          <span className="fs-4">Sidebar</span> 
        </a> 
        <hr></hr>  */}
        <ul className="nav nav-pills flex-column mb-auto"> 
          <li className="nav-item"> 
            <NavLink to="/admin/blogs" className="nav-link text-white">
              <i className="bi pe-none bi-newspaper me-2"></i>
              Blogs
            </NavLink>
          </li> 
          <li className="nav-item"> 
            <NavLink to="/admin/faqs" className="nav-link text-white">
              <i className="bi pe-none bi-chat-left-text me-2"></i>
              FAQs
            </NavLink>
          </li> 
          <li className="nav-item"> 
            <NavLink to="/admin/gallery" className="nav-link text-white">
              <i className="bi pe-none bi-image me-2"></i>
              Gallery
            </NavLink>
          </li>
        </ul> 
        <hr></hr> 
        <div className="dropdown"> 
          <a href="#" className="d-flex align-items-center link-body-emphasis text-decoration-none" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2"></img>
            <strong>Admin User</strong> 
          </a> 
        </div> 
      </div>

      {/* <aside className='sidebar'>
        <h3>Admin</h3>

        <NavLink to="/admin/blogs" className='link'>
          Blogs
        </NavLink>
        <NavLink to="/admin/faqs" className='link'>
          FAQs
        </NavLink>
        <NavLink to="/admin/gallery" className='link'>
          Gallery
        </NavLink>
      </aside> */}
    </>
    
  )
}

export default AdminSidebar