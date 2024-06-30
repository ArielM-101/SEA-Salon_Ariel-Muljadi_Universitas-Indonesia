import React, { useEffect, useState } from 'react';

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('/services')
      .then(response => response.json())
      .then(data => {
        setServices(data);
      })
      .catch(error => {
        console.error('Error fetching services:', error);
      });
  }, []);

  return (
    <div>
      <h2>Available Services</h2>
      <div className="services-container">
        {services.map(service => (
          <div className="service-card" key={service.id}>
            <h3>{service.serviceName}</h3>
            <p>Duration: {service.duration} minutes</p>
            <p>Branch: {service.branchName}</p>
            <p>Location: {service.branchLocation}</p>
            <p>Opening Time: {service.openingTime}</p>
            <p>Closing Time: {service.closingTime}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
