import { useState, useEffect } from 'react'
import { getRestaurantArticles, addRestaurantArticle, editRestaurantArticle } from '../../services/articles_api'
import LoadingSpinner from '../../components/LoadingSpinner'
import ArticleCard from '../../components/ArticleCard'
import { useAuth } from '../../hooks/useAuth'

const RestaurantPage = () => {
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' or 'edit'
  const [modalData, setModalData] = useState({
    judul: '',
    konten: '',
    kategori: '',
    lokasi: '',
    image: null
  })
  const { user } = useAuth()

  // Fetch restaurant articles from API
  useEffect(() => {
    const fetchRestaurantArticles = async () => {
      try {
        setLoading(true)
        const response = await getRestaurantArticles()
        
        // Handle payload structure
        const data = response.payload
        setArticles(data)
        setFilteredArticles(data)

        // Extract unique categories and locations
        const uniqueCategories = [...new Set(data.map(article => article.kategori))]
          .filter(Boolean)
          .map(cat => ({ id: cat, name: cat }))
        
        const uniqueLocations = [...new Set(data.map(article => article.lokasi))]
          .filter(Boolean)

        setCategories(uniqueCategories)
        setLocations(uniqueLocations)
      } catch (err) {
        console.error('Error fetching restaurant articles:', err)
        setError('Failed to load restaurant articles. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRestaurantArticles()
  }, [])

  // Filter articles based on search term and filters
  useEffect(() => {
    let result = articles
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(article => 
        article.judulArtikel?.toLowerCase().includes(term) ||
        article.kontenArtikel?.toLowerCase().includes(term) ||
        article.restaurant?.namaRestaurant?.toLowerCase().includes(term) ||
        article.restaurant?.lokasi?.toLowerCase().includes(term)
      )
    }

    if (categoryFilter) {
      result = result.filter(article => article.kategori === categoryFilter)
    }

    if (locationFilter) {
      result = result.filter(article => article.lokasi === locationFilter)
    }
    
    setFilteredArticles(result)
  }, [searchTerm, categoryFilter, locationFilter, articles])

  // Handler for delete article (admin only)
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    // TODO: Call delete API, then update state
    alert('Delete article with id: ' + id)
  }

  // Handler for edit article (admin only)
  const handleEdit = (id) => {
    const article = articles.find(a => a.id === id)
    setModalMode('edit')
    setModalData({
      id: article?.id,
      judul: article?.judulartikel || '',
      konten: article?.kontenartikel || '',
      kategori: article?.kategori || '',
      lokasi: article?.lokasi || '',
      image: null
    })
    setModalOpen(true)
  }

  // Handler for add article (admin only)
  const handleAdd = () => {
    setModalMode('add')
    setModalData({ judul: '', konten: '', kategori: '', lokasi: '', image: null })
    setModalOpen(true)
  }

  const handleModalChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image') {
      setModalData(prev => ({ ...prev, image: files[0] }))
    } else {
      setModalData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (modalMode === 'add') {
        response = await addRestaurantArticle(modalData, user?.token);
      } else {
        response = await editRestaurantArticle({ ...modalData, id: modalData.id }, user?.token);
      }
      if (response && response.success) {
        // Fetch ulang data artikel agar tampilan terupdate
        const res = await getRestaurantArticles();
        const data = res.payload;
        setArticles(data);
        setFilteredArticles(data);
        // Update kategori & lokasi
        const uniqueCategories = [...new Set(data.map(article => article.kategori))]
          .filter(Boolean)
          .map(cat => ({ id: cat, name: cat }))
        const uniqueLocations = [...new Set(data.map(article => article.lokasi))]
          .filter(Boolean)
        setCategories(uniqueCategories);
        setLocations(uniqueLocations);
        setModalOpen(false);
      } else {
        // Tampilkan pesan error dari backend jika ada
        alert(response?.message || response?.error || 'Failed to save article!');
        setModalOpen(false);
      }
    } catch (err) {
      // Tampilkan pesan error dari backend jika ada (403 forbidden, dsb)
      if (err?.response?.data?.message) {
        alert(err.response.data.message);
      } else if (err?.response?.data?.error) {
        alert(err.response.data.error);
      } else if (err && err.message) {
        alert(err.message);
      } else {
        alert('Failed to save article!');
      }
      setModalOpen(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-[#3D1E0F]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#3D1E0F]">
        <div className="container mx-auto p-6">
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
        <h1 className="text-4xl font-['Special_Elite'] text-[#CCBA78] mb-6 flex items-center justify-between">
          Restaurant Articles
          {user?.isAdmin && (
            <button
              onClick={handleAdd}
              className="ml-4 px-4 py-2 bg-[#2A1509] text-white rounded hover:bg-[#3D1E0F] text-base shadow"
            >
              + Add Article
            </button>
          )}
        </h1>
        
        <div className="bg-[#2A1509]/70 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-[#CCBA78] mb-2">Search</label>
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full p-2 rounded bg-[#2A1509] border border-[#CCBA78] text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[#CCBA78] mb-2">Category</label>
              <select
                className="w-full p-2 rounded bg-[#2A1509] border border-[#CCBA78] text-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#CCBA78] mb-2">Location</label>
              <select
                className="w-full p-2 rounded bg-[#2A1509] border border-[#CCBA78] text-white"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('')
                setLocationFilter('')
              }}
              className="px-4 py-2 bg-[#CCBA78] text-white rounded hover:bg-[#D8C78E]"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="bg-white/10 rounded-lg p-8 text-center">
            <p className="text-white text-xl">No articles found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setLocationFilter('');
              }}
              className="mt-4 bg-[#CCBA78] text-white px-4 py-2 rounded hover:bg-[#D8C78E]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <div key={article.id} className="relative group">
                <ArticleCard
                  article={{
                    ...article,
                    image_url: article.image_url,
                    judulartikel: article.judulartikel,
                    kontenartikel: article.kontenartikel,
                    restaurant_id: article.restaurant_id,
                  }}
                />
                {user?.isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-2 z-20">
                    <button
                      className="px-3 py-1 bg-yellow-400 text-[#3D1E0F] rounded-lg font-bold text-xs hover:bg-yellow-500 shadow"
                      onClick={() => handleEdit(article.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-lg font-bold text-xs hover:bg-red-600 shadow"
                      onClick={() => handleDelete(article.id)}
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

      {/* Modal Add/Edit Article */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#3D1E0F]">{modalMode === 'add' ? 'Add' : 'Edit'} Article</h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-[#CCBA78] mb-1">Title</label>
                <input
                  type="text"
                  name="judul"
                  className="w-full p-3 rounded-lg bg-[#F5F5F4] border border-[#CCBA78]/30 text-[#3D1E0F]"
                  value={modalData.judul}
                  onChange={handleModalChange}
                  required
                />
              </div>
              <div>
                <label className="block text-[#CCBA78] mb-1">Content</label>
                <textarea
                  name="konten"
                  className="w-full p-3 rounded-lg bg-[#F5F5F4] border border-[#CCBA78]/30 text-[#3D1E0F]"
                  rows={4}
                  value={modalData.konten}
                  onChange={handleModalChange}
                  required
                />
              </div>
              <div>
                <label className="block text-[#CCBA78] mb-1">Category</label>
                <select
                  name="kategori"
                  className="w-full p-3 rounded-lg bg-[#F5F5F4] border border-[#CCBA78]/30 text-[#3D1E0F]"
                  value={modalData.kategori}
                  onChange={handleModalChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#CCBA78] mb-1">Location</label>
                <select
                  name="lokasi"
                  className="w-full p-3 rounded-lg bg-[#F5F5F4] border border-[#CCBA78]/30 text-[#3D1E0F]"
                  value={modalData.lokasi}
                  onChange={handleModalChange}
                  required
                >
                  <option value="">Select location</option>
                  {locations.map((loc, idx) => (
                    <option key={idx} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#CCBA78] mb-1">Image (optional)</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full"
                  onChange={handleModalChange}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] hover:from-[#D8C78E] hover:to-[#CCBA78] text-[#3D1E0F]"
              >
                {modalMode === 'add' ? 'Add Article' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RestaurantPage