import { useState, useEffect } from 'react'
import { getCatalogs, addCatalog, editCatalog, deleteCatalog } from '../../services/catalogs_api'
import { useAuth } from '../../hooks/useAuth'
import CatalogCard from '../../components/CatalogCard'
import LoadingSpinner from '../../components/LoadingSpinner'

const CatalogPage = () => {
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [modalData, setModalData] = useState({
    name: '',
    description: '',
    kategori_nama: '',
  });

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        setLoading(true)
        const response = await getCatalogs()
        
        // Handle payload structure
        const data = response.payload || response.data || []
        setCatalogs(data)
      } catch (err) {
        console.error('Error fetching catalogs:', err)
        setError('Failed to load catalogs. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCatalogs()
  }, [])
  
  // Get unique categories from catalogs
  const categories = [...new Set(catalogs.map(catalog => catalog.kategori_nama))]
  
  // Filtered catalogs based on search and category
  const filteredCatalogs = catalogs.filter(catalog => {
    // Check search term
    const matchesSearch = !searchTerm || 
      catalog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      catalog.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Check category filter
    const matchesCategory = categoryFilter === 'all' || catalog.kategori_nama === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  const handleAdd = () => {
    setModalMode('add');
    setModalData({ name: '', description: '', kategori_nama: '' });
    setModalOpen(true);
  };

  const handleEdit = (catalog) => {
    setModalMode('edit');
    setModalData({
      id: catalog.id,
      name: catalog.name || '',
      description: catalog.description || '',
      kategori_nama: catalog.kategori_nama || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this catalog?')) return;
    try {
      await deleteCatalog(id, user.token);
      const response = await getCatalogs();
      const data = response.payload || response.data || [];
      setCatalogs(data);
    } catch (err) {
      alert('Failed to delete catalog!');
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await addCatalog(modalData, user.token);
      } else {
        await editCatalog(modalData, user.token);
      }
      const response = await getCatalogs();
      const data = response.payload || response.data || [];
      setCatalogs(data);
      setModalOpen(false);
    } catch (err) {
      alert('Failed to save catalog!');
      setModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#3D1E0F]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#3D1E0F] text-white p-6">
        <div className="container mx-auto">
          <div className="bg-red-600/20 border border-red-600 text-white p-4 rounded-md">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-white text-red-600 px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen w-full bg-[#3D1E0F] pt-20">
      <div className="container mx-auto p-6">
        <h1 className="font-['Special_Elite'] text-4xl text-[#CCBA78] mb-6 flex items-center justify-between">
          Food & Drink Catalog
          {user?.isAdmin && (
            <button
              onClick={handleAdd}
              className="ml-4 px-4 py-2 bg-[#2A1509] text-white rounded hover:bg-[#3D1E0F] text-base shadow"
            >
              + Add Catalog
            </button>
          )}
        </h1>
        
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                onClick={() => setModalOpen(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-[#3D1E0F]">
                {modalMode === 'add' ? 'Add Catalog' : 'Edit Catalog'}
              </h2>
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#CCBA78] mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full p-3 rounded-lg bg-[#F5F5F4] border border-[#CCBA78]/30 text-[#3D1E0F]"
                    value={modalData.name}
                    onChange={handleModalChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#CCBA78] mb-1">Description</label>
                  <textarea
                    name="description"
                    className="w-full p-3 rounded-lg bg-[#F5F5F4] border border-[#CCBA78]/30 text-[#3D1E0F]"
                    rows={3}
                    value={modalData.description}
                    onChange={handleModalChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#CCBA78] mb-1">Category</label>
                  <input
                    type="text"
                    name="kategori_nama"
                    className="w-full p-3 rounded-lg bg-[#F5F5F4] border border-[#CCBA78]/30 text-[#3D1E0F]"
                    value={modalData.kategori_nama}
                    onChange={handleModalChange}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] hover:from-[#D8C78E] hover:to-[#CCBA78] text-[#3D1E0F]"
                  >
                    {modalMode === 'add' ? 'Add Catalog' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-3 rounded-xl font-semibold transition-all duration-300 bg-gray-200 hover:bg-gray-300 text-[#3D1E0F]"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search food & drinks..."
                className="w-full p-2 rounded bg-[#2A1509] border border-[#CCBA78] text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <select
                className="p-2 rounded bg-[#2A1509] border border-[#CCBA78] text-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {filteredCatalogs.length === 0 ? (
            <div className="bg-white/10 rounded-lg p-8 text-center">
              <p className="text-xl">No items found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                }}
                className="mt-4 bg-[#CCBA78] text-white px-4 py-2 rounded hover:bg-[#D8C78E]"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCatalogs.map(catalog => (
                <div key={catalog.id} className="relative group">
                  <CatalogCard catalog={catalog} />
                  {user?.isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-2 z-20">
                      <button
                        className="px-3 py-1 bg-yellow-400 text-[#3D1E0F] rounded-lg font-bold text-xs hover:bg-yellow-500 shadow"
                        onClick={() => handleEdit(catalog)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded-lg font-bold text-xs hover:bg-red-600 shadow"
                        onClick={() => handleDelete(catalog.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CatalogPage