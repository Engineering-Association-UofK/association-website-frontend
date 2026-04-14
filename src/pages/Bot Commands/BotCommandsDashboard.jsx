import React, {useState} from 'react'
import { Table, Button, Container, Spinner, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useBotCommands, useDeleteBotCommand } from '../../features/bot commands/hooks/useBotCommands';

const BotCommandsDashboard = () => {
    const navigate = useNavigate();
  
    const { data: botCommands, isLoading, isError, error, refetch } = useBotCommands();
    const { mutate: deleteBotCommands, isPending: isDeleting } = useDeleteBotCommand();
  
    // Local State for Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedBotCommandId, setSelectedBotCommandId] = useState(null);
  
    // Handlers
    const handleEdit = (id) => {
      navigate(`/admin/bot-commands/${id}`); 
    };
  
    const handleVerify = (name) => {
      sendCode(name);
    };
  
    const handleOpenDeleteModal = (id) => {
      setSelectedBotCommandId(id);
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
      setSelectedBotCommandId(null);
    };
  
    const handleConfirmDelete = () => {
      if (selectedBotCommandId) {
        
        deleteBotCommands(selectedBotCommandId, {
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

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h4 className='table-title'>Bot Commands</h4>
        <div className="actions-wrapper">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => navigate(`/admin/bot-commands/0`)}
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
              <h4>Error loading bot commands</h4>
              <p>{error?.message || 'Something went wrong.'}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>
                Try Again
              </Button>
            </Alert>
          </Container>
        ) : (!botCommands || botCommands.length === 0) ? (
          <Container className="mt-5 text-center">
            <Alert variant="info">No bot commands found. Create one to get started!</Alert>
          </Container>
        ) : (
          <div className="table-wrapper">
            <Table hover className='text-center'>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Keyword</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  botCommands?.map((row) => (
                    <tr 
                      key={row.id}
                    >
                      <td>{row["id"]}</td>
                      <td>{row["keyword"]}</td>
                      <td style={{ maxWidth: '300px' }}>
                        <div className="content-preview">
                          {row["description"]}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleEdit(row.id)}
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
          </div>
          
        )
      }

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this admin user post? This action cannot be undone.
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

export default BotCommandsDashboard