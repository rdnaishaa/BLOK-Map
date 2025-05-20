<br />
<div align="center">
<h1 align="center">BLOK-M(ap) 🗺️</h1>
  
<p align="center">
  <a href="https://www.canva.com/design/DAGn5VL7gs0/_iHK_Lsss0c7vNlYG_ViJw/edit"><strong>Our Presentation »</strong></a>
  </p>
</div>

---
 
# Anggota Kelompok 26
- R. Aisha Syauqi Ramadhani - 2306250554
- Nabiel Harits Utomo - 2306267044
- Muhammad Pavel - 2306242363
- Dwigina Sitti Zahwa - 2306250724

## Filosofi BLOK-M(ap)
Blok-M sebagai pusat "skena", kuliner, budaya, tempat nongkrong bagi semua kalangan masyarakat, mulai dari Gen-Z, Millenial, Kakek - Nenek semua datang ke Blok-M. Namun, informasi mengenai tempat-tempat tersembunyi ataupun tempat yang wajib dikunjungi tidak selalu mudah diakses, oleh karena itu BLOK-M(ap) hadir sebagai solusi bagi semua kalangan yang ingin mencari suasana baru dan tempat promosi bagi para UMKM. Situs ini menjadi peta *digital* interaktif yang tidak hanya menyajikan data, tetapi juga membangun rasa komunitas, berbagi insight, dan mendukung pelaku UMKM kuliner serta tempat hangout lokal. BLOK-M(ap) dibangun dengan semangat eksplorasi, keterbukaan, dan konektivitas khas anak "Jaksel" (Jakarta Selatan). 

## Tujuan BLOK-M(ap)
- Menyediakan informasi lengkap dan terkini seputar kuliner dan *spot hangout* di Blok-M.
- Memajukan para pemilik UMKM di Indonesia dengan mempromosikan usaha mereka.
- Mempermudah pengunjung dalam menemukan tempat makan dan hiburan sesuai preferensi.
- Menjadi wadah ulasan dan insight dari sesama pengunjung.
- Membantu admin dalam mengelola dan memperbarui katalog tempat dan menu secara efisien.

# Fitur BLOK-M(ap)

## 1. **Food & Drink Catalog**

Fitur ini akan menampilkan daftar makanan dan minuman berupa Card Items (`katalog`) dan memiliki fitur (`kategori dan rentangHarga`), setiap katalog memiliki *attribute* berupa `kategori, namaKatalog, namaRestaurant, dan harga`. Ketika `katalog` diklik akan beralih ke (`CatalogDetailPage`) yang memiliki *detail* informasi (`kategori, namaKatalog, rating, namaRestaurant, deskripsiKatalog, informasiRestaurant, dan review`).

|                                     **Admin**                                      |                             **Pengunjung (User)**                              |
|:----------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------:|
| Dapat menambah, mengedit, dan menghapus item makanan serta melihat detail katalog. | Dapat melihat item makanan dan minuman, tetapi tidak dapat mengedit atau menghapus. |

---

## 2. **Cafe and Restaurant**

Fitur ini menampilkan *page* lengkap yang berisi `artikel` dari restaurant dan kafe sebagai referensi kuliner bagi pengunjung yang sedang "craving" makanan VIRAL, ngopi, ataupun makan cantik, `informasiRestaurant` berupa detail alamat dari restaurant, `rating` , galeri foto, dan `review` dari para pengunjung yang pernah mencobanya.

|                                      **Admin**                                       |                                  **Pengunjung (User)**                                   |
|:------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------:|
| Dapat menambah, mengedit, dan menghapus data restoran, serta melihat detail lengkap. | Dapat melihat informasi lengkap tentang restoran dan kafe, seperti nama, kategori, dan lokasi |

---

## 3. **Spot Hangout**

Fitur ini menampilkan *page* lengkap yang berisi `artikel` dari tempat nongkrong atau tempat bermain sebagai referensi bagi pengunjung yang ingin "Deeptalk" bersama teman, kekasih, keluarga, ataupun "me time". `informasiHangout` berupa detail alamat dari spot hangout, `rating` , galeri foto, dan `review` dari para pengunjung yang pernah mendatanginya.

|                        **Admin**                        |      **Pengunjung (User)**      |
|:-------------------------------------------------------:|:------------------------------------:|
| Dapat menambah, mengedit, dan menghapus tempat hangout. | Dapat melihat detail tempat hangout. |

---

## 4. **Review & Rating**

Fitur ini memungkinkan pengunjung yang sudah pernah mendatangi Spot Hangout, Cafe, ataupun Restaurant untuk memberikan `review` dan `rating`, sehingga para pengunjung tidak akan tertipu.

|                     **Admin**                     |                              **Pengunjung (User)**                              |
|:-------------------------------------------------:|:------------------------------------------------------------------------------------:|
| Dapat mengedit, menghapus, dan memoderasi review. | Dapat membuat dan mengedit review yang mereka buat, serta melihat review orang lain. |

---

## 5. **How To Get**

Fitur ini menyediakan panduan untuk mengunjungi Blok-M menggunakan transportasi umum (MRT, LRT, TransJakarta), disertai dengan foto rute dan penjelasan.

|                   **Admin**                    |       **Pengunjung (User)**       |
|:----------------------------------------------:|:--------------------------------------:|
| Dapat mengedit informasi transportasi yang ada | Dapat melihat cara-cara menuju Blok-M. |

---

## 6. **Login & Register**

Fitur autentikasi untuk memungkinkan pengguna `register` dan `login` dan memberi mereka akses untuk memberikan review dan mengelola konten (khusus admin).

|                         **Admin**                          |                    **Pengunjung (User)**                     |
|:----------------------------------------------------------:|:-----------------------------------------------------------------:|
| Dapat mengakses dashboard untuk mengelola data dan konten. | Dapat login untuk memberikan review dan mengakses fitur tambahan. |
# DATASET


<!-- UML & ERD & Struktur -->
# Flowchart, UML, ERD, dan Struktur Proyek
<details>
  <summary>Diagram dan Struktur</summary>
  <ul>
   <li>
     <h2> <strong>Flowchart</strong><br> <h2>
      <img src="https://hackmd.io/_uploads/SJvwCaKZeg.png" alt="Flowchart">
   </li>
   <li>
     <h2> <strong>UML Diagram</strong><br> <h2>
      <img src="https://hackmd.io/_uploads/rye3lGuZgl.png" alt="UML Diagram">
   </li>
    <li>
     <h2> <strong>ER Diagram</strong><br> <h2>
      <img src="https://hackmd.io/_uploads/Bk5zgiYWgx.png" alt="ER Diagram">
    </li>
    <li>
     <h2> <strong>Struktur Proyek</strong> <h2>
      <pre><code>
BLOK-Map/
├── client/                  
│   ├── public/                
│   ├── src/
│   │   ├── assets/            
│   │   │   ├── images/ 
│   │   ├── components/       
│   │   │   ├── common/ 
│   │   ├── context/       
│   │   ├── hooks/         
│   │   ├── pages/            
│   │   │   ├── auth/
│   │   │   ├── catalog/
│   │   │   ├── restaurant/
│   │   │   ├── spot/
│   │   ├── services/           
│   │   ├── App.jsx            
│   │   ├── main.jsx           
│   ├── .env                 
│   ├── index.html             
│   ├── package.json           
│   └── vite.config.js         
│
├── server/                   
│   ├── config/                
│   ├── controllers/           
│   ├── models/                
│   ├── routes/                
│   ├── middleware/           
│   ├── utils/                
│   ├── .env                   
│   ├── package.json           
│   └── index.js             
│
└── README.md
      </code></pre>
    </li>
  </ul>
</details>
