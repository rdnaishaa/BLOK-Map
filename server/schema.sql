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
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  namaRestaurant VARCHAR(200) NOT NULL,
  kategori VARCHAR(100) NOT NULL CHECK (kategori IN (
    'Sweetness Overload',
    'Umami-rich',
    'Fine Dining',
    'Amigos (Agak MInggir GOt Sedikit)',
    'Sip and savor',
    'Brew Coffee',

  )),
  lokasi VARCHAR(100) NOT NULL CHECK (lokasi IN (
    'Blok-M Square',
    'Plaza Blok-M',
    'Melawai',
    'Sambas',
    'Taman Literasi',
    'Bekas Stasiun Blok-M',
    'Gulai Tikungan (Mahakam)'
  )),
  informasiRestaurant TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255),
  type VARCHAR(20) NOT NULL DEFAULT 'restaurant' CHECK (type IN ('restaurant', 'cafe')),
  rating FLOAT DEFAULT 0,
  artikel TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_restaurants_kategori ON restaurants(kategori);
CREATE INDEX idx_restaurants_lokasi ON restaurants(lokasi);
CREATE INDEX idx_restaurants_type ON restaurants(type);
CREATE INDEX idx_restaurants_price ON restaurants(price);

--- spot hangout
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    'Sambas',
    'Taman Literasi',
    'Bekas Stasiun Blok-M',
    'Gulai Tikungan (Mahakam)'
  )),
  informasiHangout TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255),
  type VARCHAR(20) NOT NULL DEFAULT 'Tempat Nongkrong',
  rating FLOAT DEFAULT 0,
  artikel TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_spots_kategori ON spots(kategori);
CREATE INDEX idx_spots_lokasi ON spots(lokasi);
CREATE INDEX idx_spots_price ON spots(price);