import React, { useState } from 'react'
import { Table, Button, Container, Spinner, Alert, 
  Modal, Image, ButtonGroup, ToggleButton, Row, Col,
  Card, Badge, OverlayTrigger, Tooltip, Form
} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useImageStorageItems, useClearUnused } from '../../features/image storage/hooks/useImageStorage';

const PLACEHOLDER_IMG = "https://placehold.co/600x400?text=No+Image";

// const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
//   <div
//     ref={ref}
//     onClick={(e) => {
//       e.preventDefault();
//       onClick(e);
//     }}
//     style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
//     className="text-dark p-0 border-0"
//   >
//     {children}
//   </div>
// ));

const ImageStorageDashboard = () => {
  const navigate = useNavigate();
  
  const { data: imageStorageItems, isLoading, isError, error, refetch } = useImageStorageItems();
  // const { mutate: publishToNews, isPending: isPublishing, error: publishError } = usePublishToNews();
  // const { mutate: unpublishToNews, isPending: isUnpublishing, error: unpublishError } = useUnpublishFromNews();
  const { mutate: clearUnused, isPending: isClearing, error: clearUnusedError } = useClearUnused();

  // Local State for Modal
  const [showModal, setShowModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [viewMode, setViewMode] = useState('list'); 
  const [selectedImageStorageItemId, setSelectedImageStorageItemId] = useState(null);
  const [alt, setAlt] = useState("");

  // Handlers
  const handleOpenPublishModal = (id) => {
    setSelectedImageStorageItemId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAlt("");
    setSelectedImageStorageItemId(null);
  };

  // const handleConfirm = (e) => {
  //   e.preventDefault(); 
  //   if (selectedImageStorageItemId) {
  //     // console.log("selectedImageStorageItemId ", selectedImageStorageItemId);
  //     // console.log("alt: ", alt);
  //     const dataToSend = {
  //       storageId: selectedImageStorageItemId,
  //       alt: alt
  //     }
  //     publishToNews(dataToSend, {
  //       onSuccess: () => {
  //         handleCloseModal(); 
  //       },
  //       onError: (err) => {
  //           console.error("Publish failed", err);
  //           // Set a toast/alert state here
  //       }
  //     });
  //   }
  // };
  
  const handleOpenUnpublishModal = (id) => {
    setSelectedImageStorageItemId(id);
    setShowUnpublishModal(true);
  };

  const handleCloseUnpublishModal = () => {
    setShowUnpublishModal(false);
    setSelectedImageStorageItemId(null);
  };

  // const handleConfirmUnpublish = (e) => {
  //   e.preventDefault(); 
  //   if (selectedImageStorageItemId) {
  //     // console.log("selectedImageStorageItemId ", selectedImageStorageItemId);
  //     unpublishToNews(selectedImageStorageItemId, {
  //       onSuccess: () => {
  //         handleCloseUnpublishModal(); 
  //       },
  //       onError: (err) => {
  //           console.error("Unpublish failed", err);
  //           // Set a toast/alert state here
  //       }
  //     });
  //   }
  // };
  
  const handleOpenClearModal = () => {
    setShowClearModal(true);
  };

  const handleCloseClearModal = () => {
    setShowClearModal(false);
  };

  const handleConfirmClear = (e) => {
    e.preventDefault(); 

    clearUnused(undefined, {
      onSuccess: () => {
        handleCloseClearModal(); 
      },
      onError: (err) => {
          console.error("Clear unused failed", err);
          // Set a toast/alert state here
      }
    });
  };

  // Helper to copy URL
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    // Optional: Add toast notification here
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-GB", {
        day: 'numeric', month: 'short', year: 'numeric'
    }).format(new Date(dateString));
  }

  const ListView = () => (
    <div className="table-wrapper">
      <Table hover className='text-center'>
        <thead>
          <tr>
            <th>Id</th>
            <th style={{ width: '80px' }}></th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            imageStorageItems?.map((row) => (
              <tr 
                key={row.id}
              >
                <td>{row?.id}</td>
                <td>
                  <Image
                    src={row?.url || PLACEHOLDER_IMG}
                    alt={row?.alt_text || "thumbnail"}
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
                <td>
                  {row?.reference_times > 0 ? (
                    <Badge bg="primary">Used</Badge>
                  ) : (
                    <Badge bg="secondary">Unused</Badge>
                  )}
                </td>
                <td>
                  {/* {new Intl.DateTimeFormat("en-GB").format(new Date(row["createdAt"]))} */}
                  {formatDate(row?.created_at)}
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    {row?.reference_times > 0 ? (
                      <OverlayTrigger
                        overlay={<Tooltip>Unpublish from news</Tooltip>}
                      >
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleOpenUnpublishModal(row.id)}
                        >
                          <i className="bi pe-none bi-eye-slash-fill"></i>
                        </Button>
                      </OverlayTrigger>
                    ) : (
                      <OverlayTrigger
                        overlay={<Tooltip>Publish to news</Tooltip>}
                      >
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleOpenPublishModal(row.id)}
                        >
                          <i className="bi pe-none bi-eye-fill"></i>
                        </Button>
                      </OverlayTrigger>
                    )}
                    
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </div>
  );

  const GridView = () => (
    <div className="scrollable-container">
      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {imageStorageItems?.map((item) => (
              <Col key={item.id}>

                  <Card className="h-100 border-0 shadow-sm card-hover-effect">
                      
                      {/* A. IMAGE SECTION */}
                      <div style={{ position: 'relative', height: '180px' }} className="rounded-top overflow-hidden bg-light">
                          <Card.Img 
                              variant="top" 
                              src={item?.url || PLACEHOLDER_IMG} 
                              alt={item?.alt_text || "thumbnail"}
                              style={{ height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                          />
                          {/* ID Badge overlay */}
                          <Badge bg="dark" className="position-absolute top-0 start-0 m-2 bg-opacity-75">
                              #{item.id}
                          </Badge>
                          <Badge bg="dark" className="position-absolute bottom-0 end-0 m-2 bg-opacity-75">
                              <i className="bi bi-calendar3 me-1"></i>
                              {formatDate(item.created_at)}
                          </Badge>
                      </div>
                      
                      {/* B. BODY SECTION */}
                      <Card.Body className="d-flex flex-column p-2 pb-0">
                          
                          {/* TITLE & DROPDOWN ROW */}
                          <div className="d-flex justify-content-between align-items-center mb-0">
                              {/* Title: flex-grow fills space, text-truncate cuts off long text */}
                              <Card.Title 
                                className="h6 fw-bold text-truncate mb-0 flex-grow-1"
                              >
                                {item?.reference_times > 0 ? (
                                  <Badge bg="primary">Used</Badge>
                                ) : (
                                  <Badge bg="secondary">Unused</Badge>
                                )}
                              </Card.Title>

                              {item?.reference_times > 0 ? (
                                <OverlayTrigger
                                  overlay={<Tooltip>Unpublish from news</Tooltip>}
                                >
                                  <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={() => handleOpenUnpublishModal(item.id)}
                                  >
                                    <i className="bi pe-none bi-eye-slash-fill"></i>
                                  </Button>
                                </OverlayTrigger>
                              ) : (
                                <OverlayTrigger
                                  overlay={<Tooltip>Publish to news</Tooltip>}
                                >
                                  <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={() => handleOpenPublishModal(item.id)}
                                  >
                                    <i className="bi pe-none bi-eye-fill"></i>
                                  </Button>
                                </OverlayTrigger>
                              )}
                              {/* Dropdown: flex-shrink-0 ensures it never gets squashed
                              <Dropdown align="end" className="flex-shrink-0 ms-2">
                                <Dropdown.Toggle as={CustomToggle} id={`dropdown-${item.id}`}>
                                  <div className={`btn btn-sm btn-light border-0 rounded ${styles.dropBtn}`} style={{width: '32px', height: '32px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                    <i className="bi bi-three-dots-vertical fs-5"></i>
                                  </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="shadow border-0" style={{ minWidth: '160px' }}>
                                  <Dropdown.Item onClick={() => navigate(`/admin/image storage/${item.id}`)}>
                                    <i className="bi bi-pencil me-2 text-primary"></i> Edit
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => copyToClipboard(item.imageLink)}>
                                    <i className="bi bi-clipboard me-2 text-secondary"></i> Copy URL
                                  </Dropdown.Item>
                                  <Dropdown.Divider />
                                  <Dropdown.Item className="text-danger" onClick={() => handleOpenPublishModal(item.id)}>
                                    <i className="bi bi-trash me-2"></i> Delete
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown> */}
                          </div>

                      </Card.Body>
                  </Card>
              </Col>
          ))}
      </Row>
    </div>
  );

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h4 className='table-title'>Images Storage</h4>
        <div className="actions-wrapper">
          <OverlayTrigger
            overlay={<Tooltip>Add image</Tooltip>}
          >
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => navigate(`/admin/image-storage/0`)}
            >
              <i className="bi pe-none bi-plus"></i>
            </Button>
          </OverlayTrigger>

          <ButtonGroup className='ms-1'>
              <ToggleButton
                id="radio-list"
                type="radio"
                variant='outline-secondary'
                name="radio"
                value="list"
                size="sm"
                checked={viewMode === 'list'}
                onChange={(e) => setViewMode('list')}
              >
                <i className="bi bi-list"></i>
              </ToggleButton>
              <ToggleButton
                id="radio-grid"
                type="radio"
                variant='outline-secondary'
                name="radio"
                value="grid"
                size="sm"
                checked={viewMode === 'grid'}
                onChange={(e) => setViewMode('grid')}
              >
                <i className="bi bi-grid-fill"></i>
              </ToggleButton>
          </ButtonGroup>

          <OverlayTrigger
            overlay={<Tooltip>Clear unused</Tooltip>}
          >
            <Button 
              variant="outline-danger" 
              className='ms-1'
              size="sm"
              onClick={handleOpenClearModal}
            >
              <i className="bi pe-none bi-trash-fill"></i>
            </Button>
          </OverlayTrigger>
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
              <h4>Error loading image storage items</h4>
              <p>{error?.message || 'Something went wrong.'}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>
                Try Again
              </Button>
            </Alert>
          </Container>
        ) : (!imageStorageItems || imageStorageItems.length === 0) ? (
          <Container className="mt-5 text-center">
            <Alert variant="info">No image storage items found. Create one to get started!</Alert>
          </Container>
        ) : viewMode === 'list' ? <ListView /> : <GridView />
      }

      {/* <Modal show={showModal} onHide={handleCloseModal} centered>
        <Form  onSubmit={handleConfirm}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Publish</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to publish this image to news?
            <p>if you are sure, add an alt for the image.</p>

            {publishError && <Alert variant="danger">{publishError?.message}</Alert>}
            <Form.Group className="mb-3" controlId="formGridTitle">
                <Form.Label>Alt</Form.Label>
                <Form.Control 
                    name="alt"
                    type="text" 
                    placeholder="Enter alt" 
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    disabled={isPublishing}
                />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={isPublishing}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isPublishing}>
              {isPublishing ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Publishing...
                </>
              ) : (
                'Publish'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal> */}

      {/* <Modal show={showUnpublishModal} onHide={handleCloseUnpublishModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Unpublish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Are you sure you want to Unpublish this image from news?</div>

          {unpublishError && <Alert variant="danger">{unpublishError?.message}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUnpublishModal} disabled={isUnpublishing}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmUnpublish} disabled={isUnpublishing}>
            {isUnpublishing ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Unpublishing...
              </>
            ) : (
              'Unpublish'
            )}
          </Button>
        </Modal.Footer>
      </Modal> */}

      <Modal show={showClearModal} onHide={handleCloseClearModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Clear</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Are you sure you want to clear all unused images? This action cannot be undone.</div>

          {clearUnusedError && <Alert variant="danger">{clearUnusedError?.message}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseClearModal} disabled={isClearing}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmClear} disabled={isClearing}>
            {isClearing ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Clearing...
              </>
            ) : (
              'Clear'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default ImageStorageDashboard