const CatalogCard = ({ catalog }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-200">
        <img 
          src={catalog.image_url} 
          alt={catalog.namakatalog}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-primary-black mb-1">
          {catalog.namakatalog}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          {catalog.kategori_nama || catalog.kategoriRestaurant_id}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-primary-gold font-medium">
            Rp {catalog.harga.toLocaleString()}
          </span>
          <span className="text-gray-500 text-sm">
            {catalog.namaRestaurant || catalog.restaurant_id}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CatalogCard