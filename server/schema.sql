--- Users Table
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

-- review ica
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),  
    content TEXT NOT NULL,
    spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
    resto_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,      
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS kategori_restaurant (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kategori VARCHAR(100) NOT NULL
);

INSERT INTO kategori_restaurant (kategori)
VALUES
    ('Sweetness Overload'),
    ('Umami-rich'),
    ('Fine Dining'),
    ('Amigos (Agak MInggir GOt Sedikit)'),
    ('Sip and savor'),
    ('Brew Coffee');


CREATE TABLE IF NOT EXISTS kategori_spot (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kategori VARCHAR(100) NOT NULL
);

INSERT INTO kategori_spot (kategori)
VALUES
    ('Atraksi'),
    ('Tempat Nongkrong'),
    ('Entertainment'),
    ('Refleksi'),
    ('Rohani'),
    ('Family Friendly');

CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    namaRestaurant VARCHAR(100) NOT NULL,
    kategoriRestaurant_id UUID REFERENCES kategori_restaurant(id),
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
    informasiRestaurant TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE spots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    namaTempat VARCHAR(100) NOT NULL,
    kategoriSpot_id UUID REFERENCES kategori_spot(id),
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--- Tabel Catalog
CREATE TABLE IF NOT EXISTS catalogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    namaKatalog VARCHAR(100) NOT NULL,
    kategoriRestaurant_id UUID REFERENCES kategori_restaurants(id),  
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
    harga INTEGER NOT NULL,
    deskripsiKatalog TEXT NOT NULL,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--- Artikel Tabel
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judulArtikel VARCHAR(255) NOT NULL,
    kontenArtikel TEXT NOT NULL,
    image_url VARCHAR(255),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
    spot_id UUID REFERENCES spots(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);