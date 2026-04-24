import React from 'react';
import { Row, Col, Card, Placeholder, Container } from 'react-bootstrap';

const NewsSkeleton = () => {
  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .shimmer-placeholder {
            background: linear-gradient(
              90deg, 
              #f6f7f8 25%, 
              #edeef1 50%, 
              #f6f7f8 75%
            ) !important;
            background-size: 200% 100% !important;
            animation: shimmer 1.5s infinite linear !important;
            border: none !important;
          }
        `}
      </style>
      
      {/* Desktop Skeleton (Grid 3x1) */}
      <Row className="d-none d-md-flex">
        {[1, 2, 3].map((i) => (
          <Col md={4} key={`desktop-skel-${i}`} className="mb-4">
            <Card className="h-100 border-0 shadow-sm overflow-hidden">
              <div style={{ height: '220px' }}>
                <Placeholder as="div" animation="glow" className="h-100">
                  <Placeholder className="w-100 h-100 shimmer-placeholder" />
                </Placeholder>
              </div>
              <Card.Body className="p-4">
                <Placeholder as="div" animation="glow" className="mb-2">
                  <Placeholder xs={3} size="sm" className="shimmer-placeholder" />
                </Placeholder>
                <Placeholder as={Card.Title} animation="glow" className="mb-3">
                  <Placeholder xs={10} className="shimmer-placeholder" />
                  <Placeholder xs={7} className="shimmer-placeholder" />
                </Placeholder>
                <Placeholder as={Card.Text} animation="glow">
                  <Placeholder xs={12} size="xs" className="shimmer-placeholder" />
                  <Placeholder xs={9} size="xs" className="shimmer-placeholder" />
                </Placeholder>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mobile Skeleton (List View) */}
      <div className="d-md-none d-flex flex-column gap-3">
        {[1, 2, 3].map((i) => (
          <Card key={`mobile-skel-${i}`} className="shadow-sm border-0 overflow-hidden">
            <Row className="g-0 align-items-stretch">
              <Col xs={4}>
                <div style={{ height: '100%', minHeight: '130px' }}>
                  <Placeholder as="div" animation="glow" className="h-100">
                    <Placeholder className="w-100 h-100 shimmer-placeholder" />
                  </Placeholder>
                </div>
              </Col>
              <Col xs={8}>
                <Card.Body className="p-3 h-100 d-flex flex-column justify-content-center">
                  <Placeholder as="div" animation="glow" className="mb-1">
                    <Placeholder xs={4} size="sm" className="shimmer-placeholder" />
                  </Placeholder>
                  <Placeholder as={Card.Title} animation="glow" className="mb-2">
                    <Placeholder xs={11} className="shimmer-placeholder" />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={12} size="xs" className="shimmer-placeholder" />
                    <Placeholder xs={6} size="xs" className="shimmer-placeholder" />
                  </Placeholder>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </>
  );
};

export { NewsSkeleton };