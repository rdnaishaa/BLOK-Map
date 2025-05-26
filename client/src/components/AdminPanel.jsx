import { useState, useEffect } from 'react'
import { getRestaurants, createRestaurant, deleteRestaurant } from '../services/restaurant_api'
import { getSpots, addSpot, deleteSpot } from '../services/spot_api'
import { getCatalogs, createCatalog, deleteCatalog } from '../services/catalogs_api'
import { useAuth } from '../hooks/useAuth'
import { Trash2, Utensils, MapPin, BookOpen, Users, Activity, Shield, BarChart3, Edit2, Plus } from 'lucide-react'

const AdminPanel = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('restaurants')
  const [restaurants, setRestaurants] = useState([])
  const [spots, setSpots] = useState([])
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('add') // 'add' or 'edit'
  const [modalTab, setModalTab] = useState('restaurants')
  const [modalData, setModalData] = useState({})

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

  // Handler delete
  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm('Delete this restaurant?')) return;
    setLoading(true);
    try {
      await deleteRestaurant(id, user.token);
      setRestaurants(restaurants.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete restaurant!');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteSpot = async (id) => {
    if (!window.confirm('Delete this spot?')) return;
    setLoading(true);
    try {
      await deleteSpot(id, user.token);
      setSpots(spots.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete spot!');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteCatalog = async (id) => {
    if (!window.confirm('Delete this catalog?')) return;
    setLoading(true);
    try {
      await deleteCatalog(id, user.token);
      setCatalogs(catalogs.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete catalog!');
    } finally {
      setLoading(false);
    }
  };

  // Handler open modal add/edit
  const openAddModal = (tab) => {
    setModalType('add')
    setModalTab(tab)
    setModalData({})
    setModalOpen(true)
  }
  const openEditModal = (tab, data) => {
    setModalType('edit')
    setModalTab(tab)
    setModalData(data)
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setModalData({})
  }

  // Handler submit modal
  const handleModalSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (modalTab === 'restaurants') {
        if (modalType === 'add') {
          await createRestaurant(modalData, user.token)
        } else {
          // edit resto: panggil editRestaurant jika ada
        }
        const res = await getRestaurants()
        setRestaurants(res.payload || [])
      } else if (modalTab === 'spots') {
        if (modalType === 'add') {
          await addSpot(modalData, user.token)
        } else {
          await editSpot(modalData, user.token)
        }
        const res = await getSpots()
        setSpots(res.payload || [])
      } else if (modalTab === 'catalogs') {
        if (modalType === 'add') {
          await createCatalog(modalData, user.token)
        } else {
          // edit catalog: panggil editCatalog jika ada
        }
        const res = await getCatalogs()
        setCatalogs(res.payload || [])
      }
      closeModal()
    } catch (err) {
      alert('Failed to save data!')
    } finally {
      setLoading(false)
    }
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-red-100 text-center max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Unauthorized Access
          </h2>
          <p className="text-gray-600 leading-relaxed">You don't have permission to view this admin panel</p>
        </div>
      </div>
    )
  }

  const tabConfig = [
    { key: 'restaurants', label: 'Restaurants', icon: Utensils, color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50', textColor: 'text-orange-600' },
    { key: 'spots', label: 'Spots', icon: MapPin, color: 'from-blue-500 to-indigo-500', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { key: 'catalogs', label: 'Catalogs', icon: BookOpen, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50', textColor: 'text-purple-600' }
  ]

  const currentData = activeTab === 'restaurants' ? restaurants : 
                     activeTab === 'spots' ? spots : catalogs

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3D1E0F] via-[#6B3F23] to-[#CCBA78]">
      {/* Header */}
      <div className="bg-[#2A1509]/90 backdrop-blur-xl border-b border-[#CCBA78]/30 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-[#CCBA78] to-[#6B3F23] rounded-2xl shadow-lg">
                <BarChart3 className="w-7 h-7 text-[#3D1E0F]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#CCBA78] to-[#6B3F23] bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-[#CCBA78] font-medium">Manage your platform content with ease</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-[#CCBA78]/20 px-4 py-2 rounded-full border border-[#CCBA78]/40">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[#3D1E0F] font-medium text-sm">Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {tabConfig.map((tab) => {
            const Icon = tab.icon
            const count = tab.key === 'restaurants' ? restaurants.length :
                         tab.key === 'spots' ? spots.length : catalogs.length
            return (
              <div 
                key={tab.key} 
                className={`group cursor-pointer transform hover:scale-105 transition-all duration-300 ${
                  activeTab === tab.key ? 'scale-105' : ''
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <div className={`bg-gradient-to-r from-[#CCBA78]/80 to-[#6B3F23]/80 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${
                  activeTab === tab.key 
                    ? 'border-[#CCBA78] ring-4 ring-[#CCBA78]/20' 
                    : 'border-[#CCBA78]/30 hover:border-[#CCBA78]/60'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#CCBA78] mb-2 uppercase tracking-wide">{tab.label}</p>
                      <p className="text-4xl font-bold text-[#3D1E0F] mb-1">{count}</p>
                      <p className="text-xs text-[#CCBA78]">Active items</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#CCBA78] to-[#6B3F23] shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-[#3D1E0F]" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#2A1509]/80 backdrop-blur-lg rounded-3xl shadow-xl mb-8 overflow-hidden border border-[#CCBA78]/30">
          <div className="flex">
            {tabConfig.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  className={`flex-1 px-8 py-6 flex items-center justify-center space-x-3 transition-all duration-300 font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-[#CCBA78] to-[#6B3F23] text-[#3D1E0F] shadow-xl transform scale-105'
                      : 'text-[#CCBA78] hover:bg-[#3D1E0F]/40 hover:text-white hover:scale-102'
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="text-lg">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-[#F5F5F4]/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-[#CCBA78]/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-[#CCBA78]/30"></div>
                <div className="w-16 h-16 rounded-full border-4 border-[#CCBA78] border-t-transparent animate-spin absolute top-0 left-0"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-[#3D1E0F] mb-2">Loading Data...</h3>
                <p className="text-[#6B3F23]">Please wait while we fetch your content</p>
              </div>
            </div>
          ) : (
            <div className="p-8">
              {activeTab === 'restaurants' && (
                <div>
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="p-2 bg-gradient-to-r from-[#CCBA78] to-[#6B3F23] rounded-xl">
                      <Utensils className="w-6 h-6 text-[#3D1E0F]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#3D1E0F]">Manage Restaurants</h2>
                  </div>
                  {restaurants.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-[#CCBA78]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Utensils className="w-10 h-10 text-[#CCBA78]" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#3D1E0F] mb-3">No restaurants found</h3>
                      <p className="text-[#6B3F23] max-w-md mx-auto">Start building your restaurant directory by adding your first restaurant.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-[#CCBA78]/30">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-[#CCBA78]/30 to-[#6B3F23]/10">
                          <tr>
                            <th className="text-left py-5 px-6 font-bold text-[#3D1E0F] text-sm uppercase tracking-wide">Restaurant</th>
                            <th className="text-left py-5 px-6 font-bold text-[#3D1E0F] text-sm uppercase tracking-wide">Location</th>
                            <th className="text-right py-5 px-6 font-bold text-[#3D1E0F] text-sm uppercase tracking-wide">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#CCBA78]/20">
                          {restaurants.map((r, index) => (
                            <tr key={r.id} className="hover:bg-[#CCBA78]/10 transition-colors duration-200 group">
                              <td className="py-5 px-6">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#CCBA78] to-[#6B3F23] flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">
                                      {(r.namaRestaurant || r.name || '?').charAt(0).toUpperCase()
                                    }</span>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[#3D1E0F] text-lg">{r.namaRestaurant || r.name}</p>
                                    <p className="text-sm text-[#6B3F23]">ID: {r.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-5 px-6">
                                <div className="flex items-center space-x-2 text-[#6B3F23]">
                                  <MapPin className="w-5 h-5 text-[#CCBA78]" />
                                  <span className="font-medium">{r.lokasi || r.location || 'No location'}</span>
                                </div>
                              </td>
                              <td className="py-5 px-6 text-right">
                                <button
                                  onClick={() => handleDeleteRestaurant(r.id)}
                                  className="inline-flex items-center space-x-2 bg-[#6B3F23]/10 hover:bg-[#CCBA78]/30 text-[#6B3F23] px-4 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 font-medium border border-[#CCBA78]/40 hover:border-[#CCBA78]"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'spots' && (
                <div>
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="p-2 bg-gradient-to-r from-[#CCBA78] to-[#6B3F23] rounded-xl">
                      <MapPin className="w-6 h-6 text-[#3D1E0F]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#3D1E0F]">Manage Spots</h2>
                  </div>
                  {spots.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-[#CCBA78]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MapPin className="w-10 h-10 text-[#CCBA78]" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#3D1E0F] mb-3">No spots found</h3>
                      <p className="text-[#6B3F23] max-w-md mx-auto">Create your first location spot to get started with mapping.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-[#CCBA78]/30">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-[#CCBA78]/30 to-[#6B3F23]/10">
                          <tr>
                            <th className="text-left py-5 px-6 font-bold text-[#3D1E0F] text-sm uppercase tracking-wide">Spot</th>
                            <th className="text-left py-5 px-6 font-bold text-[#3D1E0F] text-sm uppercase tracking-wide">Location</th>
                            <th className="text-left py-5 px-6 font-bold text-[#3D1E0F] text-sm uppercase tracking-wide">Category</th>
                            <th className="text-left py-5 px-6 font-bold text-[#3D1E0F] text-sm uppercase tracking-wide">Rating</th>
                            <th className="text-right py-5 px-6 font-bold text-[#3D1E0F] text-sm uppercase tracking-wide">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#CCBA78]/20">
                          {spots.map((s, index) => (
                            <tr key={s.id} className="hover:bg-[#CCBA78]/10 transition-colors duration-200 group">
                              <td className="py-5 px-6">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#CCBA78] to-[#6B3F23] flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">
                                      {(s.namaTempat || s.name || '?').charAt(0).toUpperCase()
                                    }</span>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[#3D1E0F] text-lg">{s.namaTempat || s.name}</p>
                                    <p className="text-sm text-[#6B3F23]">ID: {s.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-5 px-6">
                                <span className="font-medium text-[#6B3F23]">{s.lokasi || s.location || 'No location'}</span>
                              </td>
                              <td className="py-5 px-6">
                                <span className="font-medium text-[#6B3F23]">{s.kategori || s.category || '-'}</span>
                              </td>
                              <td className="py-5 px-6">
                                <span className="font-medium text-[#6B3F23]">{s.rating !== undefined ? s.rating : '-'}</span>
                              </td>
                              <td className="py-5 px-6 text-right">
                                <button
                                  onClick={() => handleDeleteSpot(s.id)}
                                  className="inline-flex items-center space-x-2 bg-[#6B3F23]/10 hover:bg-[#CCBA78]/30 text-[#6B3F23] px-4 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 font-medium border border-[#CCBA78]/40 hover:border-[#CCBA78]"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'catalogs' && (
                <div>
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="p-2 bg-gradient-to-r from-[#CCBA78] to-[#6B3F23] rounded-xl">
                      <BookOpen className="w-6 h-6 text-[#3D1E0F]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#3D1E0F]">Manage Catalogs</h2>
                  </div>
                  {catalogs.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-[#CCBA78]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10 text-[#CCBA78]" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#3D1E0F] mb-3">No catalogs found</h3>
                      <p className="text-[#6B3F23] max-w-md mx-auto">Organize your content by creating your first catalog collection.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-[#CCBA78]/30">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-[#CCBA78]/30 to-[#6B3F23]/10">
                          <tr>
                            <th className="text-left py-5 px-6 font-bold text-[#3D1E0F] text-sm uppercase tracking-wide">Catalog</th>
                            <th className="text-right py-5 px-6 font-bold text-[#3D1E0F] text-sm uppercase tracking-wide">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#CCBA78]/20">
                          {catalogs.map((c, index) => (
                            <tr key={c.id} className="hover:bg-[#CCBA78]/10 transition-colors duration-200 group">
                              <td className="py-5 px-6">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#CCBA78] to-[#6B3F23] flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">
                                      {(c.namaCatalog || c.name || '?').charAt(0).toUpperCase()
                                    }</span>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[#3D1E0F] text-lg">{c.namaCatalog || c.name}</p>
                                    <p className="text-sm text-[#6B3F23]">ID: {c.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-5 px-6 text-right">
                                <button
                                  onClick={() => handleDeleteCatalog(c.id)}
                                  className="inline-flex items-center space-x-2 bg-[#6B3F23]/10 hover:bg-[#CCBA78]/30 text-[#6B3F23] px-4 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 font-medium border border-[#CCBA78]/40 hover:border-[#CCBA78]"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Form CRUD */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                onClick={closeModal}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-[#3D1E0F]">{modalType === 'add' ? 'Add' : 'Edit'} {modalTab.slice(0, -1).charAt(0).toUpperCase() + modalTab.slice(1, -1)}</h2>
              <form onSubmit={handleModalSubmit} className="space-y-4">
                {modalTab === 'restaurants' && (
                  <>
                    <div>
                      <label className="block text-[#CCBA78] mb-1">Name</label>
                      <input
                        type="text"
                        name="namaRestaurant"
                        className="w-full p-3 rounded-lg bg-[#F5F5F4] border border-[#CCBA78]/30 text-[#3D1E0F]"
                        value={modalData.namaRestaurant || ''}
                        onChange={e => setModalData(prev => ({ ...prev, namaRestaurant: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#CCBA78] mb-1">Location</label>
                      <input
                        type="text"
                        name="lokasi"
                        className="w-full p-3 rounded-lg bg-[#F5F5F4] border border-[#CCBA78]/30 text-[#3D1E0F]"
                        value={modalData.lokasi || ''}
                        onChange={e => setModalData(prev => ({ ...prev, lokasi: e.target.value }))}
                        required
                      />
                    </div>
                  </>
                )}
                {modalTab === 'spots' && (
                  <>
                    <div>
                      <label className="block text-[#CCBA78] mb-1">Name</label>
                      <input
                        type="text"
                        name="namaTempat"
                        className="w-full p-3 rounded-lg bg-[#F5F5F4] border border-[#CCBA78]/30 text-[#3D1E0F]"
                        value={modalData.namaTempat || ''}
                        onChange={e => setModalData(prev => ({ ...prev, namaTempat: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#CCBA78] mb-1">Location</label>
                      <input
                        type="text"
                        name="lokasi"
                        className="w-full p-3 rounded-lg bg-[#F5F5F4] border border-[#CCBA78]/30 text-[#3D1E0F]"
                        value={modalData.lokasi || ''}
                        onChange={e => setModalData(prev => ({ ...prev, lokasi: e.target.value }))}
                        required
                      />
                    </div>
                  </>
                )}
                {modalTab === 'catalogs' && (
                  <div>
                    <label className="block text-[#CCBA78] mb-1">Name</label>
                    <input
                      type="text"
                      name="namaCatalog"
                      className="w-full p-3 rounded-lg bg-[#F5F5F4] border border-[#CCBA78]/30 text-[#3D1E0F]"
                      value={modalData.namaCatalog || ''}
                      onChange={e => setModalData(prev => ({ ...prev, namaCatalog: e.target.value }))}
                      required
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] hover:from-[#D8C78E] hover:to-[#CCBA78] text-[#3D1E0F]"
                >
                  {modalType === 'add' ? 'Add' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel