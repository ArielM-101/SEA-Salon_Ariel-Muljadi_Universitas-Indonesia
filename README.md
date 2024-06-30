Cara set up pertama kali website SEA Salon melalui VSCode:
1. Buka new terminal, ketik npm run build
2. Buka file .env. Lalu diubah DB_HOST, DB_USER, dan DB_PASSWORD dengan pengaturan konfigurasi akun mysql anda
3. Folder build sudah terbuat, lalu ketik node server.js
4. Buka file script reservation.sql di program mysql, diubah ALTER USER'nama_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password_user'; dengan user dan pass akun mysql anda 
5. Execute script reservation.sql
6. Buka new terminal lagi, kemudian ketik cd src dan ketik npm start
7. Klik link local host yang tersedia di terminal node atau terminal yang menjalankan node server.js tadi.







