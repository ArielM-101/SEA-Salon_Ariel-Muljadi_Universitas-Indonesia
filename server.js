require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const getReservationsQuery = `
  SELECT
    reservations.id,
    reservations.name,
    reservations.phoneNumber,
    services.serviceName AS serviceType,
    reservations.dateTime,
    branches.branchName
  FROM
    reservations
  JOIN
    users ON reservations.userId = users.id
  JOIN
    services ON reservations.serviceType = services.id
  JOIN
    branches ON reservations.branchId = branches.id
  WHERE
    reservations.userId = ?
`;

const app = express();
const port = 3000;
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    return;
  }
  console.log('Connected to the database.');
});

// Hash password for the admin user and insert into the database
const adminPassword = 'Admin123';
const saltRounds = 10;

bcrypt.hash(adminPassword, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  const adminUser = {
    fullName: 'Thomas N',
    email: 'thomas.n@compfest.id',
    phoneNumber: '08123456789',
    password: hashedPassword,
    role: 'Admin'
  };

  const sql = `INSERT INTO users (fullName, email, phoneNumber, password, role)
               VALUES (?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE password=VALUES(password)`;

  connection.query(sql, [adminUser.fullName, adminUser.email, adminUser.phoneNumber, adminUser.password, adminUser.role], (err, results) => {
    if (err) {
      console.error('Error inserting admin user:', err.message);
      return;
    }
    console.log('Admin user inserted or updated successfully.');
  });
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== 'Admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = decoded.id;
    next();
  });
};

app.post('/register', (req, res) => {
  const { fullName, email, phoneNumber, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = "INSERT INTO users (fullName, email, phoneNumber, password, role) VALUES (?, ?, ?, ?, 'Customer')";
  connection.query(sql, [fullName, email, phoneNumber, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error registering user:', err.message);
      return res.status(500).json({ error: 'Error registering user' });
    }
    res.json({ message: 'User registered successfully' });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      return res.status(500).json({ error: 'Error fetching user' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: 86400 });
    res.json({ token, role: user.role });
  });
});

app.post('/reservations', verifyToken, (req, res) => {
  const { name, phoneNumber, serviceType, dateTime, branchId } = req.body; // Ensure branchId is correctly used
  const userId = req.userId;

  const sql = "INSERT INTO reservations (userId, name, phoneNumber, serviceType, dateTime, branchId) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(sql, [userId, name, phoneNumber, serviceType, dateTime, branchId], (err, results) => {
    if (err) {
      console.error('Error making reservation:', err.message);
      return res.status(500).json({ error: 'Error making reservation' });
    }
    res.json({ message: 'Reservation made successfully', id: results.insertId });
  });
});

app.get('/reservations', verifyToken, (req, res) => {
  const userId = req.userId;

  connection.query(getReservationsQuery, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching reservations:', err.message);
      return res.status(500).json({ error: 'Error fetching reservations' });
    }
    res.json(results);
  });
});

app.get('/branches', (req, res) => {
  const sql = "SELECT * FROM branches";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching branches:', err.message);
      return res.status(500).json({ error: 'Error fetching branches' });
    }
    res.json(results);
  });
});

app.post('/add-service', verifyAdmin, (req, res) => {
  const { serviceName, duration, branchId } = req.body;
  const sql = "INSERT INTO services (serviceName, duration, branchId) VALUES (?, ?, ?)";
  connection.query(sql, [serviceName, duration, branchId], (err, results) => {
    if (err) {
      console.error('Error adding service:', err.message);
      return res.status(500).json({ error: 'Error adding service' });
    }
    res.json({ message: 'Service added successfully' });
  });
});

app.post('/add-branch', verifyAdmin, (req, res) => {
  const { branchName, branchLocation, openingTime, closingTime } = req.body;
  const sql = "INSERT INTO branches (branchName, branchLocation, openingTime, closingTime) VALUES (?, ?, ?, ?)";
  connection.query(sql, [branchName, branchLocation, openingTime, closingTime], (err, results) => {
    if (err) {
      console.error('Error adding branch:', err.message);
      return res.status(500).json({ error: 'Error adding branch' });
    }
    res.json({ message: 'Branch added successfully' });
  });
});

app.delete('/delete-service/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM services WHERE id = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error deleting service:', err.message);
      return res.status(500).json({ error: 'Error deleting service' });
    }
    res.json({ message: 'Service deleted successfully' });
  });
});

app.delete('/delete-branch/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM branches WHERE id = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error deleting branch:', err.message);
      return res.status(500).json({ error: 'Error deleting branch' });
    }
    res.json({ message: 'Branch deleted successfully' });
  });
});

app.post('/reviews', (req, res) => {
  const { customerName, rating, comment } = req.body;
  const sql = "INSERT INTO reviews (customerName, rating, comment) VALUES (?, ?, ?)";
  connection.query(sql, [customerName, rating, comment], (err, results) => {
    if (err) {
      console.error('Error adding review:', err.message);
      return res.status(500).json({ error: 'Error adding review' });
    }
    res.json({ message: 'Review added successfully', id: results.insertId });
  });
});

app.get('/reviews', (req, res) => {
  const sql = "SELECT * FROM reviews ORDER BY createdAt DESC";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching reviews:', err.message);
      return res.status(500).json({ error: 'Error fetching reviews' });
    }
    res.json(results);
  });
});

app.delete('/reviews/:id', verifyToken, (req, res) => {
  const reviewId = req.params.id;
  const userId = req.userId;

  const sqlCheckAdmin = "SELECT role FROM users WHERE id = ?";
  connection.query(sqlCheckAdmin, [userId], (err, results) => {
    if (err) {
      console.error('Error verifying admin:', err.message);
      return res.status(500).json({ error: 'Error verifying admin' });
    }
    if (results.length === 0 || results[0].role !== 'Admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const sql = "DELETE FROM reviews WHERE id = ?";
    connection.query(sql, [reviewId], (err, results) => {
      if (err) {
        console.error('Error deleting review:', err.message);
        return res.status(500).json({ error: 'Error deleting review' });
      }
      res.json({ message: 'Review deleted successfully' });
    });
  });
});

// Tambahkan ini di server Express Anda
app.delete('/reservations/:id', verifyToken, (req, res) => {
  const reservationId = req.params.id;
  const userId = req.userId;

  const sqlCheckReservation = 'SELECT * FROM reservations WHERE id = ? AND userId = ?';
  connection.query(sqlCheckReservation, [reservationId, userId], (err, results) => {
    if (err) {
      console.error('Error verifying reservation:', err.message);
      return res.status(500).json({ error: 'Error verifying reservation' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const sqlDeleteReservation = 'DELETE FROM reservations WHERE id = ?';
    connection.query(sqlDeleteReservation, [reservationId], (err, results) => {
      if (err) {
        console.error('Error deleting reservation:', err.message);
        return res.status(500).json({ error: 'Error deleting reservation' });
      }

      res.json({ message: 'Reservation deleted successfully' });
    });
  });
});

// Tambahkan ini di server Express Anda
app.get('/all-reservations', verifyToken, (req, res) => {
  const sql = `
    SELECT
      reservations.id,
      reservations.name,
      reservations.phoneNumber,
      services.serviceName AS serviceType,
      reservations.dateTime,
      branches.branchName
    FROM
      reservations
    JOIN
      services ON reservations.serviceType = services.id
    JOIN
      branches ON reservations.branchId = branches.id
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching reservations:', err.message);
      return res.status(500).json({ error: 'Error fetching reservations' });
    }
    res.json(results);
  });
});

app.get('/services', (req, res) => {
  const sql = `
    SELECT 
      services.id, 
      services.serviceName, 
      services.duration, 
      branches.branchName, 
      branches.branchLocation, 
      branches.openingTime, 
      branches.closingTime 
    FROM services
    JOIN branches ON services.branchId = branches.id
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching services:', err.message);
      return res.status(500).json({ error: 'Error fetching services' });
    }
    res.json(results);
  });
});

// Tambahkan endpoint untuk mengambil layanan berdasarkan cabang tertentu
app.get('/branches/:branchId/services', (req, res) => {
  const { branchId } = req.params;

  const sql = `
    SELECT 
      services.id, 
      services.serviceName, 
      services.duration, 
      branches.branchName, 
      branches.branchLocation, 
      branches.openingTime, 
      branches.closingTime 
    FROM services
    JOIN branches ON services.branchId = branches.id
    WHERE services.branchId = ?
  `;

  connection.query(sql, [branchId], (err, results) => {
    if (err) {
      console.error('Error fetching services by branch:', err.message);
      return res.status(500).json({ error: 'Error fetching services by branch' });
    }
    res.json(results);
  });
});

app.delete('/delete-reservation/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM reservations WHERE id = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error deleting reservation:', err.message);
      return res.status(500).json({ error: 'Error deleting reservation' });
    }
    res.json({ message: 'Reservation deleted successfully' });
  });
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
