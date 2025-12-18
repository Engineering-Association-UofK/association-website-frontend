import React from 'react'
import { NavLink } from "react-router-dom";
import './Admin.css'

const AdminSidebar = () => {
  return (
    <aside className='sidebar'>
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
    </aside>
  )
}

export default AdminSidebar