import React, { useState, useEffect } from 'react';
import CatalogList from './components/catalog';

export default function App() {
    const [catalogs, setCatalogs] = useState([]);

    useEffect(() => {
        // Simulate fetching data from backend
        const fetchCatalogs = async () => {
            const sampleCatalogs = [
                {
                    namaKatalog: "Catalog 1",
                    kategori: "Food",
                    lokasi: "Jakarta",
                    namaRestaurant: "Restaurant A",
                    harga: 50000,
                    rating: 4.5,
                    deskripsiKatalog: "Delicious food catalog.",
                    informasiRestaurant: "Open 9 AM - 9 PM"
                },
                {
                    namaKatalog: "Catalog 2",
                    kategori: "Drink",
                    lokasi: "Bandung",
                    namaRestaurant: "Restaurant B",
                    harga: 30000,
                    rating: 4.0,
                    deskripsiKatalog: "Refreshing drinks catalog.",
                    informasiRestaurant: "Open 10 AM - 8 PM"
                },
                // Add 4 more sample catalogs
                {
                    namaKatalog: "Catalog 3",
                    kategori: "Dessert",
                    lokasi: "Surabaya",
                    namaRestaurant: "Restaurant C",
                    harga: 40000,
                    rating: 4.8,
                    deskripsiKatalog: "Sweet desserts catalog.",
                    informasiRestaurant: "Open 11 AM - 10 PM"
                },
                {
                    namaKatalog: "Catalog 4",
                    kategori: "Fast Food",
                    lokasi: "Medan",
                    namaRestaurant: "Restaurant D",
                    harga: 60000,
                    rating: 4.2,
                    deskripsiKatalog: "Quick and tasty meals.",
                    informasiRestaurant: "Open 24/7"
                },
                {
                    namaKatalog: "Catalog 5",
                    kategori: "Vegan",
                    lokasi: "Bali",
                    namaRestaurant: "Restaurant E",
                    harga: 45000,
                    rating: 4.7,
                    deskripsiKatalog: "Healthy vegan options.",
                    informasiRestaurant: "Open 8 AM - 8 PM"
                },
                {
                    namaKatalog: "Catalog 6",
                    kategori: "Seafood",
                    lokasi: "Makassar",
                    namaRestaurant: "Restaurant F",
                    harga: 70000,
                    rating: 4.9,
                    deskripsiKatalog: "Fresh seafood dishes.",
                    informasiRestaurant: "Open 12 PM - 10 PM"
                }
            ];
            setCatalogs(sampleCatalogs);
        };

        fetchCatalogs();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold underline">Catalog List</h1>
            <CatalogList catalogs={catalogs} />
        </div>
    );
}