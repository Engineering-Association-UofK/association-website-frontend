import React, {useState} from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import { useFaqs, useDeleteFaq } from '../../features/faqs/hooks/useFaqs';
import { useLanguage } from '../../context/LanguageContext.jsx';

const FAQsDashboard = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { data: faqs, isLoading, isError, error, refetch } = useFaqs({lang: language});
  const { mutate: deleteFaq, isPending: isDeleting } = useDeleteFaq();

  // Local State for Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedFaqId, setSelectedFaqId] = useState(null);

  // Handlers
  const handleEdit = (id) => {
    navigate(`/admin/faqs/${id}`); 
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedFaqId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFaqId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedFaqId) {
      console.log("selectedFaqId ", selectedFaqId);
      
      deleteFaq(selectedFaqId, {
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
        <h4 className='table-title'>FAQs</h4>
        <div className="actions-wrapper">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => navigate(`/admin/faqs/0`)}
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
              <h4>Error loading FAQs</h4>
              <p>{error?.message || 'Something went wrong.'}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>
                Try Again
              </Button>
            </Alert>
          </Container>
        ) : (!faqs || faqs.length === 0) ? (
          <Container className="mt-5 text-center">
            <Alert variant="info">No FAQs found. Create one to get started!</Alert>
          </Container>
        ) : (
          <div className="table-wrapper">
            <Table hover className='text-center'>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Title</th>
                  <th>Body</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  faqs?.map((row) => (
                    <tr 
                      key={row.id}
                    >
                      <td>{row["faqId"]}</td>
                      <td>{row["title"]}</td>
                      <td style={{ maxWidth: '300px' }}>
                        <div className="content-preview">
                          {row["body"]}
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
          Are you sure you want to delete this FAQ? This action cannot be undone.
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

export default FAQsDashboard