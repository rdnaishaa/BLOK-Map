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

CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),        
    namaRestaurant VARCHAR(100) NOT NULL, 
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
    'Taman Literasi',
    'Barito',
    'Gulai Tikungan (Mahakam)',
    'Senayan',
    'Kebayoran Baru'
  )),
    informasiRestaurant VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
);

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
