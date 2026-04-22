import React from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useCmsBlogs } from '../../../features/blogs/hooks/useBlogs';

const Blogs = () => {
  const { data, isLoading, error } = useCmsBlogs('BLOG', 1, 10);

  React.useEffect(() => {
    if (data) console.log('Blogs data:', data);
    if (error) console.error('Error fetching blogs:', error);
  }, [data, error]);

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading blogs...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error loading blogs</Alert.Heading>
          <p>{error.message || 'Something went wrong. Please try again later.'}</p>
        </Alert>
      </Container>
    );
  }

  const blogs = data?.posts || [];

  if (blogs.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">No blogs found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="text-center fw-bold mb-5 text-primary">Blogs</h1>
      <Row className="g-4">
        {blogs.map((blog, idx) => (
          <Col md={6} lg={4} key={blog.slug || idx}>
            <Card className="h-100 shadow-sm border-0">
              {blog.image_url && (
                <Card.Img
                  variant="top"
                  src={blog.image_url}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <Card.Body>
                <Card.Title>{blog.title}</Card.Title>
                <Card.Text className="text-muted">
                  <small>By {blog.author_name}</small>
                  <br />
                  <small>{new Date(blog.updated_at).toLocaleDateString()}</small>
                </Card.Text>
                <Card.Text className="text-muted">
                  {blog.excerpt || 'Click to read more...'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Blogs;