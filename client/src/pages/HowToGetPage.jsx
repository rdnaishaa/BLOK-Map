import { useState } from 'react'
import mrtImg from '../assets/images/mrt.jpg'
import krlImg from '../assets/images/krl.jpg'
import lrtImg from '../assets/images/lrt.jpg'
import kendaraanImg from '../assets/images/kendaraan.webp'
import mrtMapImg from '../assets/images/mapMRT.png'
import krlMapImg from '../assets/images/mapKRL.png'
import lrtMapImg from '../assets/images/mapLRT.webp'
import kendaraanMapImg from '../assets/images/mapKendaraan.jpg'

const HowToGetPage = () => {
  const [selectedImage, setSelectedImage] = useState(null)

  const transportOptions = [
    {
      id: 1,
      name: 'MRT',
      image: mrtImg,
      routeMap: mrtMapImg,
      description: 'Take MRT to Blok M Station, then walk 5 minutes to your destination.',
      time: '5-10 minutes'
    },
    {
      id: 2,
      name: 'KRL',
      image: krlImg,
      routeMap: krlMapImg,
      description: 'Take KRL to Sudirman Station, then transfer to MRT to Blok M, only 20 Minutes.',
      time: '20 minutes'
    },
    {
      id: 3,
      name: 'LRT',
      image: lrtImg,
      routeMap: lrtMapImg,
      description: 'Take LRT bus to MRT Station, then arrived at MRT Blok-M.',
      time: '15 minutes'
    },
    {
      id: 4,
      name: 'Kendaraan Pribadi',
      image: kendaraanImg,
      routeMap: kendaraanMapImg,
      description: 'Parking available at Blok M Plaza or Blok M Square.',
      time: 'Varies depending on traffic'
    }
  ]

  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

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
                  className="h-32 w-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(option.routeMap)}
                />
              </div>
              <h3 
                className="text-lg font-semibold text-center mb-2 cursor-pointer hover:text-primary-600"
                onClick={() => handleImageClick(option.routeMap)}
              >
                {option.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{option.time}</p>
              <p className="text-gray-700">{option.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative w-full max-w-5xl mx-auto aspect-[16/9]">
            <button 
              className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10 p-2"
              onClick={closeModal}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
            <div className="w-full h-full">
              <img 
                src={selectedImage} 
                alt="Transport Route" 
                className="w-full h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Google Maps embed */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-covered-by-your-grace text-primary-black mb-4">
          Map of Blok M Area
        </h2>
        <div className="h-[450px] w-full bg-gray-200 rounded-lg overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8250.842473194953!2d106.79227074311012!3d-6.244276445190457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f16c6e4b11bf%3A0x8df7f816ae1b683f!2sBlok%20M%20BCA!5e1!3m2!1sid!2sid!4v1747749570814!5m2!1sid!2sid"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}

export default HowToGetPage