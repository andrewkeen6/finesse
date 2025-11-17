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
  const data = reviewsData as ReviewsData;

  useEffect(() => {
    if (data.reviews.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % data.reviews.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [data.reviews.length]);

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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>What Our Customers Say</h3>
        <p style={styles.headerSubtitle}>Real reviews from satisfied customers who trust us with their vehicles</p>
        <div style={styles.overallRating}>
          <span style={styles.ratingNumber}>{data.rating.toFixed(1)}</span>
          <span style={styles.stars}>{renderStars(data.rating)}</span>
          <span style={styles.totalReviews}>({data.totalReviews} reviews)</span>
        </div>
      </div>

      <div style={styles.reviewCard}>
        <div style={styles.reviewHeader}>
          <div style={styles.authorInfo}>
            {data.reviews[currentIndex].profile_photo_url && (
              <img
                src={data.reviews[currentIndex].profile_photo_url}
                alt={data.reviews[currentIndex].author_name}
                style={styles.avatar}
                referrerPolicy="no-referrer"
              />
            )}
            <div>
              <div style={styles.authorName}>{data.reviews[currentIndex].author_name}</div>
              <div style={styles.reviewTime}>{data.reviews[currentIndex].relative_time_description}</div>
            </div>
          </div>
          <div style={styles.reviewStars}>
            {renderStars(data.reviews[currentIndex].rating)}
          </div>
        </div>
        <p style={styles.reviewText}>"{data.reviews[currentIndex].text}"</p>
      </div>

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
    background: 'rgba(245, 245, 245, 0.85)',
    padding: '3rem 2rem',
    textAlign: 'center',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#1A1A1A',
    marginBottom: '1rem',
    fontWeight: '700',
  },
  subtitle: {
    color: '#666666',
    fontSize: '1rem',
  },
  headerSubtitle: {
    color: '#666666',
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
    color: '#1A1A1A',
  },
  stars: {
    color: '#F59E0B',
    fontSize: '1.5rem',
  },
  totalReviews: {
    color: '#666666',
    fontSize: '1rem',
  },
  reviewCard: {
    background: '#FFFFFF',
    padding: '2rem',
    borderRadius: '15px',
    maxWidth: '700px',
    margin: '0 auto 1.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
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
    color: '#1A1A1A',
    fontSize: '1rem',
  },
  reviewTime: {
    color: '#666666',
    fontSize: '0.85rem',
  },
  reviewStars: {
    color: '#F59E0B',
    fontSize: '1.2rem',
  },
  reviewText: {
    color: '#1A1A1A',
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
};
