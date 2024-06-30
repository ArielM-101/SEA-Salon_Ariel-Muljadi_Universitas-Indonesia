import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [branchId, setBranchId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReservations();
    fetchBranches();
  }, []);

  useEffect(() => {
    if (branchId) {
      fetchServicesByBranch(branchId);
    }
  }, [branchId]);

  const fetchReservations = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/reservations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error.message);
      setError('Failed to fetch reservations. Please try again.');
    }
  };

  const fetchServicesByBranch = async (branchId) => {
    try {
      const response = await fetch(`/branches/${branchId}/services`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error.message);
      setError('Failed to fetch services. Please try again.');
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch('/branches');
      if (!response.ok) {
        throw new Error('Failed to fetch branches');
      }
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error('Failed to fetch branches:', error.message);
      setError('Failed to fetch branches. Please try again.');
    }
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phoneNumber, serviceType, dateTime, branchId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to make reservation');
      }
  
      setSuccess('Reservation made successfully!');
      setError('');
      fetchReservations(); // Fetch reservations again after successful reservation
    } catch (err) {
      setError('An error occurred. Please try again.');
      setSuccess('');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete reservation');
      }
      setSuccess('Reservation deleted successfully!');
      setError('');
      fetchReservations(); // Fetch reservations again after successful deletion
    } catch (err) {
      setError('An error occurred. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div>
      <h1>Customer Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleReservation}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Branch:</label>
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            required
          >
            <option value="">Select Branch</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Service Type:</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            required
            disabled={!branchId} // Disable until branch is selected
          >
            <option value="">Select Service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.serviceName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Date and Time:</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Make Reservation</button>
      </form>

      <h2>My Reservations</h2>
      <ul>
        {reservations.map(reservation => (
          <li key={reservation.id}>
            {reservation.name} - {reservation.phoneNumber} - {reservation.serviceType} - {new Date(reservation.dateTime).toLocaleString()} - {reservation.branchName}
            <button onClick={() => handleDelete(reservation.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>
        <Link to="/login">Back to Login</Link>
      </p>
    </div>
  );
};

export default CustomerDashboard;