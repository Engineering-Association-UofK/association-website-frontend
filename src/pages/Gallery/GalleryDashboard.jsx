import React, { useState } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import { useNavigate } from "react-router-dom";
import { useGalleryItems, useDeleteGalleryItem } from '../../features/gallery/hooks/useGallery';

const PLACEHOLDER_IMG = "https://placehold.co/600x400?text=No+Image";

const GalleryDashboard = () => {
  const navigate = useNavigate();
  
  const { data: galleryItems, isLoading, isError, error, refetch } = useGalleryItems();
  const { mutate: deleteGalleryItem, isPending: isDeleting } = useDeleteGalleryItem();

  // Local State for Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedGalleryItemId, setSelectedGalleryItemId] = useState(null);

  // Handlers
  const handleOpenDeleteModal = (id) => {
    setSelectedGalleryItemId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGalleryItemId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedGalleryItemId) {
      // console.log("selectedGalleryItemId ", selectedGalleryItemId);
      
      deleteGalleryItem(selectedGalleryItemId, {
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
        <h4 className='table-title'>Gallery</h4>
        <div className="actions-wrapper">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => navigate(`/admin/gallery/0`)}
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
              <h4>Error loading gallery items</h4>
              <p>{error?.message || 'Something went wrong.'}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>
                Try Again
              </Button>
            </Alert>
          </Container>
        ) : (!galleryItems || galleryItems.length === 0) ? (
          <Container className="mt-5 text-center">
            <Alert variant="info">No gallery items found. Create one to get started!</Alert>
          </Container>
        ) : (
          <div className="table-wrapper">
            <Table hover className='text-center'>
              <thead>
                <tr>
                  <th>Id</th>
                  <th style={{ width: '80px' }}></th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  galleryItems?.map((row) => (
                    <tr 
                      key={row.id}
                    >
                      <td>{row["id"]}</td>
                      <td>
                        <Image
                          src={row.imageLink || PLACEHOLDER_IMG}
                          alt="thumbnail"
                          rounded
                          style={{ 
                            width: '70px', 
                            height: '70px', 
                            objectFit: 'cover', 
                            cursor: 'pointer',
                            border: '1px solid #dee2e6'
                          }}
                          
                          // Handle broken links automatically
                          onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                        />
                      </td>
                      <td>{row["title"]}</td>
                      <td style={{ maxWidth: '200px' }}>
                        <div className="content-preview">
                          {row["description"]}
                        </div>
                      </td>
                      <td>
                        {new Intl.DateTimeFormat("en-GB").format(new Date(row["createdAt"]))}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
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
          Are you sure you want to delete this gallery item? This action cannot be undone.
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

export default GalleryDashboard