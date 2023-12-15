# **youGo-App-API**

## Urutan Mengerjakan 
- Buat dulu service atau fungsi yang menggunakan pihak ketiga(firebase/gcp) untuk membuat fungsi yang digunakan untuk menyimpan data di firestore atau gcp.
- Hubungkan service nya ke handler
- Lalu buat handler -> routes ->index
- Jangan lupa di register file nya di createServer.js

#### Keterangan
- Untuk membuat service, dibuat di folder service. Setiap handler dibuatkan service nya.
- Untuk melihat handler, routes, API tolong dibuat di folder API (bisa lihat contoh sebelumnya ya).
- Aplikasi utama server.js

## Penggunaan API
### Endpoint 
#### 1. Endpoint /articles

`Post /articles`
- Mengirim Artikel 
- Dikirim melalui header multipart/form-data
- Body Payload : id(text), title(text), description(text), imageUrl(file), webUrl(text)

`Get /articles`
- Mengambil semua artikel

`Get /articles/{id}`
- Mengambil sebuah artikel berdasarkan ID-nya
- id merupakan ID dari sebuah artikel

`Put /articles/{id}`
- Merubah Isi artikel
- Dikrim melalui header multipart/form-data
- id merupakan ID dari sebuah artikel
- Body Payload : imageUrl(file), title(text), description(text), webUrl(text)

`Delete /articles/{id}`
- Menghapus sebuah artikel
- id merupakan ID dari sebuah artikel

#### 2. Endpoint /authentications

`POST/authentications`
- Meminta access token
- Dikirim melalui header multipart/raw/JSON
- Body Payload : email (string), password (string)
  
`PUT/authentications`
- Memperbarui access token

`DELETE/authentications`
- Menghapus access token

#### 2. Endpoint /authenticationsAdmin

`POST/authentications`
- Meminta access token (admin)
- Dikirim melalui header multipart/raw/JSON
- Body Payload : email (string), password (string)
  
`PUT/authentications`
- Memperbarui access token(admin)

`DELETE/authentications`
- Menghapus access token(admin)

#### 3. Endpoint /Pose

`POST/poses`
-(admin)
- Menambahkan pose yoga
- Dikirim melalui multipart/form-data
- Body Payload : id (string), title (string), imageUrl (file), category (string), step (string), time (string)
  
`GET/poses`
- Menampilkan semua data pose yoga

`GET/poses/{id}`
- Menampilkan data pose yoga berdasarkan ID
- id merupakan ID dari sebuah artikel

`DELETE/poses/{id}`
-(admin)
- Menghapus data pose yoga berdasarkan ID
- id merupakan ID dari sebuah artikel

`PUT/poses/{id}`
-(admin)
- Mengubah data pose yoga
- Dikrim melalui header multipart/form-data
- id merupakan ID dari sebuah artikel
- Body Payload : id (string), title (string), imageUrl (file), category (string), step (string), time (string)

#### 4. Endpoint /profile

`POST/profile`
- Menambahkan data profil user
- Dikirim melalui header application/JSON
- Body Payload : id (string), firstName (string), lastName (string), email (string), age (string), weight (string), height (string)
- Menggunakan user authentication

`GET/profile`
- Menampilkan semua data profil user
- Menggunakan user authentication

`PUT/profile`
- Mengupdate data profil user
- Dikirim melalui header application/JSON
- Body Payload : id (string), firstName (string), lastName (string), email (string), age (string), weight (string), height (string)
- Menggunakan user authentication
  
#### 5. Endpoint /schedule

`POST/schedule`
- Menambahkan data jadwal
- Dikirim melalui header application/JSON
- Body Payload : poseId(string array), scheduleName (string), dayTime (string)
- Menggunakan user authentication
- example : { "scheduleName": "sched123",
              "dayTime":"friday",
              "poseId":["P001","P003"]
  }

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

### 6. Endpoint /users

`POST/users`
- Mendaftarkan account user
- Dikirim melalui header JSON
- Body Payload : email (string), password (string)

### 6. Endpoint /yogaPlaceRecomendation

`POST/yogaPlaceRecomendation`
- mendapatkan rekomendasi tempat yoga dari keberadaan user
- Body Payload : lattitude (string), longitude (string)

### 6. Endpoint /checkMyPose/{id}

`POST/checkMyPose/{id}`
- cek pose yoga anda apakah sudah benar
- id merupakan pose yoga mana yang akan anda bandingkan
- Body Payload : image(file)

 


