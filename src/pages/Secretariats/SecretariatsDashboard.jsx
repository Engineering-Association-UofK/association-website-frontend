import React, { useState } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import { useSecretariats, useDeleteSecretariat } from '../../features/secretariats/hooks/useSecretariats';


const SecretariatsDashboard = () => {
    const navigate = useNavigate();

    const { data: secretariats, isLoading, isError, error, refetch } = useSecretariats();
    const { mutate: deleteSecretariat, isPending: isDeleting } = useDeleteSecretariat();

    // Local State for Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // Handlers
    const handleEdit = (id) => {
        navigate(`/admin/secretariats/${id}`);
    };

    const handleOpenDeleteModal = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedId(null);
    };

    const handleConfirmDelete = () => {
        if (selectedId) {
            deleteSecretariat(selectedId, {
                onSuccess: () => {
                    handleCloseModal();
                },
                onError: (err) => {
                    console.error("Delete failed", err);
                }
            });
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between mb-4">
                <h4 className='table-title'>Secretariats</h4>
                <div className="actions-wrapper">
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/secretariats/0`)}
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
                            <h4>Error loading secretariats</h4>
                            <p>{error?.message || 'Something went wrong.'}</p>
                            <Button variant="outline-danger" onClick={() => refetch()}>
                                Try Again
                            </Button>
                        </Alert>
                    </Container>
                ) : (!secretariats || secretariats.length === 0) ? (
                    <Container className="mt-5 text-center">
                        <Alert variant="info">No secretariats found. Create one to get started!</Alert>
                    </Container>
                ) : (
                    <div className="table-wrapper">
                        <Table hover className='text-center'>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    secretariats?.map((row) => (
                                        <tr
                                            key={row.id}
                                        >
                                            <td>{row["id"]}</td>
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
                    Are you sure you want to delete this secretariat? This action cannot be undone.
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

export default SecretariatsDashboard
