<<<<<<< HEAD
-- review ica
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('restaurant', 'spot_hangout')),
  item_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--- restaurant&cafe
=======
--- Extension for UUID
>>>>>>> 40504de (Updating query for every table)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- review ica
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    --- references
    spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
    cafe_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    resto_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,

--- Restaurant & Cafe Table
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    namaRestaurant VARCHAR(100) NOT NULL,
    kategori VARCHAR(100) NOT NULL CHECK (kategori IN (
        'Sweetness Overload',
        'Umami-rich',
        'Fine Dining',
        'Amigos (Agak MInggir GOt Sedikit)',
        'Sip and savor',
        'Brew Coffee'
    )),
    lokasi VARCHAR(100) NOT NULL CHECK (lokasi IN (
        'Blok-M Square',
        'Plaza Blok-M',
        'Melawai',
        'Taman Literasi',
        'Barito',
        'Gulai Tikungan (Mahakam)',
        'Senayan',
        'Kebayoran Baru'
    )),
    informasiRestaurant TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

<<<<<<< HEAD
--- spot hangout
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),               
    judulArtikel VARCHAR(255) NOT NULL,          
    kontenArtikel TEXT NOT NULL,                
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),  
    spot_id INTEGER REFERENCES spots(id) ON DELETE CASCADE,  
    image_url VARCHAR(255),    
    price NUMRANGE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);

CREATE TABLE IF NOT EXISTS spots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  namaHangout VARCHAR(200) NOT NULL,
  kategori VARCHAR(100) NOT NULL CHECK (kategori IN (
    'Atraksi',
    'Tempat Nongkrong',
    'Entertainment',
    'Refleksi',
    'Rohani',
    'Family Friendly'
  )),
  lokasi VARCHAR(100) NOT NULL CHECK (lokasi IN (
    'Blok-M Square',
    'Plaza Blok-M',
    'Melawai',
    'Taman Literasi',
    'Barito',
    'Gulai Tikungan (Mahakam)',
    'Senayan',
    'Kebayoran Baru'
  )),
  informasiHangout TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
=======
--- Spot Hangout Table
CREATE TABLE IF NOT EXISTS spots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    namaSpot VARCHAR(100) NOT NULL,
    kategori VARCHAR(100) NOT NULL CHECK (kategori IN (
        'Atraksi',
        'Tempat Nongkrong',
        'Entertainment',
        'Refleksi',
        'Rohani',
        'Family Friendly'
    )),
    lokasi VARCHAR(100) NOT NULL CHECK (lokasi IN (
        'Blok-M Square',
        'Plaza Blok-M',
        'Melawai',
        'Taman Literasi',
        'Barito',
        'Gulai Tikungan (Mahakam)',
        'Senayan',
        'Kebayoran Baru'
    )),
    informasiSpot TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--- Tabel Catalog
CREATE TABLE IF NOT EXISTS catalogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    namaKatalog VARCHAR(100) NOT NULL,
    kategori VARCHAR(100) NOT NULL CHECK (kategori IN (
        'Sweetness Overload',
        'Umami-rich',
        'Fine Dining',
        'Amigos (Agak MInggir GOt Sedikit)',
        'Sip and savor',
        'Brew Coffee'
    )),
    lokasi VARCHAR(100) NOT NULL CHECK (lokasi IN (
        'Blok-M Square',
        'Plaza Blok-M',
        'Melawai',
        'Taman Literasi',
        'Barito',
        'Gulai Tikungan (Mahakam)',
        'Senayan',
        'Kebayoran Baru'
    )),
    namaRestaurant VARCHAR(100) NOT NULL,
    harga INTEGER NOT NULL,
    deskripsiKatalog TEXT NOT NULL,
    informasiRestaurant TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE
);

--- Artikel Tabel
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judulArtikel VARCHAR(255) NOT NULL,
    kontenArtikel TEXT NOT NULL,
    image_url VARCHAR(255),
    price NUMRANGE NOT NULL,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
    spot_id UUID REFERENCES spots(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
>>>>>>> 40504de (Updating query for every table)
