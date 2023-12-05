# youGo-app-api

# urutan mengerjakan 
- buat dulu service atau fungsi yang menggunakan pihak ketiga(firebase/gcp) untuk membuat fungsi yang digunakan untuk menyimpan data di firestore atau gcp.
- hubungkan service nya ke handler
- lalu buat handler -> routes ->index
- jangan lupa di register file nya di createServer.js
-

<b>keterangan</b>
- untuk membuat service , dibuat di folder service. setiap handler dibuatkan service nya.
- untuk melihat handler,routes,api tolong di buat di folder api(tolong lihat contoh sebelumnya ya).
- aplikasi utama server.js
-

# Pengunaan Api
Endpoint 
Endpoint /Articles

Post /Articles
- Mengirim Artikel 
- Dikirim melalui header multipart/form-data
- Body Payload : id(text), title(text), description(text), imageUrl(file)

Get /Articles
- Mengambil semua artikel

Get /Articles/{id}
- mengambil sebuah artikel berdasarkan id nya
- id merupakan id dari sebuah artikel

Put /Articles/{id}
- Merubah Isi artikel
- Dikrim melalui header multipart/form-data
- id merupakan id dari sebuah article
- Body Payload : imageUrl(file), title(text), description(text)

Delete /Articles/{id}
- Menghapus sebuah artikel
- id merupakan id dari sebuah artikel
