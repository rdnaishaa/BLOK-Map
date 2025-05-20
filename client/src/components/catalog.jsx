import React from 'react';
import '../App.css'; // Import global styles

const CatalogCard = ({ catalog }) => {
    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">{catalog.namaKatalog}</h3>
            </div>
            <div className="card-body text-justify">
                <p><strong>Kategori:</strong> {catalog.kategori}</p>
                <p><strong>Lokasi:</strong> {catalog.lokasi}</p>
                <p><strong>Restaurant:</strong> {catalog.namaRestaurant}</p>
                <p><strong>Harga:</strong> Rp {catalog.harga}</p>
                <p><strong>Rating:</strong> {catalog.rating} / 5</p>
                <p><strong>Deskripsi:</strong> {catalog.deskripsiKatalog}</p>
                <p><strong>Informasi Restaurant:</strong> {catalog.informasiRestaurant}</p>
            </div>
        </div>
    );
};

const CatalogList = ({ catalogs }) => {
    return (
        <div className="catalog-list">
            {catalogs.map((catalog, index) => (
                <CatalogCard key={index} catalog={catalog} />
            ))}
        </div>
    );
};

export default CatalogList;
