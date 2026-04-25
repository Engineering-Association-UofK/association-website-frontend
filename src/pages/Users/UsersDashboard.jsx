import React, {useState} from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Pagination from 'react-bootstrap/Pagination';
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Badge from 'react-bootstrap/Badge';
import { useNavigate } from "react-router-dom";
import { useUsers, useSuspendUser, useAssignPasscodes } from '../../features/users/hooks/useUsers';
// import {useAuth} from "../../context/AuthContext";
import { displayRole } from '../../utils/roles';
import styles from './Users.module.css'

const PAGE_LIMIT = 25;

const UsersDashboard = () => {
  const navigate = useNavigate();
  // const { sendCode, verifyCode } = useAuth();
  
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({id: 0});
  const { data, isLoading, isError, error, refetch, isFetching } = useUsers(page, PAGE_LIMIT);
  const { mutate: suspendUser, isPending: isSuspending } = useSuspendUser();
  // const { mutate: assignPasscodes, isPending: isAssigning } = useAssignPasscodes();
  const {
    start: assignPasscodes,
    isRunning: isAssigning,
    progress,
    error: assignError
  } = useAssignPasscodes();
  // const { mutate: makeAdminManager, isPending: isMakingAdminManager } = usePromoteUser();
  // const { mutate: deleteAdminUsers, isPending: isDeleting } = useDeleteAdminUser();
  const users = data?.users ?? [];
  const totalPages = data?.pages ?? 1;

  // Local State for Modal
  // const [showModal, setShowModal] = useState(false);
  // const [selectedAdminUserId, setSelectedAdminUserId] = useState(null);

  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState(null);
  // const [suspendUserId, setSuspendUserId] = useState('');
  const [suspendError, setSuspendError] = useState('');

  // Handlers

  // const handleVerify = (name) => {
  //   sendCode(name);
  // };

  // const handleOpenDeleteModal = (id) => {
  //   setSelectedAdminUserId(id);
  //   setShowModal(true);
  // };

  // const handleCloseModal = () => {
  //   setShowModal(false);
  //   setSelectedAdminUserId(null);
  // };

  // const handleConfirmDelete = () => {
  //   if (selectedAdminUserId) {
      
  //     deleteAdminUsers(selectedAdminUserId, {
  //       onSuccess: () => {
  //         handleCloseModal(); 
  //       },
  //       onError: (err) => {
  //           console.error("Delete failed", err);
  //           // Set a toast/alert state here
  //       }
  //     });
  //   }
  // };
 
  const handleOpenSuspendModal = (user) => {
    setSuspendTarget(user);
    setSuspendError('');
    setShowSuspendModal(true);
  };
 
  const handleCloseSuspendModal = () => {
    setShowSuspendModal(false);
    setSuspendTarget(null);
    setSuspendError('');
  };
 
  const handleConfirmSuspend = () => {
    if (!suspendTarget) return;
    suspendUser(suspendTarget.id, {
      onSuccess: handleCloseSuspendModal,
      onError: (err) => {
        setSuspendError(err?.response?.data?.message || 'Failed to suspend user.');
      },
    });
    
  };


  const [showAssignModal, setShowAssignModal] = useState(false);
  // const [assignError, setAssignError] = useState('');
 
  const handleOpenAssignModal = () => {
    // setAssignError('');
    setShowAssignModal(true);
  };
 
  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    // setAssignError('');
  };
 
  const handleConfirmAssign = () => {
    assignPasscodes(handleCloseAssignModal);
    // assignPasscodes(undefined, {
    //   onSuccess: handleCloseAssignModal,
    //   onError: (err) => {
    //     setAssignError(err?.response?.data?.message || 'Failed to assign passcodes.');
    //   },
    // });
  };
 
  // const handleMakeAdminManager = (id) => {
  //   makeAdminManager(id, {
  //     // onSuccess: handleClosePromoteModal,
  //     onError: (err) => {
  //       setPromoteError(err?.response?.data?.message || 'Failed to promote user.');
  //     },
  //   });
  // };

  const handleEdit = (user) => {
    navigate(`/admin/users/${user.id}`, { state: { user } }); 
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };
 
  const renderPagination = () => {
    if (totalPages <= 1) return null;
 
    const items = [];
 
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1 || isFetching}
      />
    );
 
    // Show up to 5 page numbers centered around the current page
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
 
    if (start > 1) {
      items.push(<Pagination.Item key={1} onClick={() => handlePageChange(1)}>1</Pagination.Item>);
      if (start > 2) items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
    }
 
    for (let p = start; p <= end; p++) {
      items.push(
        <Pagination.Item
          key={p}
          active={p === page}
          onClick={() => handlePageChange(p)}
          disabled={isFetching}
        >
          {p}
        </Pagination.Item>
      );
    }
 
    if (end < totalPages) {
      if (end < totalPages - 1) items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      items.push(
        <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }
 
    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages || isFetching}
      />
    );
 
    return (
      <div className="d-flex justify-content-center mt-3">
        <Pagination className='m-0' size="sm">{items}</Pagination>
      </div>
    );
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h4 className='table-title'>
          Users
          {isFetching && !isLoading && (
            <Spinner animation="border" size="sm" variant="secondary" className="ms-2" />
          )}
        </h4>
        <div className="actions-wrapper">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={handleOpenAssignModal}
              title="Assign passcodes to users"
            >
            <i className="bi pe-none bi-key"></i>
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
              <h4>Error loading users</h4>
              <p>{error?.message || 'Something went wrong.'}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>
                Try Again
              </Button>
            </Alert>
          </Container>
        ) : (!users || users.length === 0) ? (
          <Container className="mt-5 text-center">
            <Alert variant="info">No users found. Create one to get started!</Alert>
          </Container>
        ) : (
          <>
            <div className={`table-wrapper ${styles.tableWrapper}`}>
              <Table hover className='text-center'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    {/* <th>Name</th> */}
                    <th>Email</th>
                    <th>Department</th>
                    <th>Verified</th>
                    <th>Status</th>
                    <th>Roles</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    users?.map((row) => (
                      <tr 
                        key={row.id}
                      >
                        <td>{row.id}</td>
                        <td>{row.username}</td>
                        {/* <td>{row.name_ar}</td> */}
                        <td>{row.email}</td>
                        <td>{row.department}</td>
                        <td>
                          {row.verified
                            ? <i className="bi bi-patch-check-fill text-success"></i>
                            : <i className="bi bi-patch-check text-muted"></i>}
                        </td>
                        <td>
                          <Badge bg={row.status === 'active' ? 'success' : 'danger'}>
                            {row.status}
                          </Badge>
                        </td>
                        <td>
                          {row.roles?.map((role, index) => (
                            <div key={role}>{ displayRole(role) + (index < row.roles?.length - 1 ? ',' : '')}</div>
                          ))}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleEdit(row)}
                              title="Edit"
                            >
                              <i className="bi pe-none bi-pencil-fill"></i>
                            </Button>

                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleOpenSuspendModal(row)}
                              title="Suspend user"
                            >
                              <i className="bi pe-none bi-slash-circle"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
            </div>
  
            {renderPagination()}
          </>
          
        )
      }

      {/* <Modal show={showModal} onHide={handleCloseModal} centered>
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
      </Modal> */}

 
      {/* ── Suspend User Modal ─────────────────────────────────────────────── */}
      <Modal show={showSuspendModal} onHide={handleCloseSuspendModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Suspend User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {suspendError && <Alert variant="danger">{suspendError}</Alert>}
          Are you sure you want to suspend {' '}
            <strong>{suspendTarget?.username}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuspendModal} disabled={isSuspending}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmSuspend} disabled={isSuspending}>
            {isSuspending ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Suspending...
              </>
            ) : 'Suspend'}
          </Button>
        </Modal.Footer>
      </Modal>
 
      {/* ── Assign Passcodes Modal ─────────────────────────────────────────── */}
      <Modal show={showAssignModal} onHide={handleCloseAssignModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Passcodes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {assignError && <Alert variant="danger">{assignError}</Alert>}
          
          {isAssigning ? (
            <>
              <p>Assigning passcodes...</p>

              <div style={{ maxHeight: "200px", overflow: "auto" }}>
                {progress.map((p, i) => (
                  <div key={i}>
                    User {p.userId}: {p.status}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>
              This will assign passcodes to all users that don't have one yet.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAssignModal} disabled={isAssigning}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAssign} disabled={isAssigning}>
            {isAssigning ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Assigning...
              </>
            ) : 'Assign Passcodes'}
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default UsersDashboard