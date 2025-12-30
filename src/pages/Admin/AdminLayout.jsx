import React from 'react'
import { Outlet } from "react-router-dom";
import AdminSidebar from '../../components/AdminSidebar'

const AdminLayout = () => {
  return (
    <div className='d-flex'>
      <AdminSidebar />

      <main className='p-4 flex-fill'>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout