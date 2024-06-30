*Notes: 
1. CREATE USER 'nama_user'@'localhost' IDENTIFIED BY 'password_user'; jika anda belum membuat user di data base mysql
   
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'NewPassword123'; jika anda ingin mengubah user yang ada
   
   GRANT ALL PRIVILEGES ON *.* TO 'new_user'@'localhost'; 
   FLUSH PRIVILEGES; jika anda ingin memberikan hak akses ke user baru
   
2. Branch salon tidak bisa dihapus sebelum service salon yang tersedia pada branch salon itu dihapus. Selain itu, data seperti reviews dan reservations dapat dihapus tanpa syarat apapun oleh admin
   
3. Lakukan tiga langkah A, B, dan C secara berurutan yang ada di bawah ini. 
 
A.Cara set up pertama kali website SEA Salon melalui VSCode:
1. Buka new terminal, ketik npm run build
2. Buka file .env. Lalu diubah DB_HOST, DB_USER, dan DB_PASSWORD dengan pengaturan konfigurasi akun mysql anda
3. Folder build sudah terbuat, lalu ketik node server.js (backend)
4. Buka file script reservation.sql di program mysql, diubah ALTER USER'nama_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password_user'; dengan user dan pass akun mysql anda 
5. Execute script reservation.sql
6. Buka new terminal lagi, kemudian ketik cd src dan ketik npm start (frontend)
7. Klik link local host yang tersedia di terminal node atau terminal yang menjalankan node server.js tadi.

B.Cara menggunakan website SEA Salon (sebagai admin):
1. Login ke admin dashboard dengan akun admin (Email: thomas.n@compfest.id dan Password: Admin123) di login form, untuk masuk sebagai admin
2. Admin harus menambahkan terlebih dahulu New Branch, kemudian baru bisa menambahkan New Service sesuai branch salon yang sudah dibuat. Klik back to login
3. Alhasil informasi lengkap mengenai service salon yang baru akan muncul pada Available Services
4. Selain itu, admin juga bisa menghapus current reviews dan all reservations yang telah dibuat oleh customer di admin dashboard tadi.

C.Cara menggunakan website SEA Salon (sebagai customer):
1. Klik Register here untuk membuat akun customer baru, lalu login untuk membuat reservasi service salon
2. Buat reservasi service salon sesuai dengan branch salon yang menyediakan service salon yang tersedia
3. Klik back to login, customer bisa menambahkan review di review form, lalu klim submit review
4. Login kembali untuk melihat My Reservations dan customer juga bisa menghapus reservasi yang telah dibuat sebelumnya.







