import React, { useState, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { ReviewAPI } from "./ReviewAPI";

const ReviewComponent = ({ productId, sessionUser }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [hover, setHover] = useState(null);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const reviewsData = await ReviewAPI.getProductReviews(productId);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Failed to load reviews");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!sessionUser) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    try {
      // Only send essential review data
      const reviewData = {
        userId: sessionUser.id,
        productId: productId,
        rating: parseInt(newReview.rating),
        comment: newReview.comment,
        date: new Date().toISOString(),
      };

      await ReviewAPI.addReview(productId, reviewData);
      toast.success("Review submitted successfully");

      // Reload reviews
      loadReviews();

      // Reset form
      setNewReview({
        rating: 5,
        comment: "",
      });
      setHover(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} color="#ffc107" size={24} style={{ marginRight: "5px" }} />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" color="#ffc107" size={24} style={{ marginRight: "5px" }} />);
    }

    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} color="#e4e5e9" size={24} style={{ marginRight: "5px" }} />);
    }

    return stars;
  };

  return (
    <div className="reviews-section">
      {sessionUser && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Write a Review</Card.Title>
            <Form onSubmit={handleReviewSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Rating</Form.Label>
                <div className="star-rating">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <FaStar
                        key={index}
                        className="star"
                        color={ratingValue <= (hover || newReview.rating) ? "#ffc107" : "#e4e5e9"}
                        size={24}
                        style={{ marginRight: "5px", cursor: "pointer" }}
                        onClick={() => setNewReview({ ...newReview, rating: ratingValue })}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
                      />
                    );
                  })}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary">
                Submit Review
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Body>
          <Card.Title>Reviews</Card.Title>
          <div className="d-flex align-items-center mb-3">
            {renderStars(getAverageRating())}
            <span className="ms-2">({reviews.length} reviews)</span>
          </div>

          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map((review, index) => (
              <div key={index} className="border-bottom mb-3 pb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex flex-column">
                    <div className="mb-1">{renderStars(review.rating)}</div>
                    <strong className="text-primary">{review.username}</strong>
                  </div>
                  <small className="text-muted">{new Date(review.date).toLocaleString("vi-VN")}</small>
                </div>
                <p className="mt-2 mb-0">{review.comment}</p>
              </div>
            ))
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ReviewComponent;
