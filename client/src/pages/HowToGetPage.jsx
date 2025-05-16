const HowToGetPage = () => {
  const transportOptions = [
    {
      name: 'MRT',
      icon: '/images/mrt.png',
      description: 'Take MRT to Blok M Station, then walk 5 minutes'
    },
    {
      name: 'KRL',
      icon: '/images/krl.png',
      description: 'Take KRL to Sudirman Station, transfer to MRT'
    },
    {
      name: 'Bus',
      icon: '/images/kendaraan.png',
      description: 'Multiple TransJakarta routes serve Blok M'
    },
    {
      name: 'Car',
      icon: '/images/kendaraan.png',
      description: 'Parking available at Blok M Plaza and surrounding areas'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-special-elite text-white mb-6">How to Get There</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-covered-by-your-grace text-primary-black mb-4">
          Find the best route to Blok M from your location
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {transportOptions.map((option, index) => (
            <div key={index} className="flex items-start p-4 border border-gray-200 rounded-lg">
              <img 
                src={option.icon} 
                alt={option.name} 
                className="w-12 h-12 mr-4 object-contain"
              />
              <div>
                <h3 className="text-lg font-semibold text-primary-black mb-1">
                  {option.name}
                </h3>
                <p className="text-gray-600">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="h-96 rounded-lg overflow-hidden">
          <img 
            src="/images/blokm.png" 
            alt="Blok M Area Map" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-primary-black mb-4">Tips</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-primary-gold mr-2">•</span>
            <span>Arrive before 7pm to avoid crowds during peak hours</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-gold mr-2">•</span>
            <span>Bring cash as some vendors may not accept cards</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-gold mr-2">•</span>
            <span>Weekends tend to be more crowded than weekdays</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-gold mr-2">•</span>
            <span>Public transportation is recommended due to limited parking</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default HowToGetPage