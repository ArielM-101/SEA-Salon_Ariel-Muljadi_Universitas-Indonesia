import React, { useState } from 'react';

const ReviewForm = ({ onSubmit }) => {
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ customerName, rating, comment });
    setCustomerName('');
    setRating(1);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
      <h2>Review Form</h2>
        Customer Name:
        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      </label>
      <br />
      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Comment:
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>
      <br />
      <p>
      <button type="submit">Submit Review</button>
      </p>
    </form>
  );
};

export default ReviewForm;
