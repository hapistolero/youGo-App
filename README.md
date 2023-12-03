# yoga-app-api

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

# yang sudah

-fitur register POST
email  
pasword 

-fitur login POST
email  
password  

-fitur post gambar POST
image

-fitur artikel GET
id
imageUrl
Title 
description 
CreatedAt 
UpdateAt

-fitur Detail artikel GET
id
imageUrl
Title 
description 
CreatedAt 
UpdateAt

