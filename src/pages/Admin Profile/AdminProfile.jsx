import React, { useEffect, useState} from 'react'
// import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card';
import './AdminProfile.css'
import { Form, Button, Card, Image, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { displayRole } from "../Admin Users/roles";
import { useUpdateAdminUserEmail } from '../../features/admin users/hooks/useAdminUsers';
import defaultImg from '../../utils/images/person.svg';

const AdminProfile = () => {
    const { user } = useAuth();
    const updateMutation = useUpdateAdminUserEmail();
    const [isPersonalEditing, setIsPersonalEditing] = useState(false);

    const [personalInfoForm, setPersonalInfoForm] = useState({
        email: user.email || "",
    });
    const [validationError, setValidationError] = useState("");

    const isPersonalInfoFormPending = updateMutation.isPending;
    const personalInfoFormError = updateMutation.error;

    useEffect(() => {
        // console.log('useEffect', user);
        if (user) {
            setPersonalInfoForm({ email: user.email || "" });
        }
    }, [user]);

    const handlePersonalInfoFormChange = (e) => {
        setPersonalInfoForm({
            ...personalInfoForm,
            [e.target.name]: e.target.value
        });

        if (validationError) setValidationError("");
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleToggleEdit = (e) => {
        e.preventDefault(); 

        if (isPersonalEditing) {
            if (!personalInfoForm.email) {
                setValidationError("Email is required.");
                return;
            }
            if (!validateEmail(personalInfoForm.email)) {
                setValidationError("Please enter a valid email address.");
                return;
            }
            const dataToSend = {
                newEmail: personalInfoForm.email
            }
            updateMutation.mutate({ data: dataToSend }, {
                onSuccess: () => setIsPersonalEditing(false),
                onError: (err) => console.error("Update failed", err)
            });
        } else {
            setIsPersonalEditing(true);
        }
    };

    const handlePersonalInfoFormCancel = () => {
        setIsPersonalEditing(false)
        setValidationError("");
        setPersonalInfoForm({
            email: user.email || "",
        })
    }

  return (
    <>
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="title-wrapper d-flex">
                <h4>My Profile</h4>
            </div>
        </div>
        <div className="scrollable-container">
            <Card className='p-0 mb-4'>
                <Card.Body className='d-flex align-items-center'>
                    <Image 
                        src={defaultImg} 
                        roundedCircle
                        width="80" 
                        height="80" 
                        className="me-4 bg-dark-subtle"
                    />
                    <div>
                        <h4 className='fw-medium'>{user?.name}</h4>
                        <div className='roles-container'>{user?.roles?.map((role, index) => (
                            <span>{ displayRole(role) + (index < user?.roles?.length - 1 ? ' | ' : '')}</span>
                        ))}</div>
                    </div>
                </Card.Body>
            </Card>

            <Form>
            <Card className='p-0 mb-4'>
                <Card.Header className="d-flex justify-content-between align-items-center" >
                    <div>Personal Information</div>
                    <div>
                        {isPersonalEditing && (<Button 
                            variant="outline-secondary" 
                            size="sm" 
                            type="button"
                            className='me-2'
                            disabled={isPersonalInfoFormPending}
                            onClick={handlePersonalInfoFormCancel}
                        >
                            <i className="bi pe-none bi-x"></i>
                        </Button>)}
                        <Button 
                            variant={isPersonalEditing ? "success" : "outline-primary"}
                            size="sm"
                            onClick={handleToggleEdit}
                            disabled={isPersonalInfoFormPending}
                        >
                            {isPersonalInfoFormPending ? (
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            ) : isPersonalEditing ? (
                                <i className="bi pe-none bi-floppy2-fill"></i>
                            ) : (
                                <i className="bi pe-none bi-pencil-fill"></i>
                            )}
                            {/* <i className="bi pe-none bi-pencil-fill"></i> */}
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Form.Group className="mb-3" >
                        <Form.Label className="field-label"> Email </Form.Label>
                        <Form.Control 
                            name="email"
                            type="email" 
                            plaintext={!isPersonalEditing} 
                            readOnly={!isPersonalEditing} 
                            placeholder="email@example.com" 
                            value={personalInfoForm.email}
                            onChange={handlePersonalInfoFormChange}
                            disabled={isPersonalInfoFormPending}
                            isInvalid={!!validationError} 
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationError}
                            </Form.Control.Feedback>
                    </Form.Group>
                    {(personalInfoFormError) && (
                        <Alert variant="danger">
                            Failed to save personal information : {personalInfoFormError.response?.data?.message || personalInfoFormError.message}
                        </Alert>
                    )}
                </Card.Body>
            </Card>
            </Form>
        </div>
    </>
  )
}

export default AdminProfile