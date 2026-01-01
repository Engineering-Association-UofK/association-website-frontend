import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Table, Alert, Spinner } from 'react-bootstrap';
import { login, fetchNews, addNews, deleteNews } from '../../utils/api';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ name: '', password: '' });
  const [newsItems, setNewsItems] = useState([]);
  const [newItem, setNewItem] = useState({ title: '', content: '', imageLink: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      loadNews();
    }
  }, [isAuthenticated]);

  const loadNews = async () => {
    try {
      const data = await fetchNews();
      // Sort by createdAt desc if needed, but API might order it.
      setNewsItems(data.reverse()); // Show newest first
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login(credentials.name, credentials.password);
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        setIsAuthenticated(true);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleNewItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addNews(newItem);
      setNewItem({ title: '', content: '', imageLink: '' });
      loadNews();
      alert('News added successfully!');
    } catch (err) {
      alert('Failed to add news.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteNews(id);
      loadNews();
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Card style={{ width: '400px' }} className="shadow">
          <Card.Body>
            <h3 className="text-center mb-4">Admin Login</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={credentials.name}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Enter hashed password"
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" /> : 'Login'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2>Admin Dashboard - News/Blogs</h2>
        <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
      </div>

      <Row>
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">Add New Post</Card.Header>
            <Card.Body>
              <Form onSubmit={handleAddNews}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={newItem.title}
                    onChange={handleNewItemChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Content (Snippet)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="content"
                    value={newItem.content}
                    onChange={handleNewItemChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="imageLink"
                    value={newItem.imageLink}
                    onChange={handleNewItemChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Form.Text className="text-muted">
                    Provide a direct link to an image (e.g. from Imgur).
                  </Form.Text>
                </Form.Group>
                <Button variant="success" type="submit" className="w-100" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Post'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header>Existing Posts</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newsItems.map(item => (
                    <tr key={item.id}>
                      <td style={{ width: '80px' }}>
                        {item.imageLink ? (
                          <img src={item.imageLink} alt="thumb" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                        ) : 'No Img'}
                      </td>
                      <td>{item.title}</td>
                      <td style={{ maxWidth: '200px' }} className="text-truncate">{item.content}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                  {newsItems.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center">No posts found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Admin;