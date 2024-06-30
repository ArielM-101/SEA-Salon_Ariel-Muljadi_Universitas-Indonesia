import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import Header from './components/Header';
import Services from './components/Services';
import Contact from './components/Contact';
import ReviewForm from './components/ReviewForm';
import ReviewList from './components/ReviewList';
import Footer from './components/footer';
import photo from './salon.jpg';

const PrivateRoute = ({ element, allowedRoles, ...rest }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" state={{ from: rest.location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return element;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomepageWithLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<HomepageWithLogin />} />
        <Route 
          path="/admin-dashboard" 
          element={<PrivateRoute element={<AdminDashboard />} allowedRoles={['Admin']} />} 
        />
        <Route 
          path="/customer-dashboard" 
          element={<PrivateRoute element={<CustomerDashboard />} allowedRoles={['Customer']} />} 
        />
      </Routes>
    </Router>
  );
};

const HomepageWithLogin = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/reviews')
      .then(response => response.json())
      .then(data => setReviews(data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, []);

  const handleReviewSubmit = (newReview) => {
    setReviews([...reviews, newReview]);
    fetch('http://localhost:3000/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReview),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Review added:', data);
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="main-container">
      <div className="left-column">
        <Header />
        <p>
          <Services />
        <div className="section-box">
          <Contact />
        </div>
        </p>
        <h2>Our Gallery</h2>
            <img src={photo} alt="SEA Salon's gallery" style={{ width: '100%', height: 'auto', marginTop: '20px' }} />
      </div>
      <div className="right-column">
        <Login />
        <p>
        <ReviewForm onSubmit={handleReviewSubmit} />
        <div className="section-box">
          <ReviewList reviews={reviews} />
        </div>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default App;