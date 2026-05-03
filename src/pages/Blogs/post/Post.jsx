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
  const { type, slug } = useParams();
  const { data: post, isLoading, error } = usePost(slug);

  const backNavigation = {
    news: { path: '/posts/news', label: 'news' },
    announcements: { path: '/posts/announcements', label: 'blogs' },
    resources: { path: '/posts/resources', label: 'donations' },
    events: { path: '/posts/events', label: 'issues' },
  };

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
          <Link to={backNavigation[type]?.path || '/posts/news'} className="btn btn-outline-primary">
            Back to {backNavigation[type]?.label || 'news'}
          </Link>
        </Alert>
      </Container>
    );
  }

  if (!post) return null;

  return (
    <article className="py-5 bg-light" style={{ backgroundImage: `url(${post.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', zIndex: 0}}>
      {post.image_url && <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white', opacity: 0.4, zIndex: '-1'}}></div>}

      <Container>
        <Link to={backNavigation[type]?.path || '/posts/news'} className="btn btn-outline-secondary rounded-pill mb-4">
          <i className="bi bi-arrow-left me-2"></i> Back to {backNavigation[type]?.label || 'news'}
        </Link>

        <div className="bg-white rounded-4 shadow-sm overflow-hidden">
          <div className="position-relative p-4 p-lg-5" style={{ zIndex: 2 }}>
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