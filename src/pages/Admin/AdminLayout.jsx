import React from 'react'
import { Outlet, Link } from "react-router-dom";
import { Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import AdminSidebar from '../../components/AdminSidebar'

const AdminLayout = () => {
  return (
    <div className="min-vh-100 bg-light">
        <div className="py-3">
            <Link to="/" className='px-3'>
                <Button variant="link" className="text-decoration-none text-secondary fw-bold p-0 hover-scale">
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Back
                </Button>
            </Link>
            <div className='d-flex'>
              <AdminSidebar />

              <main className='p-4 flex-fill'>
                <Outlet />
              </main>
            </div>
        </div>
    </div>
  )
}

export default AdminLayout