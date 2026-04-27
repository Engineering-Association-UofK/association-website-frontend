import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useBlogs } from '../../../features/blogs/hooks/useBlogs';
import "./News.css";
import { useLanguage } from '../../../context/LanguageContext';

// Card-Skeleton for main large card
const CardSkeleton = () => (
  <Card className="h-100 shadow-sm border-0">
    <div style={{ height: '250px', backgroundColor: '#e9ecef' }} className="skeleton-animation"></div>
    <Card.Body>
      <div style={{ height: '1.8rem', width: '80%', backgroundColor: '#e9ecef', marginBottom: '1rem' }} className="skeleton-animation"></div>
      <div style={{ height: '1rem', width: '100%', backgroundColor: '#e9ecef', marginBottom: '0.5rem' }} className="skeleton-animation"></div>
      <div style={{ height: '1rem', width: '90%', backgroundColor: '#e9ecef' }} className="skeleton-animation"></div>
    </Card.Body>
  </Card>
);

// Thumbnail-Skeleton
const ThumbnailSkeleton = () => (
  <div className="d-flex flex-column gap-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="d-flex gap-3">
        <div style={{ width: '120px', height: '120px', backgroundColor: '#e9ecef', borderRadius: '0.5rem' }} className="skeleton-animation"></div>
        <div className="flex-grow-1">
          <div style={{ height: '1.5rem', width: '80%', backgroundColor: '#e9ecef', marginBottom: '0.5rem' }} className="skeleton-animation"></div>
          <div style={{ height: '1rem', width: '60%', backgroundColor: '#e9ecef' }} className="skeleton-animation"></div>
        </div>
      </div>
    ))}
  </div>
);

const News = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { data, isLoading, error, isFetching } = useBlogs('NEWS', page, 10);
  const { language } = useLanguage();

  // add new posts when fetched...
  useEffect(() => {
    if (data?.posts) {
      if (page === 1) {
        setAllPosts(data.posts);
      } else {
        setAllPosts(prev => [...prev, ...data.posts]);
      }
      setHasMore(page < data.pages);
    }
  }, [data, page]);

  const loadMore = () => {
    if (hasMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  };

  // showing the skeleton and loading spinner in cases of (loading or error XD)
  if ((isLoading || error) && page === 1 && allPosts.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Row className="g-4 mb-5">
          <Col lg={7}>
            <CardSkeleton />
          </Col>

          <Col lg={5}>
            <ThumbnailSkeleton />
          </Col>
        </Row>
        <Row className="g-4 mb-5">
          <Col lg={7}>
            <ThumbnailSkeleton />
          </Col>

          <Col lg={5}>
            <ThumbnailSkeleton />
          </Col>
        </Row>
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading news...</p>
      </Container>
    );
  }

  const firstPost = allPosts[0];
  const tSidePosts = allPosts.slice(1, 4); // thumbnail-Side-Post
  const thumbnailPosts = allPosts.slice(4);


  return (
    <Container className="py-5">
      <h1 className="text-center fw-bold mb-5 text-primary">Latest News</h1>


      {/*the first section: big card + 3 thumbnails*/}
      <section className='hero-section'>
        {firstPost && <div className="card main-card">
          <div className="main-card-img">
            <img 
              src={firstPost.image_url || `https://placehold.co/600x400/e2e8f0/1e293b?text=${firstPost.title}`} 
              style={{width: '100%', maxHeight: '40vh'}}
            />
          </div>
          <div className="main-card-content">
            <h2 className='main-card-title'>{firstPost.title}</h2>
            <p className="main-card-text text-muted">
              {firstPost.summary}
            </p>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }} className="small mb-3">
              <div><i className="bi bi-person-circle me-1"></i> {firstPost.author_name}</div>
              <div><i className="bi bi-calendar3 me-1"></i> {new Date(firstPost.updated_at).toLocaleDateString()}</div>
            </div>
            <Link to={`/posts/news/${firstPost.slug}`} className="main-card-btn btn-outline-primary rounded-pill">
              {language == 'en' ? 'Continue Reading' : 'واصل القراءة'} <i className={"bi bi-arrow-" + (language == 'en' ? 'right' : 'left') + " ms-1"}></i>
            </Link>
          </div>
        </div>
        }
        {tSidePosts && <div className='cards-container'>
          {tSidePosts.map((post) => (
            <div className="card thumbnail-card">
              <div className="card-img">
                <img
                  src={post.image_url || `https://placehold.co/600x400/e2e8f0/1e293b?text=${post.title}`}
                  style={{ height: '350px', objectFit: 'cover', borderRadius: "1rem" }}
                />
              </div>
              <div className="card-content">
                <h2 className='card-title'>{post.title}</h2>
                <p className="card-text text-muted">
                  {post.summary
                    ? (post.summary.length > 60
                      ? post.summary.slice(0, 60) + '...'
                      : post.summary)
                    : "No Summary Available"}
                </p>
                <div className="text-muted small mb-3">
                  <i className="bi bi-person-circle me-1"></i> {post.author_name}
                  <span className="mx-2"></span>
                  <i className="bi bi-calendar3 me-1"></i> {new Date(post.updated_at).toLocaleDateString()}
                </div>
                <Link to={`/posts/news/${post.slug}`} className="btn btn-outline-primary rounded-pill">
                  Continue Reading <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>))
          }
        </div>
        }
      </section>



      {/*the 2nd section: cards*/}
      <section className='thumbnails-section'>
        {thumbnailPosts && <div className='cards-container'>
          {thumbnailPosts.map((post) => (
            <div className="card thumbnail-card">
              <div className="card-img">
                <img
                  src={post.image_url || `https://placehold.co/600x400/e2e8f0/1e293b?text=${post.title}`}
                  style={{ height: '350px', objectFit: 'cover', borderRadius: "1rem" }}
                />
              </div>
              <div className="card-content">
                <h2 className='card-title'>{post.title}</h2>
                <p className="card-text text-muted">
                  {post.summary
                    ? (post.summary.length > 60
                      ? post.summary.slice(0, 60) + '...'
                      : post.summary)
                    : "No Summary Available"}
                </p>
                <div className="text-muted small mb-3">
                  <i className="bi bi-person-circle me-1"></i> {post.author_name}
                  <span className="mx-2"></span>
                  <i className="bi bi-calendar3 me-1"></i> {new Date(post.updated_at).toLocaleDateString()}
                </div>
                <Link to={`/posts/news/${post.slug}`} className="btn btn-outline-primary rounded-pill">
                  Continue Reading <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>))
          }
        </div>}
      </section>




      {/* skeleton when loading more data */}
      {isFetching && page > 1 && (
        <Row className="g-4 mt-5">
          <Col lg={7}>
            <ThumbnailSkeleton />
          </Col>

          <Col lg={5}>
            <ThumbnailSkeleton />
          </Col>
        </Row>
      )}

      {/* Load More button */}
      {hasMore && (
        <div className="text-center mt-5">
          <Button
            variant="primary"
            onClick={loadMore}
            disabled={isFetching}
            className="rounded-pill px-4 py-2"
          >
            {isFetching ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Loading...
              </>
            ) : (
              <>
                Load More News <i className="bi bi-chevron-down ms-2"></i>
              </>
            )}
          </Button>
        </div>
      )}

      {!hasMore && allPosts.length > 0 && (
        <div className="text-center mt-5 text-muted">
          <i className="bi bi-check-circle-fill text-primary me-2"></i>
          You've seen all the latest news
        </div>
      )}
    </Container>
  );
};

export default News;
