import React from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { useMonitoring } from '../../../features/monitoring/hooks/useMonitoring';
import { formatBytes, formatUptime, getVariant, getHealthVariant } from '../../../utils/formatters';
import './Dashboard.css'

const Dashboard = () => {
    const { data: rawPayload, isLoading, isError, error, refetch } = useMonitoring();

    const data = rawPayload?.data ? rawPayload.data : rawPayload;

    const overview = data?.overview || {};
    const system = data?.system || {};
    const app = data?.app || {};

    const safePercentage = (value) => {
        if (value === undefined || value === null) return 0;
        const num = typeof value === 'string' ? parseFloat(value) : value;
        
        const finalNum = num <= 1 ? num * 100 : num;
        
        return isNaN(finalNum) ? 0 : finalNum;
    };

    const cpuPercent = safePercentage(system.cpu?.usedPercent);
    const ramPercent = safePercentage(system.ram?.usedPercent);
    const diskPercent = safePercentage(system.disk?.usedPercent);

    const isHealthy = overview.status && overview.status.toLowerCase() === 'healthy';

    return (
        <Container fluid className="px-1 py-2">
            {/* Action Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="dashboard-title fw-bold m-0">System Control Desk</h4>
                    <p className="text-muted small m-0">Real-time status monitoring and hardware diagnostics.</p>
                </div>
                <Button 
                    variant="white" 
                    className="border shadow-sm rounded-3 p-2 bg-white"
                    onClick={() => refetch()}
                >
                    <i className="bi bi-arrow-clockwise text-secondary fs-5"></i>
                </Button>
            </div>

            {isLoading && (
                <div className="d-flex flex-column justify-content-center align-items-center my-5 py-5">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <span className="text-muted small fw-medium">Polling cluster state metrics...</span>
                </div>
            )}

            {isError && (
                <Alert variant="danger" className="border-0 rounded-4 shadow-sm p-4">
                    <div className="d-flex">
                        <i className="bi bi-exclamation-triangle-fill fs-3 me-3"></i>
                        <div>
                            <h6 className="fw-bold">Failed to connect to monitor agent</h6>
                            <p className="small mb-2">{error?.message || "The backend metric engine did not respond."}</p>
                            <Button variant="danger" size="sm" onClick={() => refetch()} className="rounded-pill px-3">Retry Hook</Button>
                        </div>
                    </div>
                </Alert>
            )}

            {!isLoading && !isError && data && (
                <>
                    {/* Operational Status Panel */}
                    <div className="status-hero-banner p-4 mb-4 shadow-sm d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                        <div className="d-flex align-items-center">
                            <div className={`icon-badge me-3 ${isHealthy ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                                <i className={`bi ${isHealthy ? 'bi-shield-check-fill' : 'bi-shield-exclamation'}`}></i>
                            </div>
                            <div>
                                <div className="text-muted small text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Engine Core Status</div>
                                <h4 className="fw-bold mb-0 text-white d-flex align-items-center gap-2">
                                    {overview.status ? overview.status.toUpperCase() : "UNKNOWN"}
                                    <Badge bg={getHealthVariant(overview.status || 'unknown')} className="fs-6 rounded-pill px-2 py-1">Node Operational</Badge>
                                </h4>
                            </div>
                        </div>
                        <div className="border-start border-secondary ps-4 d-none d-md-block">
                            <div className="text-muted small text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Engine Uptime Tracker</div>
                            <span className="font-monospace fw-bold text-white-50">
                                {app.uptime ? formatUptime(app.uptime) : '0s'}
                            </span>
                        </div>
                    </div>

                    <h6 className="text-muted text-uppercase fw-bold tracking-wider mb-3 px-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Cluster Diagnostics</h6>

                    {/* Main Hardware Performance Row */}
                    <Row className="g-4 mb-4">
                        {/* CPU Card */}
                        <Col xs={12} md={4}>
                            <Card className="dashboard-card h-100 border-0">
                                <Card.Body className="p-4 d-flex flex-column">
                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <div>
                                            <span className="text-muted small fw-semibold d-block">Compute Unit</span>
                                            <h6 className="fw-bold text-dark m-0">Processor Load</h6>
                                        </div>
                                        <div className="icon-badge badge-primary-soft">
                                            <i className="bi bi-cpu"></i>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto">
                                        <div className="d-flex align-items-baseline justify-content-between mb-2">
                                            <h3 className="fw-bold mb-0">{cpuPercent.toFixed(0)}<span className="fs-6 text-muted fw-normal">%</span></h3>
                                            <span className="text-muted small font-monospace">{system.cpu?.cores || '?'} Cores Active</span>
                                        </div>
                                        <ProgressBar 
                                            now={cpuPercent} 
                                            variant={getVariant(cpuPercent)} 
                                            className="custom-progress"
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Memory Card */}
                        <Col xs={12} md={4}>
                            <Card className="dashboard-card h-100 border-0">
                                <Card.Body className="p-4 d-flex flex-column">
                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <div>
                                            <span className="text-muted small fw-semibold d-block">Volatile Space</span>
                                            <h6 className="fw-bold text-dark m-0">System RAM</h6>
                                        </div>
                                        <div className="icon-badge badge-info-soft">
                                            <i className="bi bi-memory"></i>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto">
                                        <div className="d-flex align-items-baseline justify-content-between mb-2">
                                            <h3 className="fw-bold mb-0">{ramPercent.toFixed(0)}<span className="fs-6 text-muted fw-normal">%</span></h3>
                                            <span className="text-muted small font-monospace">
                                                {formatBytes(system.ram?.usedBytes)} / {formatBytes(system.ram?.totalBytes)}
                                            </span>
                                        </div>
                                        <ProgressBar 
                                            now={ramPercent} 
                                            variant={getVariant(ramPercent)} 
                                            className="custom-progress"
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Disk Space Card */}
                        <Col xs={12} md={4}>
                            <Card className="dashboard-card h-100 border-0">
                                <Card.Body className="p-4 d-flex flex-column">
                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <div>
                                            <span className="text-muted small fw-semibold d-block">Persistent Storage</span>
                                            <h6 className="fw-bold text-dark m-0">Disk Capacity</h6>
                                        </div>
                                        <div className="icon-badge badge-warning-soft">
                                            <i className="bi bi-hdd-rack"></i>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto">
                                        <div className="d-flex align-items-baseline justify-content-between mb-2">
                                            <h3 className="fw-bold mb-0">{diskPercent.toFixed(0)}<span className="fs-6 text-muted fw-normal">%</span></h3>
                                            <span className="text-muted small font-monospace">
                                                {formatBytes(system.disk?.usedBytes)} used
                                            </span>
                                        </div>
                                        <ProgressBar 
                                            now={diskPercent} 
                                            variant={getVariant(diskPercent)} 
                                            className="custom-progress"
                                        />
                                        <div className="d-flex justify-content-between text-muted mt-2" style={{ fontSize: '0.75rem' }}>
                                            <span>Total Node Disk Allocation:</span>
                                            <span className="fw-bold">{formatBytes(system.disk?.totalBytes)}</span>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}

export default Dashboard;