import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { usePost } from '../../../features/post/hooks/usePost';
import "./Post.css";

const PostSkeleton = () => (
  <div className="bg-white rounded-4 shadow-sm overflow-hidden">
    <div style={{ height: '300px', backgroundColor: '#e9ecef' }} className="skeleton-animation"></div>
    <div className="p-4 p-lg-5">
      <div style={{ height: '2.5rem', width: '70%', backgroundColor: '#e9ecef', marginBottom: '1rem' }} className="skeleton-animation"></div>
      <div style={{ height: '1rem', width: '40%', backgroundColor: '#e9ecef', marginBottom: '2rem' }} className="skeleton-animation"></div>
      <div style={{ height: '1rem', width: '100%', backgroundColor: '#e9ecef', marginBottom: '0.5rem' }} className="skeleton-animation"></div>
      <div style={{ height: '1rem', width: '95%', backgroundColor: '#e9ecef', marginBottom: '0.5rem' }} className="skeleton-animation"></div>
      <div style={{ height: '1rem', width: '90%', backgroundColor: '#e9ecef', marginBottom: '0.5rem' }} className="skeleton-animation"></div>
      <div style={{ height: '1rem', width: '85%', backgroundColor: '#e9ecef' }} className="skeleton-animation"></div>
    </div>
  </div>
);

const Post = () => {
  const { slug } = useParams();
  const { data: post, isLoading, error } = usePost(slug);

  if (isLoading) {
    return (
      <article className="py-5 bg-light">
        <Container>
          <div className="mb-4">
            <div style={{ width: '120px', height: '38px', backgroundColor: '#e9ecef' }} className="skeleton-animation"></div>
          </div>
          <PostSkeleton />
        </Container>
      </article>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error.response?.data?.message || error.message || 'Failed to load blog post'}</p>
          <Link to="/posts/announcements" className="btn btn-outline-primary">Back to Blogs</Link>
        </Alert>
      </Container>
    );
  }

  if (!post) return null;

  return (
    <article className="py-5 bg-light">
      <Container>
        <Link to="/posts/announcements" className="btn btn-outline-secondary rounded-pill mb-4">
          <i className="bi bi-arrow-left me-2"></i> Back to Blogs
        </Link>

        <div className="bg-white rounded-4 shadow-sm overflow-hidden">
          {post.image_url && (
            <img
              src={post.image_url || `https://placehold.co/600x400/e2e8f0/1e293b?text=${post.title}`}
              alt={post.title}
              className="w-100"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          )}
          <div className="p-4 p-lg-5">
            <h1 className="display-5 fw-bold text-primary mb-3">{post.title}</h1>
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content || '<p>No content available.</p>' }}
            />
            <div className="text-muted mt-4">
              <i className="bi bi-person-circle me-1"></i> {post.author_name}
              <div className='mt-4'></div>
              <i className="bi bi-calendar3 me-1"></i> {new Date(post.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
};

export default Post;