Bahasa Indonesia:

*Catatan: 
1. CREATE USER 'nama_user'@'localhost' IDENTIFIED BY 'password_user'; jika anda belum membuat user di data base mysql
   
   ALTER USER 'nama_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password_user'; jika anda ingin mengubah user yang ada
   
   GRANT ALL PRIVILEGES ON *.* TO 'nama_user'@'localhost'; 
   FLUSH PRIVILEGES; jika anda ingin memberikan hak akses ke user baru
   
2. Branch salon tidak bisa dihapus sebelum service salon yang tersedia pada branch salon itu dihapus. Selain itu, data seperti reviews dan reservations dapat dihapus tanpa syarat apapun oleh admin
   
3. Lakukan tiga langkah A, B, dan C secara berurutan yang ada di bawah ini.

  
A.Cara set up pertama kali website SEA Salon melalui VSCode:
1. Buka program VSCode, tekan CTRL + K + O lalu pilih folder SEA-Salon_Ariel-Muljadi_Universitas-Indonesia-main 
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

English Language:

*Notes: 
1. CREATE USER 'name_user'@'localhost' IDENTIFIED BY 'password_user'; if you haven't created a user in the mysql data base yet
   
   ALTER USER 'name_user'@'localhost' IDENTIFIED BY mysql_native_password BY 'password_user'; if you want to change an existing user
   
   GRANT ALL PRIVILEGES ON *.* TO 'nama_user'@'localhost'; 
   FLUSH PRIVILEGES; if you want to grant access rights to a new user
   
2. Branch salons cannot be deleted before the salon services available at that branch salon are deleted. Also, data such as reviews and reservations can be deleted without any conditions by the admin.
   
3. Perform the three steps A, B, and C in order below.
   
 
A.How to set up the SEA Salon website for the first time through VSCode:
1. Open new terminal, type npm run build
2. Open the .env file. Then change DB_HOST, DB_USER, and DB_PASSWORD with your mysql account configuration settings
3. The build folder has been created, then type node server.js (backend)
4. Open the reservation.sql script file in the mysql program, change ALTER USER'nama_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password_user'; with the user and pass of your mysql account 
5. Execute the reservation.sql script
6. Open the new terminal again, then type cd src and type npm start (frontend)
7. Click the local host link available in the terminal node or the terminal that runs the server.js node earlier.

B. How to use SEA Salon website (as admin):
1. Login to the admin dashboard with the admin account (Email: thomas.n@compfest.id and Password: Admin123) in the login form, to log in as an admin.
2. Admin must first add New Branch, then can only add New Service according to the salon branch that has been created. Click back to login
3. As a result, complete information about the new salon service will appear in Available Services
4. In addition, the admin can also delete current reviews and all reservations that have been made by customers on the admin dashboard earlier.

C.How to use the SEA Salon website (as a customer):
1. Click Register here to create a new customer account, then login to make a salon service reservation.
2. Make a salon service reservation according to the salon branch that provides available salon services
3. Click back to login, the customer can add a review in the review form, then click submit review
4. Login again to view My Reservations and customers can also delete reservations that have been made previously.







