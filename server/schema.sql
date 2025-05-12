CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    namaRestaurant VARCHAR(100) NOT NULL,
    kategori_id INTEGER REFERENCES categories(id)
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
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    price NUMRANGE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judulArtikel VARCHAR(255) NOT NULL,
    kontenArtikel TEXT NOT NULL,
    image_url VARCHAR(255),
    places_id UUID REFERENCES places(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kategori VARCHAR(100) NOT NULL CHECK (kategori IN (
        'Sweetness Overload',
        'Umami-rich',
        'Fine Dining',
        'Amigos (Agak MInggir GOt Sedikit)',
        'Sip and savor',
        'Brew Coffee',
        'Atraksi',
        'Tempat Nongkrong',
        'Entertainment',
        'Refleksi',
        'Rohani',
        'Family Friendly'
    ))
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  places_id UUID REFERENCES places(id),
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE catalogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    namaKatalog VARCHAR(100) NOT NULL,
    kategori_id UUID REFERENCES categories(id),
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
    places_id UUID REFERENCES places(id),
    harga INTEGER NOT NULL,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    deskripsiKatalog TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);