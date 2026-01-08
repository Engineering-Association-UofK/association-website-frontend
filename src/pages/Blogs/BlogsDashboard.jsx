import React, {useState} from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import { useBlogs, useDeleteBlog } from '../../features/blogs/hooks/useBlogs';


const BlogsDashboard = () => {
  const navigate = useNavigate();
  
  const { data: blogs, isLoading, isError, error, refetch } = useBlogs();
  const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog();

  // Local State for Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  // Handlers
  const handleEdit = (id) => {
    navigate(`/admin/blogs/${id}`); // Assuming your route is /admin/blogs/:id
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedBlogId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBlogId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedBlogId) {
      console.log("selectedBlogId ", selectedBlogId);
      
      deleteBlog(selectedBlogId, {
        onSuccess: () => {
          handleCloseModal(); // Close modal on success
        },
        onError: (err) => {
            console.error("Delete failed", err);
            // Optionally set a toast/alert state here
        }
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h4>Blogs</h4>
        <div className="actions-wrapper">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => navigate(`/admin/blogs/0`)}
            >
            <i className="bi pe-none bi-plus"></i>
          </Button>
        </div>
      </div>
      {
        // Loading State
        isLoading ? (
          <Container className="text-center mt-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>
        ) : isError ? (
          <Container className="mt-5">
            <Alert variant="danger">
              <h4>Error loading blogs</h4>
              <p>{error?.message || 'Something went wrong.'}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>
                Try Again
              </Button>
            </Alert>
          </Container>
        ) : (!blogs || blogs.length === 0) ? (
          <Container className="mt-5 text-center">
            <Alert variant="info">No blogs found. Create one to get started!</Alert>
          </Container>
        ) : (
          <Table responsive>
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Content</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                blogs?.map((row) => (
                  <tr 
                    key={row.id}
                    // onClick={() => navigate(`/admin/blogs/${row.id}`)}
                  >
                    <td key="id" >{row["id"]}</td>
                    <td key="title" >{row["title"]}</td>
                    <td key="content" >{row["content"]}</td>
                    <td key="status" >{row["status"]}</td>
                    <td key="createdAt" >
                      {
                        // new Intl.DateTimeFormat('en-GB', {
                        //   year: 'numeric',
                        //   month: 'short',
                        //   day: '2-digit',
                        // }).format(new Date(row["createdAt"]))
                      }
                      {new Intl.DateTimeFormat("en-GB").format(new Date(row["createdAt"]))}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={handleEdit}
                        >
                          <i className="bi pe-none bi-pencil-fill"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleOpenDeleteModal(row.id)}
                        >
                          <i className="bi pe-none bi-trash-fill"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
          
        )
      }

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this blog post? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default BlogsDashboard