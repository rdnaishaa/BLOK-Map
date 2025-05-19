const SpotCard = ({ spot }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-200">
        <img 
          src={`/images/spot${Math.floor(Math.random() * 3) + 1}.png`} 
          alt={spot.namaTempat}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-primary-black mb-1">
          {spot.namaTempat}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          {spot.kategori_nama || spot.kategori}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-primary-gold font-medium">
            {spot.price}
          </span>
          <span className="text-gray-500 text-sm">
            {spot.lokasi}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SpotCard