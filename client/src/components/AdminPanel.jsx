// client/src/components/AdminPanel.jsx
import { useState, useEffect } from 'react'
import { getRestaurants, createRestaurant, deleteRestaurant } from '../services/restaurant_api'
import { getSpots, createSpot, deleteSpot } from '../services/spot_api'
import { getCatalogs, createCatalog, deleteCatalog } from '../services/catalogs_api'
import { useAuth } from '../hooks/useAuth'

const AdminPanel = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('restaurants')
  const [restaurants, setRestaurants] = useState([])
  const [spots, setSpots] = useState([])
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (user?.isAdmin) {
      fetchData()
    }
  }, [user, activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'restaurants') {
        const res = await getRestaurants()
        setRestaurants(res.payload || [])
      } else if (activeTab === 'spots') {
        const res = await getSpots()
        setSpots(res.payload || [])
      } else if (activeTab === 'catalogs') {
        const res = await getCatalogs()
        setCatalogs(res.payload || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user?.isAdmin) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold">Unauthorized Access</h2>
        <p>You don't have permission to view this page</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${activeTab === 'restaurants' ? 'border-b-2 border-primary-gold text-primary-gold' : 'text-gray-600'}`}
          onClick={() => setActiveTab('restaurants')}
        >
          Restaurants
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'spots' ? 'border-b-2 border-primary-gold text-primary-gold' : 'text-gray-600'}`}
          onClick={() => setActiveTab('spots')}
        >
          Spots
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'catalogs' ? 'border-b-2 border-primary-gold text-primary-gold' : 'text-gray-600'}`}
          onClick={() => setActiveTab('catalogs')}
        >
          Catalogs
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {activeTab === 'restaurants' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Restaurants</h2>
              {/* Restaurant management UI */}
            </div>
          )}
          
          {activeTab === 'spots' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Spots</h2>
              {/* Spots management UI */}
            </div>
          )}
          
          {activeTab === 'catalogs' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Catalogs</h2>
              {/* Catalogs management UI */}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminPanel