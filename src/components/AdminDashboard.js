import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [newService, setNewService] = useState({
    serviceName: '',
    duration: '',
    branchId: ''
  });
  const [newBranch, setNewBranch] = useState({
    branchName: '',
    branchLocation: '',
    openingTime: '',
    closingTime: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token'); // Pastikan token disimpan di localStorage setelah login

  useEffect(() => {
    fetchBranches();
    fetchServices();
    fetchReviews();
    fetchReservations();
  }, []);

  const fetchBranches = () => {
    fetch('/branches')
      .then(response => response.json())
      .then(data => {
        setBranches(data);
      })
      .catch(error => {
        console.error('Failed to fetch branches:', error.message);
      });
  };

  const fetchServices = () => {
    fetch('/services')
      .then(response => response.json())
      .then(data => {
        setServices(data);
      })
      .catch(error => {
        console.error('Failed to fetch services:', error.message);
      });
  };

  const fetchReviews = () => {
    fetch('/reviews')
      .then(response => response.json())
      .then(data => {
        setReviews(data);
      })
      .catch(error => {
        console.error('Failed to fetch reviews:', error.message);
      });
  };

  const fetchReservations = () => {
    fetch('/all-reservations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setReservations(data);
      })
      .catch(error => {
        console.error('Failed to fetch reservations:', error.message);
      });
  };

  const handleAddService = () => {
    fetch('/add-service', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newService)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Service added successfully:', data.message);
        setSuccess('Service added successfully');
        setError('');
        setNewService({
          serviceName: '',
          duration: '',
          branchId: ''
        });
        fetchServices();
      })
      .catch(error => {
        console.error('Failed to add service:', error.message);
        setError('Failed to add service');
        setSuccess('');
      });
  };

  const handleAddBranch = () => {
    fetch('/add-branch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newBranch)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Branch added successfully:', data.message);
        setSuccess('Branch added successfully');
        setError('');
        setNewBranch({
          branchName: '',
          branchLocation: '',
          openingTime: '',
          closingTime: ''
        });
        fetchBranches();
      })
      .catch(error => {
        console.error('Failed to add branch:', error.message);
        setError('Failed to add branch');
        setSuccess('');
      });
  };

  const handleDeleteService = (serviceId) => {
    fetch(`/delete-service/${serviceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Service deleted successfully:', data.message);
        setSuccess('Service deleted successfully');
        setError('');
        fetchServices();
      })
      .catch(error => {
        console.error('Failed to delete service:', error.message);
        setError('Failed to delete service');
        setSuccess('');
      });
  };

  const handleDeleteBranch = (branchId) => {
    fetch(`/delete-branch/${branchId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Branch deleted successfully:', data.message);
        setSuccess('Branch deleted successfully');
        setError('');
        fetchBranches();
      })
      .catch(error => {
        console.error('Failed to delete branch:', error.message);
        setError('Failed to delete branch');
        setSuccess('');
      });
  };

  const handleDeleteReview = (reviewId) => {
    fetch(`/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Review deleted successfully:', data.message);
        setSuccess('Review deleted successfully');
        setError('');
        fetchReviews();
      })
      .catch(error => {
        console.error('Failed to delete review:', error.message);
        setError('Failed to delete review');
        setSuccess('');
      });
  };

  const handleDeleteReservation = (reservationId) => {
    fetch(`/delete-reservation/${reservationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Reservation deleted successfully:', data.message);
        setSuccess('Reservation deleted successfully');
        setError('');
        fetchReservations();
      })
      .catch(error => {
        console.error('Failed to delete reservation:', error.message);
        setError('Failed to delete reservation');
        setSuccess('');
      });
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div>
        <h2>Add New Service</h2>
        <label>Service Name:</label>
        <input
          type="text"
          value={newService.serviceName}
          onChange={(e) => setNewService({ ...newService, serviceName: e.target.value })}
        />
        <br />
        <label>Duration (minutes):</label>
        <input
          type="number"
          value={newService.duration}
          onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
        />
        <br />
        <label>Select Branch:</label>
        <select
          value={newService.branchId}
          onChange={(e) => setNewService({ ...newService, branchId: e.target.value })}
        >
          <option value="">Select Branch</option>
          {branches.map(branch => (
            <option key={branch.id} value={branch.id}>
              {branch.branchName}
            </option>
          ))}
        </select>
        <br />
        <button onClick={handleAddService}>Add Service</button>
      </div>

      <div>
        <h2>Current Services</h2>
        <ul>
          {services.map(service => (
            <li key={service.id}>
              {service.serviceName} - {service.duration} minutes - Branch: {service.branchName}
              <button onClick={() => handleDeleteService(service.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Current Branches</h2>
        <ul>
          {branches.map(branch => (
            <li key={branch.id}>
              {branch.branchName} - {branch.branchLocation} - Opening Time: {branch.openingTime} - Closing Time: {branch.closingTime}
              <button onClick={() => handleDeleteBranch(branch.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Add New Branch</h2>
        <label>Branch Name:</label>
        <input
          type="text"
          value={newBranch.branchName}
          onChange={(e) => setNewBranch({ ...newBranch, branchName: e.target.value })}
        />
        <br />
        <label>Branch Location:</label>
        <input
          type="text"
          value={newBranch.branchLocation}
          onChange={(e) => setNewBranch({ ...newBranch, branchLocation: e.target.value })}
        />
        <br />
        <label>Opening Time:</label>
        <input
          type="time"
          value={newBranch.openingTime}
          onChange={(e) => setNewBranch({ ...newBranch, openingTime: e.target.value })}
        />
        <br />
        <label>Closing Time:</label>
        <input
          type="time"
          value={newBranch.closingTime}
          onChange={(e) => setNewBranch({ ...newBranch, closingTime: e.target.value })}
        />
        <br />
        <button onClick={handleAddBranch}>Add Branch</button>
      </div>

      <div>
        <h2>Current Reviews</h2>
        <ul>
          {reviews.map(review => (
            <li key={review.id}>
              {review.customerName} - {review.rating} - {review.comment}
              <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>All Reservations</h2>
        <ul>
          {reservations.map(reservation => (
            <li key={reservation.id}>
              {reservation.name} - {reservation.phoneNumber} - {reservation.serviceType} - {new Date(reservation.dateTime).toLocaleString()} - {reservation.branchName}
              <button onClick={() => handleDeleteReservation(reservation.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <p>
        <Link to="/login">Back to Login</Link>
      </p>
    </div>
  );
};

export default AdminDashboard;
