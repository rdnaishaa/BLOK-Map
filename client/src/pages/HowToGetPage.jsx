import { useState, useEffect } from 'react'
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
  const [activeOption, setActiveOption] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const transportOptions = [
    {
      id: 1,
      name: 'MRT',
      image: mrtImg,
      routeMap: mrtMapImg,
      description: 'Take MRT to Blok M Station, then walk 5 minutes to your destination.',
      time: '5-10 minutes',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C7.58 2 4 5.58 4 10c0 4.41 3.58 8 8 8s8-3.59 8-8c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
      )
    },
    {
      id: 2,
      name: 'KRL',
      image: krlImg,
      routeMap: krlMapImg,
      description: 'Take KRL to Sudirman Station, then transfer to MRT to Blok M, only 20 Minutes.',
      time: '20 minutes',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V5c0-3.5-3.58-4-8-4s-8 .5-8 4v10.5zm8 1.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7H6V5h12v5z" />
        </svg>
      )
    },
    {
      id: 3,
      name: 'LRT',
      image: lrtImg,
      routeMap: lrtMapImg,
      description: 'Take LRT bus to MRT Station, then arrived at MRT Blok-M.',
      time: '15 minutes',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v8zm3-7c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm3 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm3 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1z" />
          <path d="M4 11V8h16v3" />
        </svg>
      )
    },
    {
      id: 4,
      name: 'Kendaraan Pribadi',
      image: kendaraanImg,
      routeMap: kendaraanMapImg,
      description: 'Parking available at Blok M Plaza or Blok M Square.',
      time: 'Varies depending on traffic',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
        </svg>
      )
    }
  ]

  const handleImageClick = (image, id) => {
    setSelectedImage(image)
    setActiveOption(id)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#3D1E0F]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CCBA78] mb-6"></div>
          <p className="text-[#CCBA78] text-lg font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#3D1E0F]">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-2">
            How to Get to <span className="text-amber-300">Blok M</span>
          </h1>
          <div className="h-1 w-32 bg-amber-300 mx-auto rounded-full"></div>
        </div>
        
        <div className="bg-amber-50 bg-opacity-5 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-12 border border-amber-300 border-opacity-30">
          <h2 className="text-3xl font-bold text-amber-300 mb-8 text-center">
            Transportation Options
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {transportOptions.map(option => (
              <div 
                key={option.id} 
                className={`relative overflow-hidden rounded-xl transition-all duration-300 transform ${activeOption === option.id ? 'scale-105 ring-2 ring-amber-300' : 'hover:scale-105'}`}
                style={{ 
                  background: 'linear-gradient(to bottom, rgba(61, 30, 15, 0.95), rgba(44, 17, 7, 0.95))',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)'
                }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-200 to-amber-400"></div>
                
                <div className="p-5">
                  <div className="flex justify-center mb-4 relative">
                    <div className="w-full h-48 overflow-hidden rounded-lg">
                      <img 
                        src={option.image} 
                        alt={option.name} 
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-all duration-500 transform hover:scale-110"
                        onClick={() => handleImageClick(option.routeMap, option.id)}
                      />
                    </div>
                    <div className="absolute -bottom-4 right-4 bg-amber-300 text-brown-900 p-2 rounded-full shadow-lg">
                      {option.icon}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 
                      className="text-xl font-bold text-amber-300 mb-2 cursor-pointer hover:text-amber-200 flex items-center"
                      onClick={() => handleImageClick(option.routeMap, option.id)}
                    >
                      {option.name}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </h3>
                    
                    <div className="flex items-center mb-3">
                      <svg className="w-4 h-4 text-amber-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-amber-200 text-sm font-medium">{option.time}</p>
                    </div>
                    
                    <p className="text-white text-sm leading-relaxed">{option.description}</p>
                    
                    <button 
                      className="mt-4 w-full py-2 bg-amber-300 bg-opacity-10 hover:bg-opacity-20 border border-amber-300 border-opacity-30 rounded-lg text-amber-300 font-medium transition-all duration-300 flex items-center justify-center"
                      onClick={() => handleImageClick(option.routeMap, option.id)}
                    >
                      View Route Map
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for enlarged image */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={closeModal}
          >            <div className="relative w-full max-w-2xl mx-auto">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-200 to-amber-400"></div>
              <button 
                className="absolute -top-12 right-0 text-amber-300 hover:text-amber-200 z-10 p-2 flex items-center transition-all duration-300 transform hover:scale-110"
                onClick={closeModal}
              >
                Close
                <svg 
                  className="w-6 h-6 ml-2" 
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
              <div className="w-full bg-amber-50 bg-opacity-5 p-4 rounded-xl border border-amber-300 border-opacity-30">
                <img 
                  src={selectedImage} 
                  alt="Transport Route" 
                  className="w-full md:h-[60vh] object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Google Maps embed */}
        <div className="bg-amber-50 bg-opacity-5 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-amber-300 border-opacity-30">
          <h2 className="text-3xl font-bold text-amber-300 mb-8 text-center flex items-center justify-center">
            <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Map of Blok M Area
          </h2>
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-200 to-amber-400"></div>
            <div className="h-[450px] w-full rounded-xl overflow-hidden ring-1 ring-amber-300 ring-opacity-30">
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
          
          <div className="mt-8 bg-amber-300 bg-opacity-10 p-4 rounded-lg border border-amber-300 border-opacity-30">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-amber-300 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white text-sm">
                Blok M is a commercial center in South Jakarta. The area is well connected with various transportation options including MRT, buses, and taxis. For the best experience, we recommend using the MRT as it provides the quickest and most comfortable journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowToGetPage