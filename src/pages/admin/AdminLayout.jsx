import React from 'react'
import { Outlet } from "react-router-dom";
import AdminSidebar from './AdminSidebar'

const AdminLayout = () => {
  return (
    <>
      <AdminSidebar />

      <main style={{ marginInlineStart: 200, padding: "1rem" }}>
        <Outlet />
      </main>
    </>
  )
}

export default AdminLayout