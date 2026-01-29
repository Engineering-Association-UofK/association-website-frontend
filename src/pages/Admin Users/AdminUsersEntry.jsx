import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useCreateAdminUser, useUpdateAdminUser, useAdminUser } from '../../features/admin users/hooks/useAdminUsers';

const AdminUsersEntry = () => {

  const { id } = useParams();
  
  const navigate = useNavigate();

  const isEditMode = id && id !== '0';

  const createMutation = useCreateAdminUser();
  const updateMutation = useUpdateAdminUser();

  const { 
      data: fetchedAdminUser, 
      isLoading: isLoadingData, 
      isError: isFetchError 
  } = useAdminUser(id);

  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    email: "",
    role: "ROLE_VIEWER",
    password: "",
  });

  // POPULATE FORM when data arrives
  useEffect(() => {
      // console.log("Fetched admin user: ", fetchedAdminUser);
      
      if (fetchedAdminUser) {
          setFormData({
          id: fetchedAdminUser.id,
          name: fetchedAdminUser.name || '',
          email: fetchedAdminUser.email || '',
          role: fetchedAdminUser.role || 'ROLE_VIEWER',
          password: fetchedAdminUser.password || '',
          });
      }
  }, [fetchedAdminUser]);

  const handleChange = (e) => {
  setFormData({
      ...formData,
      [e.target.name]: e.target.value
  });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      // console.log("Form Data: ", formData);

      if (isEditMode) {
          // UPDATE LOGIC
          updateMutation.mutate({ data: formData }, {
              onSuccess: () => navigate('/admin/admin-users'),
              onError: (err) => console.error("Update failed", err)
          });
      } else {
          // CREATE LOGIC
          createMutation.mutate(formData, {
              onSuccess: () => navigate('/admin/admin-users'),
              onError: (err) => console.error("Create failed", err)
          });
      }
  };

  // Show Loading screen while fetching initial data for Edit
  if (isEditMode && isLoadingData) {
      return (
          <div className="text-center mt-5">
              <Spinner animation="border" variant="primary" />
              <p>Loading admin user details...</p>
          </div>
      );
  }

  // Show Error if fetching failed
  if (isEditMode && isFetchError) {
      return <Alert variant="danger">Error loading admin user details.</Alert>;
  }

  return (
    <>
        <Form className='entry-form' onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="title-wrapper d-flex">
                    <Button 
                        className='me-2' 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => navigate(`/admin/admin-users`)}
                        disabled={isPending}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </Button>
                    <h4>Add admin user</h4>
                </div>
                <div className="actions-wrapper">
                    <Button 
                        variant="outline-primary" 
                        size="sm" 
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? (
                                <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                />
                            ) : (
                                <i className="bi pe-none bi-floppy2-fill"></i>
                            )
                        }
                    </Button>
                </div>
            </div>
            <div className="scrollable-container">
                <Form.Group className="mb-3" controlId="formGridName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        name="name"
                        type="text" 
                        placeholder="Enter name" 
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isPending || isEditMode}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        name="email"
                        type="email" 
                        placeholder="Enter email" 
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        name="password"
                        type="password" 
                        placeholder="Enter password" 
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </Form.Group>

                <Form.Group controlId="formGridRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        disabled={isPending || isEditMode}
                    >
                        <option value="ROLE_VIEWER">Viewer</option>
                        <option value="ROLE_ADMIN">Admin</option>
                        <option value="ROLE_EDITOR">Editor</option>
                    </Form.Select>
                </Form.Group>
            </div>
        </Form>
    </>
  )
}

export default AdminUsersEntry