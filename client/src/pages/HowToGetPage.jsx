const HowToGetPage = () => {
  const transportOptions = [
    {
      id: 1,
      name: 'MRT',
      image: '/images/mrt.png',
      description: 'Take MRT to Blok M Station, then walk 5 minutes to your destination.',
      time: 'Approx. 10 min from Blok M MRT'
    },
    {
      id: 2,
      name: 'KRL',
      image: '/images/krl.png',
      description: 'Take KRL to Sudirman Station, then transfer to MRT to Blok M.',
      time: 'Approx. 20 min from Sudirman Station'
    },
    {
      id: 3,
      name: 'Bus',
      image: '/images/kendaraan.png',
      description: 'Take TransJakarta bus to Blok M Terminal, then walk to your destination.',
      time: 'Approx. 15 min from Blok M Terminal'
    },
    {
      id: 4,
      name: 'Car',
      image: '/images/lrt.png',
      description: 'Parking available at Blok M Plaza or Blok M Square.',
      time: 'Varies depending on traffic'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-special-elite text-white mb-8">How to Get to Blok M</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-covered-by-your-grace text-primary-black mb-4">
          Transportation Options
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {transportOptions.map(option => (
            <div key={option.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <img 
                  src={option.image} 
                  alt={option.name} 
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">{option.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{option.time}</p>
              <p className="text-gray-700">{option.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-covered-by-your-grace text-primary-black mb-4">
          Map of Blok M Area
        </h2>
        <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
          <img 
            src="/images/blokm.png" 
            alt="Blok M Map" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default HowToGetPage