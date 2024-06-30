import React from 'react';

const ReviewList = ({ reviews }) => {
  return (
    <div>
      <h2>Customer Reviews</h2>
      {reviews.map((review, index) => (
        <div key={index}>
          <p>Customer Name: {review.customerName}</p>
          <p>Rating: {review.rating}</p>
          <p>Comment: {review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
