import React, { useState, useEffect } from 'react';

const ReservationForm = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [branch, setBranch] = useState('');
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
    fetchBranches();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      setError('Failed to fetch services');
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch('/branches');
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      setError('Failed to fetch branches');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phonePattern = /^\d+$/;
    if (!phonePattern.test(phoneNumber)) {
      setError('Nomor telepon hanya boleh mengandung angka');
      return;
    }
    
    const reservationData = { name, phoneNumber, serviceType, dateTime, branch };
    
    fetch('http://localhost:3000/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Terjadi kesalahan saat menambahkan reservasi');
        }
        return response.json();
      })
      .then(data => {
        console.log('Reservation added:', data);
        setName('');
        setPhoneNumber('');
        setServiceType('');
        setDateTime('');
        setBranch('');
        setError(null);
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Terjadi kesalahan saat mengirim data');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" required />
      <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Nomor Telepon" required />
      <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} required>
        <option value="">Pilih Jenis Layanan</option>
        {services.map(service => (
          <option key={service.id} value={service.id}>{service.serviceName}</option>
        ))}
      </select>
      <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
      <select value={branch} onChange={(e) => setBranch(e.target.value)} required>
        <option value="">Pilih Cabang</option>
        {branches.map(branch => (
          <option key={branch.id} value={branch.id}>{branch.branchName}</option>
        ))}
      </select>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

export default ReservationForm;
