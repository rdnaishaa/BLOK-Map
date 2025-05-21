import { Link } from 'react-router-dom'

const CatalogCard = ({ catalog }) => {
  return (
    <Link to={`/catalogs/${catalog.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="h-48 bg-gray-200">
          <img 
            src={catalog.image_url || '/images/catalog-default.png'} 
            alt={catalog.namakatalog}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-primary-black mb-1">
            {catalog.namakatalog}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {catalog.kategori_nama}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-primary-gold font-medium">
              Rp {catalog.harga?.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm">
              {catalog.namarestaurant}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CatalogCard