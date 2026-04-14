import React, {useState} from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useNavigate } from "react-router-dom";
import { useAdminUsers, useDeleteAdminUser, usePromoteUser, useMakeAdminManager } from '../../features/admin users/hooks/useAdminUsers';
import {useAuth} from "../../context/AuthContext";
import { displayRole } from '../../utils/roles';

const AdminUsersDashboard = () => {
  const navigate = useNavigate();
  // const { sendCode, verifyCode } = useAuth();
  
  const { data: adminUsers, isLoading, isError, error, refetch } = useAdminUsers();
  const { mutate: promoteUser, isPending: isPromoting } = usePromoteUser();
  const { mutate: makeAdminManager, isPending: isMakingAdminManager } = usePromoteUser();
  const { mutate: deleteAdminUsers, isPending: isDeleting } = useDeleteAdminUser();

  // Local State for Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedAdminUserId, setSelectedAdminUserId] = useState(null);

  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promoteUserId, setPromoteUserId] = useState('');
  const [promoteError, setPromoteError] = useState('');

  // Handlers
  const handleEdit = (user) => {
    navigate(`/admin/admin-users/${user.id}`, { state: { user } }); 
  };

  // const handleVerify = (name) => {
  //   sendCode(name);
  // };

  const handleOpenDeleteModal = (id) => {
    setSelectedAdminUserId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAdminUserId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedAdminUserId) {
      
      deleteAdminUsers(selectedAdminUserId, {
        onSuccess: () => {
          handleCloseModal(); 
        },
        onError: (err) => {
            console.error("Delete failed", err);
            // Set a toast/alert state here
        }
      });
    }
  };
 
  const handleOpenPromoteModal = () => {
    setPromoteUserId('');
    setPromoteError('');
    setShowPromoteModal(true);
  };
 
  const handleClosePromoteModal = () => {
    setShowPromoteModal(false);
    setPromoteUserId('');
    setPromoteError('');
  };
 
  const handleConfirmPromote = () => {
    const id = Number(promoteUserId);
    if (!id) {
      setPromoteError('Please enter a valid user ID.');
      return;
    }
    promoteUser(id, {
      onSuccess: handleClosePromoteModal,
      onError: (err) => {
        setPromoteError(err?.response?.data?.message || 'Failed to promote user.');
      },
    });
  };
 
  const handleMakeAdminManager = (id) => {
    makeAdminManager(id, {
      // onSuccess: handleClosePromoteModal,
      onError: (err) => {
        setPromoteError(err?.response?.data?.message || 'Failed to promote user.');
      },
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h4 className='table-title'>Admin Users</h4>
        <div className="actions-wrapper">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={handleOpenPromoteModal}
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
              <h4>Error loading admin users</h4>
              <p>{error?.message || 'Something went wrong.'}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>
                Try Again
              </Button>
            </Alert>
          </Container>
        ) : (!adminUsers || adminUsers.length === 0) ? (
          <Container className="mt-5 text-center">
            <Alert variant="info">No admin users found. Create one to get started!</Alert>
          </Container>
        ) : (
          <div className="table-wrapper">
            <Table hover className='text-center'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                  {/* <th>Date</th>
                  <th>Verified</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  adminUsers?.map((row) => (
                    <tr 
                      key={row.id}
                    >
                      <td>{row.id}</td>
                      <td>{row.username}</td>
                      <td>{row.name_ar}</td>
                      <td>{row.email}</td>
                      <td>
                        {row.roles?.map((role, index) => (
                          <div>{ displayRole(role) + (index < row.roles?.length - 1 ? ',' : '')}</div>
                        ))}
                      </td>
                      {/* <td>
                        {new Intl.DateTimeFormat("en-GB").format(new Date(row["createdAt"]))}
                      </td> */}
                      {/* <td>{row["isVerified"] && <i className="bi pe-none bi-patch-check-fill"></i>}</td> */}
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleEdit(row)}
                          >
                            <i className="bi pe-none bi-pencil-fill"></i>
                          </Button>

                          <OverlayTrigger
                            overlay={<Tooltip>Make admin manager</Tooltip>}
                          >
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleMakeAdminManager(row.id)}
                            >
                              <i className="bi pe-none bi-person-fill-gear"></i>
                            </Button>
                          </OverlayTrigger>
                          {/* <Button 
                            title='Make admin manager'
                            value={}
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleMakeAdminManager(row.id)}
                          >
                            <i className="bi pe-none bi-person-fill-gear"></i>
                          </Button> */}
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
          </div>
          
        )
      }

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this admin user?
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

 
      {/* ── Promote User Modal ─────────────────────────────────────────────── */}
      <Modal show={showPromoteModal} onHide={handleClosePromoteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Promote User to Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">
            Enter the student index number of the user you want to grant admin access to.
          </p>
          {promoteError && <Alert variant="danger">{promoteError}</Alert>}
          <Form.Group controlId="promoteUserId">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g. 195011"
              value={promoteUserId}
              onChange={(e) => setPromoteUserId(e.target.value)}
              disabled={isPromoting}
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePromoteModal} disabled={isPromoting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmPromote} disabled={isPromoting}>
            {isPromoting ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Promoting...
              </>
            ) : 'Promote'}
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default AdminUsersDashboard