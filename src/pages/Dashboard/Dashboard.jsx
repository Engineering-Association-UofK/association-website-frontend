import React from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { useMonitoring } from '../../features/monitoring/hooks/useMonitoring';
import { formatBytes, formatUptime, getVariant, getHealthVariant } from '../../utils/formatters';
import './Dashboard.css'

const Dashboard = () => {

    const { data, isLoading, isError, error, refetch } = useMonitoring();

    // Destructure data (Safety checks included)
    const overview = data?.overview || {};
    const system = data?.system || {};
    const app = data?.app || {};

    return (
        <>
            <div className="d-flex justify-content-between mb-4">
                <h4 className='table-title'>System Health Dashboard</h4>
                <div className="actions-wrapper">
                    <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => refetch()}
                    >
                        <i className="bi pe-none bi-arrow-clockwise"></i>
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
                        <h4>Failed to load system stats.</h4>
                        <p>{error?.message || 'Something went wrong.'}</p>
                        <Button variant="outline-danger" onClick={() => refetch()}>
                            Try Again
                        </Button>
                        </Alert>
                    </Container>
                ) : (
                    <Container className="scrollable-container px-0">
                        {/* --- ROW 1: OVERVIEW & APP STATUS --- */}
                        <Row className="mb-4">
                            {/* 1. Health Overview */}
                            <Col md={6} lg={4} className="mb-3">
                                <Card className={`h-100 border-${getHealthVariant(overview.healthLevel)} border-2 shadow-sm`}>
                                    <Card.Body className="text-center d-flex flex-column justify-content-start">
                                        <h6 className="text-muted text-uppercase mb-2">Overall Health</h6>
                                        <h2 className={`text-${getHealthVariant(overview.healthLevel)} fw-bold text-uppercase`}>
                                            {overview.healthLevel || 'Unknown'}
                                        </h2>
                                        <div className="mt-3 small text-muted">
                                            Last Updated: <br />
                                            {new Date(overview.lastUpdated).toLocaleString()}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* 2. Uptime Counter */}
                            <Col md={6} lg={4} className="mb-3">
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Body className="text-center d-flex flex-column justify-content-start">
                                        <h6 className="text-muted text-uppercase mb-2">System Uptime</h6>
                                        <div className="display-6 fw-normal text-dark">
                                            <i className="bi bi-clock-history me-2 text-primary"></i>
                                            {formatUptime(overview.uptimeSeconds)}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* 3. App Specific Status */}
                            <Col md={12} lg={4} className="mb-3">
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Header className="text-muted bg-white fw-bold">Application Status</Card.Header>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span>Status</span>
                                            <Badge bg={app.status === 'UP' ? 'success' : 'danger'} className="px-3 py-2">
                                                {app.status}
                                            </Badge>
                                        </div>
                                        <div className="mb-2">
                                            <div className="d-flex justify-content-between small mb-1">
                                                <span>App CPU</span>
                                                <span>{app.cpuPercent.toFixed(1)}%</span>
                                            </div>
                                            <ProgressBar now={app.cpuPercent} variant="info" style={{ height: '6px' }} />
                                        </div>
                                        <div>
                                            <div className="d-flex justify-content-between small mb-1">
                                                <span>App Memory</span>
                                                <span>{app.memoryUsedMB} MB</span>
                                            </div>
                                            {/* Assuming max app memory is generic, visually representing used */}
                                            <ProgressBar now={app.memoryUsedMB > 1000 ? 100 : (app.memoryUsedMB / 10)} variant="info" style={{ height: '6px' }} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* --- ROW 2: SYSTEM RESOURCES --- */}
                        <h5 className="mb-3">Server Resources</h5>
                        <Row>
                            {/* 1. CPU Load */}
                            <Col md={6} lg={4} className="mb-3">
                                <Card className="shadow-sm border-0 h-100">
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-2">
                                                <i className="bi bi-cpu text-primary fs-4"></i>
                                            </div>
                                            <h5 className="text-muted m-0">CPU Load</h5>
                                        </div>

                                        <h5 className="ms-auto mb-0 text-end">{(system.cpu?.loadPercent * 100).toFixed(0)}%</h5>
                                        <ProgressBar 
                                            now={system.cpu?.loadPercent * 100} 
                                            variant={getVariant(system.cpu?.loadPercent * 100)}  
                                        />
                                        <div className="d-flex align-items-center justify-content-between mt-3">
                                            <div className="text-muted">Cores</div>
                                            <div className="fw-bold">{system.cpu?.cores}</div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* 2. Memory Usage */}
                            <Col md={6} lg={4} className="mb-3">
                                <Card className="shadow-sm border-0 h-100">
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="bg-success bg-opacity-10 p-3 rounded-circle me-2">
                                                <i className="bi bi-memory text-success fs-4"></i>
                                            </div>
                                            <h5 className="text-muted m-0">Memory</h5>
                                        </div>
                                        
                                        <h5 className="ms-auto mb-0 text-end">{(system.memory?.usedPercent * 100).toFixed(0)}%</h5>
                                        <ProgressBar>
                                            <ProgressBar 
                                                now={system.memory?.usedPercent * 100} 
                                                variant={getVariant(system.memory?.usedPercent * 100)} 
                                                label="RAM"
                                            />
                                        </ProgressBar>
                                        <div className="d-flex align-items-center justify-content-between mt-3">
                                            <div className="text-muted">Total</div>
                                            <div className="fw-bold">{formatBytes(system.memory?.totalBytes)}</div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mt-1">
                                            <div className="text-muted">Used</div>
                                            <div className="fw-bold">{formatBytes(system.memory?.usedBytes)}</div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mt-1">
                                            <div className="text-muted">Swap</div>
                                            <div className="fw-bold">{(system.memory?.swapUsedPercent * 100).toFixed(0)}%</div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* 3. Disk Usage */}
                            <Col md={6} lg={4} className="mb-3">
                                <Card className="shadow-sm border-0 h-100">
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-2">
                                                <i className="bi bi-hdd text-warning fs-4"></i>
                                            </div>
                                            <div>
                                                <h5 className="text-muted m-0">Disk Storage</h5>
                                            </div>
                                        </div>

                                        <h5 className="ms-auto mb-0 text-end">{(system.disk?.usedPercent * 100).toFixed(0)}%</h5>
                                        <ProgressBar 
                                            now={system.disk?.usedPercent * 100} 
                                            variant={getVariant(system.disk?.usedPercent * 100)} 
                                        />
                                        <div className="d-flex align-items-center justify-content-between mt-3">
                                            <div className="text-muted">Total</div>
                                            <div className="fw-bold">{formatBytes(system.disk?.totalBytes)}</div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mt-1">
                                            <div className="text-muted">Used</div>
                                            <div className="fw-bold">{formatBytes(system.disk?.usedBytes)}</div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                )
            }
        </>
    );
}

export default Dashboard