import React, { useState, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { FaStar, FaStarHalfAlt, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ReviewAPI } from "./ReviewAPI";

const ReviewComponent = ({ productId, sessionUser }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [editingReview, setEditingReview] = useState(null);
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
      const reviewData = {
        userId: sessionUser.id,
        productId: productId,
        rating: parseInt(newReview.rating),
        comment: newReview.comment,
        date: new Date().toISOString(),
      };

      await ReviewAPI.addReview(productId, reviewData);
      toast.success("Review submitted successfully");

      loadReviews();
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await ReviewAPI.updateReview(editingReview.id, editingReview);
      toast.success("Review updated successfully");
      setEditingReview(null);
      loadReviews();
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await ReviewAPI.deleteReview(productId, reviewId);
        toast.success("Review deleted successfully");
        loadReviews();
      } catch (error) {
        console.error("Error deleting review:", error);
        toast.error("Failed to delete review");
      }
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const renderStars = (rating, isEditable = false, onRatingChange = null, size = 24) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (isEditable) {
        stars.push(
          <FaStar
            key={`star-${i}`}
            className="star"
            color={i + 1 <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
            size={size}
            style={{ marginRight: "5px", cursor: "pointer" }}
            onClick={() => onRatingChange(i + 1)}
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(null)}
          />
        );
      } else {
        if (i < fullStars) {
          stars.push(<FaStar key={`full-${i}`} color="#ffc107" size={size} style={{ marginRight: "5px" }} />);
        } else if (i === fullStars && hasHalfStar) {
          stars.push(<FaStarHalfAlt key="half" color="#ffc107" size={size} style={{ marginRight: "5px" }} />);
        } else {
          stars.push(<FaStar key={`empty-${i}`} color="#e4e5e9" size={size} style={{ marginRight: "5px" }} />);
        }
      }
    }

    return stars;
  };

  const renderReviewItem = (review) => {
    const isOwnReview = sessionUser && String(review.userId) === String(sessionUser.id);
    const isEditing = editingReview && editingReview.id === review.id;

    if (isEditing) {
      return (
        <div key={review.id} className="border-bottom mb-3 pb-3">
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <div className="star-rating">
                {renderStars(editingReview.rating, true, (newRating) =>
                  setEditingReview({ ...editingReview, rating: newRating })
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                value={editingReview.comment}
                onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="success" size="sm">
                Save
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setEditingReview(null)}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      );
    }

    return (
      <div key={review.id} className="border-bottom mb-3 pb-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column">
            <div className="mb-1">{renderStars(review.rating)}</div>
            <strong className="text-primary">{review.username}</strong>
          </div>
          <div className="d-flex align-items-center">
            {isOwnReview && (
              <div className="d-flex gap-2 me-3">
                <Button variant="outline-primary" size="sm" onClick={() => setEditingReview(review)}>
                  <FaEdit />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteReview(review.id)}>
                  <FaTrash />
                </Button>
              </div>
            )}
            <small className="text-muted">{new Date(review.date).toLocaleString("vi-VN")}</small>
          </div>
        </div>
        <p className="mt-2 mb-0">{review.comment}</p>
      </div>
    );
  };

  return (
    <div className="reviews-section">
      {sessionUser && !editingReview && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Write a Review</Card.Title>
            <Form onSubmit={handleReviewSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Rating</Form.Label>
                <div className="star-rating">
                  {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
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
            {renderStars(getAverageRating(), false, null, 36)} {/* Larger stars for average rating */}
            <span className="ms-2">({reviews.length} reviews)</span>
          </div>

          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map((review) => renderReviewItem(review))
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ReviewComponent;
