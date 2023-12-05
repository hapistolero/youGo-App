# **youGo-App-API**

# Urutan Mengerjakan 
- Buat dulu service atau fungsi yang menggunakan pihak ketiga(firebase/gcp) untuk membuat fungsi yang digunakan untuk menyimpan data di firestore atau gcp.
- Hubungkan service nya ke handler
- Lalu buat handler -> routes ->index
- Jangan lupa di register file nya di createServer.js

<b>keterangan</b>
- Untuk membuat service, dibuat di folder service. Setiap handler dibuatkan service nya.
- Untuk melihat handler, routes, API tolong dibuat di folder API (bisa lihat contoh sebelumnya ya).
- Aplikasi utama server.js

# Penggunaan API
## Endpoint 
### Endpoint /Articles

`Post /Articles`
- Mengirim Artikel 
- Dikirim melalui header multipart/form-data
- Body Payload : id(text), title(text), description(text), imageUrl(file)

`Get /Articles`
- Mengambil semua artikel

`Get /Articles/{id}`
- Mengambil sebuah artikel berdasarkan ID-nya
- id merupakan ID dari sebuah artikel

`Put /Articles/{id}`
- Merubah Isi artikel
- Dikrim melalui header multipart/form-data
- id merupakan ID dari sebuah artikel
- Body Payload : imageUrl(file), title(text), description(text)

`Delete /Articles/{id}`
- Menghapus sebuah artikel
- id merupakan ID dari sebuah artikel

### Endpoint /Authentications

`POST/authentications`
- Meminta access token
- Dikirim melalui header multipart/raw/JSON
- Body Payload : email (string), password (string)
  
`PUT/authentications`
- Memperbarui access token

`DELETE/authentications`
- Menghapus access token

### Endpoint /Pose

`POST/poses`
- Menambahkan pose yoga
- Dikirim melalui multipart/form-data
- Body Payload : id (string), title (string), imageurl (file), category (string), step (string), time (string)
  
`GET/poses`
-Menampilkan semua data pose yoga

`GET/poses/{id}`
- Menampilkan data pose yoga berdasarkan ID
- id merupakan ID dari sebuah artikel

`DELETE/poses/{id}`
- Menghapus data pose yoga berdasarkan ID
- id merupakan ID dari sebuah artikel

`PUT/poses/{id}`
- Mengubah data pose yoga
- Dikrim melalui header multipart/form-data
- id merupakan ID dari sebuah artikel
- Body Payload : id (string), title (string), imageurl (file), category (string), step (string), time (string)

### Endpoint /profile

`POST/profile`
- Menambahkan data profil user
- Dikirim melalui header multipart/raw/JSON
- Body Payload : id (string), firstName (string), lastName (string), email (string), age (string), weight (string), height (string)
- Menggunakan user authentication

`GET/profile`
- Menampilkan semua data profil user
- Menggunakan user authentication

`PUT/profile`
- Mengupdate data profil user
- Dikirim melalui header multipart/raw/JSON
- Body Payload : id (string), firstName (string), lastName (string), email (string), age (string), weight (string), height (string)
- Menggunakan user authentication
  
### Endpoint /schedule

`POST/schedule`
- Menambahkan data jadwal
- Dikirim melalui header multipart/raw/JSON
- Body Payload : poseId, scheduleName (string), dayTime (string)
- Menggunakan user authentication

`GET/schedule`
- Menampilkan semua data jadwal
- Menggunakan user authentication

`GET/schedule/{id}`
- Menampilkan semua data jadwal user tertentu berdasarkan ID
- id merupakan ID dari jadwal
- Menggunakan user authentication

`DELETE/schedule/{id}`
- Menghapus data jadwal user tertentu berdasarkan ID
- id merupakan ID dari jadwal
- Menggunakan user authentication

`PUT/schedule/{id}`
- Mengubah data jadwal
- Menggunakan user authentication

### Endpoint /users

`POST/users`
- Mendaftarkan account user
- Dikirim melalui header multipart/raw/JSON
- Body Payload : email (string), password (string)
