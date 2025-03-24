import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const ReviewAPI = {
  // Get single product (needed for getting reviews)
  getProductById: async (productId) => {
    const response = await axios.get(`${BASE_URL}/products/${productId}`);
    return response.data;
  },

  // Get user info
  getUserById: async (userId) => {
    const response = await axios.get(`${BASE_URL}/accounts/${userId}`);
    return response.data;
  },

  // Add review to product
  addReview: async (productId, reviewData) => {
    // First, add the review to reviews collection with only essential data
    const reviewResponse = await axios.post(`${BASE_URL}/reviews`, {
      id: reviewData.id,
      userId: reviewData.userId,
      productId: reviewData.productId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: reviewData.date,
    });
    const newReviewId = reviewResponse.data.id;

    // Then get the current product
    const productResponse = await axios.get(`${BASE_URL}/products/${productId}`);
    const product = productResponse.data;

    // Update product's reviews array
    const reviews = product.reviews || [];
    reviews.push(newReviewId);

    // Update the product with new review
    await axios.patch(`${BASE_URL}/products/${productId}`, { reviews });

    return reviewResponse.data;
  },

  // Get product reviews with user info
  getProductReviews: async (productId) => {
    const product = await ReviewAPI.getProductById(productId);
    if (!product.reviews || product.reviews.length === 0) {
      return [];
    }

    const response = await axios.get(`${BASE_URL}/reviews`);
    const allReviews = response.data;
    const productReviews = allReviews.filter((review) => product.reviews.includes(review.id));

    // Get user info for each review
    const reviewsWithUserInfo = await Promise.all(
      productReviews.map(async (review) => {
        try {
          const userInfo = await ReviewAPI.getUserById(String(review.userId));
          return {
            ...review,
            username: userInfo.username,
          };
        } catch (error) {
          console.error(`Failed to get user info for userId: ${review.userId}`, error);
          return {
            ...review,
            username: "Unknown User",
          };
        }
      })
    );

    return reviewsWithUserInfo;
  },
};
