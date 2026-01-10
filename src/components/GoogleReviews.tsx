import { useState, useEffect } from 'react';
import reviewsData from '../data/reviews.json';

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url?: string | null;
}

interface ReviewsData {
  reviews: Review[];
  rating: number;
  totalReviews: number;
  lastFetched: string | null;
}

export default function GoogleReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const data = reviewsData as ReviewsData;

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobile && data.reviews.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % data.reviews.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [data.reviews.length, isMobile]);

  if (data.reviews.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>What Our Customers Say</h3>
          <p style={styles.subtitle}>Real reviews from satisfied customers who trust us with their vehicles</p>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  };

  const renderReviewCard = (review: Review, index: number, isSingle: boolean = false) => (
    <div key={index} style={{
      ...styles.reviewCard,
      ...(isSingle ? { maxWidth: '700px', margin: '0 auto 1.5rem' } : {})
    }}>
      <div style={styles.reviewHeader}>
        <div style={styles.authorInfo}>
          {review.profile_photo_url && (
            <img
              src={review.profile_photo_url}
              alt={review.author_name}
              style={styles.avatar}
              referrerPolicy="no-referrer"
            />
          )}
          <div>
            <div style={styles.authorName}>{review.author_name}</div>
            <div style={styles.reviewTime}>{review.relative_time_description}</div>
          </div>
        </div>
        <div style={styles.reviewStars}>
          {renderStars(review.rating)}
        </div>
      </div>
      <p style={styles.reviewText}>"{review.text}"</p>
    </div>
  );

  // Get reviews to display (2 on tablet, 3 on desktop)
  const visibleCount = isTablet ? 2 : 3;
  const desktopReviews = data.reviews.slice(0, visibleCount);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>What Our Customers Say</h3>
        <p style={styles.headerSubtitle}>Real reviews from satisfied customers who trust us with their vehicles</p>

        {/* Google Rating Badge */}
        <a
          href="https://maps.app.goo.gl/m5mYEiUAyYerEKba9"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.googleBadge}
        >
          <img src="/google_icon.svg" alt="Google" style={styles.googleLogo} />
          <div style={styles.badgeContent}>
            <div style={styles.badgeRating}>
              <span style={styles.badgeNumber}>{data.rating.toFixed(1)}</span>
              <div style={styles.badgeStars}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} style={styles.starIcon} viewBox="0 0 24 24" fill="#F59E0B">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
            </div>
            <span style={styles.badgeReviews}>{data.totalReviews} Google Reviews</span>
          </div>
        </a>
      </div>

      {isMobile ? (
        <>
          {renderReviewCard(data.reviews[currentIndex], currentIndex, true)}
          {data.reviews.length > 1 && (
            <div style={styles.indicators}>
              {data.reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  style={{
                    ...styles.indicator,
                    ...(index === currentIndex ? styles.indicatorActive : {})
                  }}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{
          ...styles.reviewsGrid,
          gridTemplateColumns: isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'
        }}>
          {desktopReviews.map((review, index) => renderReviewCard(review, index))}
        </div>
      )}

      <a
        href="https://maps.app.goo.gl/m5mYEiUAyYerEKba9"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.viewAll}
      >
        View All Reviews on Google
      </a>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: 'transparent',
    padding: '3rem 2rem',
    textAlign: 'center',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#FFFFFF',
    marginBottom: '1rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: '#CCCCCC',
    fontSize: '1rem',
  },
  headerSubtitle: {
    color: '#CCCCCC',
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
  },
  overallRating: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  ratingNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stars: {
    color: '#F59E0B',
    fontSize: '1.5rem',
  },
  totalReviews: {
    color: '#CCCCCC',
    fontSize: '1rem',
  },
  reviewsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    maxWidth: '1200px',
    margin: '0 auto 1.5rem',
    padding: '0 1rem',
  },
  reviewCard: {
    background: '#2A2A2A',
    padding: '1.5rem',
    borderRadius: '15px',
    border: '1px solid rgba(140, 43, 43, 0.3)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(140, 43, 43, 0.1)',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  authorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  authorName: {
    fontWeight: '600',
    color: '#FFFFFF',
    fontSize: '1rem',
  },
  reviewTime: {
    color: '#CCCCCC',
    fontSize: '0.85rem',
  },
  reviewStars: {
    color: '#F59E0B',
    fontSize: '1.2rem',
  },
  reviewText: {
    color: '#CCCCCC',
    lineHeight: '1.7',
    fontSize: '1rem',
    fontStyle: 'italic',
  },
  indicators: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  indicator: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(140, 43, 43, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    padding: 0,
  },
  indicatorActive: {
    background: '#8c2b2b',
    transform: 'scale(1.2)',
  },
  viewAll: {
    display: 'inline-block',
    color: '#8c2b2b',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'color 0.3s ease',
  },
  googleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1rem',
    background: '#2A2A2A',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    textDecoration: 'none',
    border: '1px solid rgba(140, 43, 43, 0.3)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    marginBottom: '0.5rem',
  },
  googleLogo: {
    width: '40px',
    height: '40px',
    objectFit: 'contain',
  },
  badgeContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.25rem',
  },
  badgeRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  badgeNumber: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: '1',
  },
  badgeStars: {
    display: 'flex',
    gap: '2px',
  },
  starIcon: {
    width: '18px',
    height: '18px',
  },
  badgeReviews: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
};
