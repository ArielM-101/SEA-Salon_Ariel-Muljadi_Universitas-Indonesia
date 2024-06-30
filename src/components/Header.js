import React from 'react';

const Header = () => {
  const headerStyle = {
    fontFamily: 'Playfair Display, serif',
    fontWeight: 'bold',
    fontSize: '2.5rem',
    textTransform: 'uppercase', // Mengubah teks menjadi huruf kapital
    textAlign: 'center', // Posisi teks menjadi tengah
    marginBottom: '20px', // Jarak bawah
  };

  const subHeaderStyle = {
    fontSize: '1.2rem',
    fontStyle: 'italic',
    textAlign: 'center', // Posisi teks menjadi tengah
  };

  return (
    <header>
      <h1 style={headerStyle}>SEA Salon</h1>
      <p style={subHeaderStyle}>Beauty and Elegance Redefined</p>
    </header>
  );
};

export default Header;
