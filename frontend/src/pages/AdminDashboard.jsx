import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : window.location.origin + '/_/backend/api';

const AdminDashboard = () => {
    const [movies, setMovies] = useState([]);
    const [stats, setStats] = useState({
        totalRevenue: 45231,
        ticketsSold: 1245,
        activeMovies: 12,
        newUsers: 342
    });
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        genre: '',
        rating: '',
        status: 'Showing'
    });

    // Fetch initial data
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Try fetching from real backend
            const [moviesRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE}/movies`).catch(() => null),
                axios.get(`${API_BASE}/movies/admin/stats`).catch(() => null)
            ]);

            if (moviesRes && moviesRes.data && moviesRes.data.length > 0) {
                setMovies(moviesRes.data);
            } else {
                // Fallback to localStorage or mock data if server isn't live
                const local = localStorage.getItem('tickety_movies');
                if (local) {
                    setMovies(JSON.parse(local));
                } else {
                    const mock = [
                        { _id: '1', title: "Cyberpunk 2077", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop", genre: "Action, Sci-Fi", rating: "4.8", status: "Showing" },
                        { _id: '2', title: "The Dark Web", image: "https://images.unsplash.com/photo-1611416517780-eff3a13b0359?q=80&w=1949&auto=format&fit=crop", genre: "Thriller, Action", rating: "8.5", status: "Showing" },
                        { _id: '3', title: "Interstellar Journey", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop", genre: "Sci-Fi, Adventure", rating: "9.1", status: "Showing" },
                        { _id: '4', title: "Neon City", image: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=1974&auto=format&fit=crop", genre: "Action, Cyberpunk", rating: "7.8", status: "Showing" },
                        { _id: '5', title: "Cosmic Wars", image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1974&auto=format&fit=crop", genre: "Sci-Fi, Action", rating: "8.2", status: "Upcoming" },
                        { _id: '6', title: "Virtual Reality", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1994&auto=format&fit=crop", genre: "Sci-Fi, Thriller", rating: "8.7", status: "Showing" },
                        { _id: '7', title: "Matrix Awakening", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop", genre: "Sci-Fi, Cyberpunk", rating: "8.9", status: "Showing" },
                        { _id: '8', title: "Blade Runner 2099", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1974&auto=format&fit=crop", genre: "Action, Sci-Fi", rating: "9.3", status: "Showing" },
                        { _id: '9', title: "Silent Horizon", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1947&auto=format&fit=crop", genre: "Horror, Mystery", rating: "7.5", status: "Showing" },
                        { _id: '10', title: "Galactic Comedy", image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=2069&auto=format&fit=crop", genre: "Comedy, Adventure", rating: "8.1", status: "Showing" },
                        { _id: '11', title: "Chrono Paradox", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", genre: "Sci-Fi, Thriller", rating: "8.6", status: "Upcoming" },
                        { _id: '12', title: "Cyber Samurai", image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop", genre: "Action, Fantasy", rating: "8.8", status: "Showing" }
                    ];
                    setMovies(mock);
                }
            }

            if (statsRes && statsRes.data) {
                setStats(statsRes.data);
            }
        } catch (error) {
            console.error("Error loading dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ title: '', image: '', genre: '', rating: '', status: 'Showing' });
        setModalOpen(true);
    };

    const openEditModal = (movie) => {
        setEditingId(movie._id || movie.title);
        setFormData({
            title: movie.title,
            image: movie.image,
            genre: movie.genre,
            rating: movie.rating || '8.0',
            status: movie.status || 'Showing'
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId && typeof editingId === 'string' && editingId.length > 5) {
                // Real DB update
                await axios.put(`${API_BASE}/movies/${editingId}`, formData).catch(() => null);
            } else if (!editingId) {
                // Real DB create
                await axios.post(`${API_BASE}/movies`, formData).catch(() => null);
            }

            // Update local state smoothly
            let updatedMovies;
            if (editingId) {
                updatedMovies = movies.map(m => (m._id === editingId || m.title === editingId) ? { ...m, ...formData } : m);
            } else {
                updatedMovies = [{ _id: Date.now().toString(), ...formData }, ...movies];
            }
            setMovies(updatedMovies);
            localStorage.setItem('tickety_movies', JSON.stringify(updatedMovies));
            
            // Recalculate active stats
            const activeCount = updatedMovies.filter(m => m.status === 'Showing').length;
            setStats(prev => ({ ...prev, activeMovies: activeCount }));

            setModalOpen(false);
            alert(editingId ? "Movie updated successfully!" : "New movie added successfully!");
        } catch (error) {
            console.error("Save failed", error);
            alert("Action completed locally.");
            setModalOpen(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this movie?")) {
            try {
                if (typeof id === 'string' && id.length > 5) {
                    await axios.delete(`${API_BASE}/movies/${id}`).catch(() => null);
                }
                const updatedMovies = movies.filter(m => m._id !== id && m.title !== id);
                setMovies(updatedMovies);
                localStorage.setItem('tickety_movies', JSON.stringify(updatedMovies));
                
                const activeCount = updatedMovies.filter(m => m.status === 'Showing').length;
                setStats(prev => ({ ...prev, activeMovies: activeCount }));
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
            <div className="admin-layout">
                <aside className="admin-sidebar">
                    <div className="admin-profile">
                        <img src="https://ui-avatars.com/api/?name=Banti+Gond&background=f9004d&color=fff" alt="Banti Gond" style={{ width: '50px', borderRadius: '50%' }} />
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1rem', color: 'white' }}>Banti Kr Gond</h4>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--neon-pink)' }}>prasadbanti2004@gmail.com</p>
                        </div>
                    </div>
                    <nav className="admin-nav">
                        <a href="#dashboard" className="active"><i className="ri-dashboard-line"></i> Dashboard</a>
                        <a href="#movies"><i className="ri-film-line"></i> Manage Movies</a>
                        <a href="#bookings"><i className="ri-ticket-2-line"></i> Bookings</a>
                        <a href="#users"><i className="ri-user-settings-line"></i> Users</a>
                        <a href="/"><i className="ri-arrow-left-line"></i> Main Website</a>
                    </nav>
                </aside>
                
                <main className="admin-main">
                    <div className="admin-header-bar">
                        <h2 style={{ color: 'white' }}>Dashboard Overview</h2>
                        <button className="btn-primary" onClick={openAddModal} style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                            <i className="ri-add-line"></i> Add New Movie
                        </button>
                    </div>
                    
                    <div className="admin-preview" style={{ marginTop: '2rem' }}>
                        <div className="stat-card">
                            <div className="stat-icon pink-glow"><i className="ri-money-dollar-circle-line"></i></div>
                            <div className="stat-info">
                                <h4>Total Revenue</h4>
                                <h2 style={{ color: 'white' }}>${stats.totalRevenue.toLocaleString()}</h2>
                                <span className="trend positive"><i className="ri-arrow-up-line"></i> 12.5%</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon blue-glow"><i className="ri-ticket-line"></i></div>
                            <div className="stat-info">
                                <h4>Tickets Sold</h4>
                                <h2 style={{ color: 'white' }}>{stats.ticketsSold.toLocaleString()}</h2>
                                <span className="trend positive"><i className="ri-arrow-up-line"></i> 8.2%</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon purple-glow"><i className="ri-film-line"></i></div>
                            <div className="stat-info">
                                <h4>Active Movies</h4>
                                <h2 style={{ color: 'white' }}>{stats.activeMovies}</h2>
                                <span className="trend neutral"><i className="ri-subtract-line"></i> Live</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon orange-glow"><i className="ri-user-star-line"></i></div>
                            <div className="stat-info">
                                <h4>New Users</h4>
                                <h2 style={{ color: 'white' }}>{stats.newUsers}</h2>
                                <span className="trend positive"><i className="ri-arrow-up-line"></i> 24.1%</span>
                            </div>
                        </div>
                    </div>

                    <div className="admin-table-container">
                        <h3 style={{ color: 'white' }}>Current Catalog</h3>
                        {loading ? (
                            <p style={{ color: 'var(--text-secondary)' }}>Loading catalog data...</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Movie</th>
                                        <th>Genre</th>
                                        <th>Rating</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movies.map((m) => (
                                        <tr key={m._id || m.title}>
                                            <td>
                                                <div className="table-movie">
                                                    <img src={m.image} alt={m.title} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop'; }} />
                                                    <span style={{ color: 'white', fontWeight: 500 }}>{m.title}</span>
                                                </div>
                                            </td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{m.genre}</td>
                                            <td><i className="ri-star-fill text-yellow"></i> {m.rating || '8.0'}</td>
                                            <td>
                                                <span className={`status ${m.status === 'Showing' ? 'active' : 'inactive'}`}>
                                                    {m.status || 'Showing'}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="action-btn edit" onClick={() => openEditModal(m)}>
                                                    <i className="ri-edit-line"></i>
                                                </button>
                                                <button className="action-btn delete" onClick={() => handleDelete(m._id || m.title)}>
                                                    <i className="ri-delete-bin-line"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </main>
            </div>

            {/* Custom Modal */}
            {modalOpen && (
                <div className="modal-overlay active" style={{ display: 'flex' }} onClick={() => setModalOpen(false)}>
                    <div className="modal-content glass-card" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setModalOpen(false)}>
                            <i className="ri-close-line"></i>
                        </button>
                        <div className="modal-header">
                            <h2 style={{ color: 'white' }}>{editingId ? "Edit Movie" : "Add New Movie"}</h2>
                            <p>Fill in the details to update the theater catalog</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Movie Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Cyberpunk 2077" required />
                            </div>
                            <div className="input-group">
                                <label>Poster Image URL</label>
                                <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." required />
                            </div>
                            <div className="input-group">
                                <label>Genre</label>
                                <input type="text" name="genre" value={formData.genre} onChange={handleInputChange} placeholder="e.g. Action, Sci-Fi" required />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label>Rating</label>
                                    <input type="text" name="rating" value={formData.rating} onChange={handleInputChange} placeholder="e.g. 8.5" required />
                                </div>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange} className="custom-select" style={{ padding: '0.8rem 1rem', borderRadius: '8px', width: '100%' }}>
                                        <option value="Showing">Showing</option>
                                        <option value="Upcoming">Upcoming</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn-primary w-100" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                                {editingId ? "Save Changes" : "List Movie"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
