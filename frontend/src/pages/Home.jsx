import React, { useState, useEffect } from 'react';
import axios from 'axios';

const INITIAL_MOVIES = [
    {
        _id: "1",
        title: "Cyberpunk 2077",
        image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
        genre: "Action, Sci-Fi",
        rating: "4.8",
        status: "Showing"
    },
    {
        _id: "2",
        title: "The Dark Web",
        image: "https://images.unsplash.com/photo-1611416517780-eff3a13b0359?q=80&w=1949&auto=format&fit=crop",
        genre: "Thriller, Action",
        rating: "8.5",
        status: "Showing"
    },
    {
        _id: "3",
        title: "Interstellar Journey",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
        genre: "Sci-Fi, Adventure",
        rating: "9.1",
        status: "Showing"
    },
    {
        _id: "4",
        title: "Neon City",
        image: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=1974&auto=format&fit=crop",
        genre: "Action, Cyberpunk",
        rating: "7.8",
        status: "Showing"
    },
    {
        _id: "5",
        title: "Cosmic Wars",
        image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1974&auto=format&fit=crop",
        genre: "Sci-Fi, Action",
        rating: "8.2",
        status: "Upcoming"
    },
    {
        _id: "6",
        title: "Virtual Reality",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1994&auto=format&fit=crop",
        genre: "Sci-Fi, Thriller",
        rating: "8.7",
        status: "Showing"
    },
    {
        _id: "7",
        title: "Matrix Awakening",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
        genre: "Sci-Fi, Cyberpunk",
        rating: "8.9",
        status: "Showing"
    },
    {
        _id: "8",
        title: "Blade Runner 2099",
        image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1974&auto=format&fit=crop",
        genre: "Action, Sci-Fi",
        rating: "9.3",
        status: "Showing"
    },
    {
        _id: "9",
        title: "Silent Horizon",
        image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1947&auto=format&fit=crop",
        genre: "Horror, Mystery",
        rating: "7.5",
        status: "Showing"
    },
    {
        _id: "10",
        title: "Galactic Comedy",
        image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=2069&auto=format&fit=crop",
        genre: "Comedy, Adventure",
        rating: "8.1",
        status: "Showing"
    },
    {
        _id: "11",
        title: "Chrono Paradox",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
        genre: "Sci-Fi, Thriller",
        rating: "8.6",
        status: "Upcoming"
    },
    {
        _id: "12",
        title: "Cyber Samurai",
        image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop",
        genre: "Action, Fantasy",
        rating: "8.8",
        status: "Showing"
    }
];

const TICKET_PRICE = 15;
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const SEATS_PER_ROW = 12;

// Determine API Base dynamically
const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : window.location.origin + '/_/backend/api';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMovie, setSelectedMovie] = useState('CYBERPUNK 2077');
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [soldSeats, setSoldSeats] = useState(new Set());
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('prasadbanti2004@gmail.com');
    const [password, setPassword] = useState('superadmin123');

    // Handle Navbar Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch movies
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get(`${API_BASE}/movies`);
                if (res.data && res.data.length > 0) {
                    setMovies(res.data);
                } else {
                    loadFromLocalStorage();
                }
            } catch (err) {
                console.warn("Could not fetch movies from API, using fallback data", err);
                loadFromLocalStorage();
            }
        };
        fetchMovies();
    }, []);

    const loadFromLocalStorage = () => {
        const local = localStorage.getItem('tickety_movies');
        if (local) {
            setMovies(JSON.parse(local));
        } else {
            setMovies(INITIAL_MOVIES);
            localStorage.setItem('tickety_movies', JSON.stringify(INITIAL_MOVIES));
        }
    };

    // Filter and Search Movies
    useEffect(() => {
        let result = movies;

        if (selectedGenre !== 'All') {
            result = result.filter(m => m.genre.toLowerCase().includes(selectedGenre.toLowerCase()));
        }

        if (searchQuery.trim() !== '') {
            result = result.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        setFilteredMovies(result);
    }, [movies, selectedGenre, searchQuery]);

    // Generate random sold seats for selected movie
    useEffect(() => {
        const sold = new Set();
        ROWS.forEach(row => {
            for (let col = 1; col <= SEATS_PER_ROW; col++) {
                if (Math.random() < 0.3) {
                    sold.add(`${row}-${col}`);
                }
            }
        });
        setSoldSeats(sold);
        setSelectedSeats([]); // reset selected seats
    }, [selectedMovie]);

    const handleSeatClick = (seatId) => {
        if (soldSeats.has(seatId)) return;
        
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(s => s !== seatId);
            } else {
                return [...prev, seatId];
            }
        });
    };

    const handleBookNow = (movieTitle) => {
        setSelectedMovie(movieTitle.toUpperCase());
        const bookingSection = document.getElementById('booking-section');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCheckout = () => {
        alert(`Booking Confirmed!\nMovie: ${selectedMovie}\nSeats: ${selectedSeats.join(', ')}\nTotal Paid: $${(selectedSeats.length * TICKET_PRICE).toFixed(2)}`);
        // Mark selected seats as sold
        setSoldSeats(prev => {
            const newSold = new Set(prev);
            selectedSeats.forEach(s => newSold.add(s));
            return newSold;
        });
        setSelectedSeats([]);
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setIsSignInOpen(false);
        setIsLoggedIn(true);

        if (email.includes('prasadbanti2004@gmail.com')) {
            if (window.confirm(`Super Admin Authenticated: prasadbanti2004@gmail.com\nWelcome back, BANTI KR GOND!\n\nWould you like to launch the Premium Admin Dashboard portal now?`)) {
                window.location.href = '/admin';
            }
        } else {
            alert(`Welcome back! Logged in successfully as ${email}`);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-dark)', minHeight: '100vh', color: 'white' }}>
            {/* Navbar */}
            <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
                    TICKETY<span>.</span>
                </div>
                <nav className="nav-links">
                    <a href="#" className="active" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
                    <a href="#movies" onClick={(e) => { e.preventDefault(); document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' }); }}>Movies</a>
                    <a href="#theaters" onClick={(e) => { e.preventDefault(); document.getElementById('theaters')?.scrollIntoView({ behavior: 'smooth' }); }}>Theaters</a>
                </nav>
                <div className="nav-actions">
                    <div className="search-box">
                        <i className="ri-search-line"></i>
                        <input 
                            type="text" 
                            placeholder="Search movies..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {isLoggedIn ? (
                        <button 
                            className="btn-login" 
                            style={{ color: 'var(--neon-pink)', borderColor: 'var(--neon-pink)' }}
                            onClick={() => {
                                if (window.confirm("Go to Admin Dashboard?")) {
                                    window.location.href = '/admin';
                                }
                            }}
                        >
                            <i className="ri-user-star-fill" style={{ color: 'var(--neon-pink)' }}></i> Banti Kr Gond
                        </button>
                    ) : (
                        <button className="btn-login" onClick={() => setIsSignInOpen(true)}>
                            <i className="ri-user-line"></i> Sign In
                        </button>
                    )}
                </div>
            </header>

            {/* User View container */}
            <div id="user-view">
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-bg">
                        <img src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" alt="Hero Movie" />
                        <div className="hero-overlay"></div>
                        <div className="hero-gradient-bottom"></div>
                    </div>
                    
                    <div className="hero-content">
                        <div className="badge">Trending Now</div>
                        <h1 className="hero-title">CYBER<span className="text-gradient">PUNK</span><br />2077</h1>
                        <div className="movie-meta">
                            <span className="meta-item"><i className="ri-star-fill text-yellow"></i> 4.8</span>
                            <span className="meta-item">Action, Sci-Fi</span>
                            <span className="meta-item">2h 45m</span>
                            <span className="rating">R</span>
                        </div>
                        <p className="hero-desc">Experience the ultimate futuristic thrill ride. In a world controlled by mega-corporations, one rogue hacker seeks to dismantle the system from within.</p>
                        <div className="hero-buttons">
                            <button className="btn-primary" onClick={() => handleBookNow("CYBERPUNK 2077")}>
                                <i className="ri-ticket-2-line"></i> Book Tickets
                            </button>
                            <button className="btn-secondary">
                                <i className="ri-play-circle-line"></i> Watch Trailer
                            </button>
                        </div>
                    </div>
                </section>

                {/* Movies Slider Section */}
                <section className="section" id="movies">
                    <div className="section-header">
                        <h2>Now Showing</h2>
                        <div className="filters">
                            {['All', 'Action', 'Sci-Fi', 'Horror', 'Comedy'].map(genre => (
                                <button 
                                    key={genre}
                                    className={`filter-btn ${selectedGenre === genre ? 'active' : ''}`}
                                    onClick={() => setSelectedGenre(genre)}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="movie-grid">
                        {filteredMovies.length === 0 ? (
                            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem 0', fontSize: '1.1rem' }}>
                                No cinematic journeys found.
                            </p>
                        ) : (
                            filteredMovies.map(movie => (
                                <div className="movie-card" key={movie._id || movie.title}>
                                    <div className="poster-wrapper">
                                        <img src={movie.image} alt={movie.title} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop'; }} />
                                        <div className="poster-overlay">
                                            <button className="btn-glass btn-book" onClick={() => handleBookNow(movie.title)}>Book Now</button>
                                        </div>
                                        <div className="imdb-rating"><i className="ri-star-fill"></i> {movie.rating}</div>
                                    </div>
                                    <div className="movie-info">
                                        <h3>{movie.title}</h3>
                                        <p>{movie.genre}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Premium Theaters Section */}
                <section className="section" id="theaters">
                    <div className="section-header">
                        <h2>Partner Theaters & Experiences</h2>
                        <p className="text-muted" style={{ maxWidth: '600px', marginTop: '0.5rem' }}>Experience cutting-edge cinematic sound and state-of-the-art projection in our curated partner multiplexes.</p>
                    </div>

                    <div className="theater-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                        {/* Theater Card 1 */}
                        <div className="theater-card glass-card" style={{ borderRadius: '16px', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }}>
                            <div style={{ position: 'relative', height: '200px' }}>
                                <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop" alt="Starlight IMAX" style={{ width: '100%', height: '100%', object-fit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', padding: '0.3rem 0.8rem', borderRadius: '20px', border: '1px solid var(--neon-blue)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--neon-blue)' }}>IMAX WITH LASER</div>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.3rem', color: 'white' }}>Starlight IMAX Cinema</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}><i class="ri-map-pin-line" style={{ color: 'var(--neon-pink)' }}></i> Downtown Core, Avenue 4</p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Dolby Atmos</span>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>4K Laser</span>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Recliners</span>
                                </div>
                                <button className="btn-secondary w-100" onClick={() => handleBookNow(selectedMovie)} style={{ justifyContent: 'center', fontSize: '0.9rem', padding: '0.6rem' }}>Explore Showtimes</button>
                            </div>
                        </div>

                        {/* Theater Card 2 */}
                        <div className="theater-card glass-card" style={{ borderRadius: '16px', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }}>
                            <div style={{ position: 'relative', height: '200px' }}>
                                <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop" alt="Neon Multiplex" style={{ width: '100%', height: '100%', object-fit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', padding: '0.3rem 0.8rem', borderRadius: '20px', border: '1px solid var(--neon-pink)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--neon-pink)' }}>4DX IMMERSIVE</div>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.3rem', color: 'white' }}>Neon Multiplex & Lounge</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}><i class="ri-map-pin-line" style={{ color: 'var(--neon-pink)' }}></i> Cyber District, Sector 7</p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Motion Seats</span>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>D-Box</span>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>VIP Dine-in</span>
                                </div>
                                <button className="btn-secondary w-100" onClick={() => handleBookNow(selectedMovie)} style={{ justifyContent: 'center', fontSize: '0.9rem', padding: '0.6rem' }}>Explore Showtimes</button>
                            </div>
                        </div>

                        {/* Theater Card 3 */}
                        <div className="theater-card glass-card" style={{ borderRadius: '16px', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }}>
                            <div style={{ position: 'relative', height: '200px' }}>
                                <img src="https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=2079&auto=format&fit=crop" alt="Aurora Luxe" style={{ width: '100%', height: '100%', object-fit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', padding: '0.3rem 0.8rem', borderRadius: '20px', border: '1px solid var(--neon-purple)', fontSize: '0.8rem', fontWeight: 700, color: '#d946ef' }}>VIP PREMIUM</div>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.3rem', color: 'white' }}>Aurora Luxe Cinema</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}><i class="ri-map-pin-line" style={{ color: 'var(--neon-pink)' }}></i> Heights Boulevard, Galleria</p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Plush Recliners</span>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Private Bar</span>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>THX Certified</span>
                                </div>
                                <button className="btn-secondary w-100" onClick={() => handleBookNow(selectedMovie)} style={{ justifyContent: 'center', fontSize: '0.9rem', padding: '0.6rem' }}>Explore Showtimes</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Seat Booking Section */}
                <section className="section booking-section" id="booking-section">
                    <div className="booking-container">
                        <div className="booking-details">
                            <h2>Seat Selection</h2>
                            <h3 className="selected-movie-title">{selectedMovie}</h3>
                            
                            <div className="datetime-selectors">
                                <div className="selector-group">
                                    <label>Date</label>
                                    <select className="custom-select">
                                        <option>Today, 14 Oct</option>
                                        <option>Tomorrow, 15 Oct</option>
                                        <option>Fri, 16 Oct</option>
                                    </select>
                                </div>
                                <div className="selector-group">
                                    <label>Time & Format</label>
                                    <select className="custom-select">
                                        <option>18:30 (IMAX 3D)</option>
                                        <option>21:00 (Standard)</option>
                                        <option>23:30 (Dolby Atmos)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="legend">
                                <div className="legend-item"><div className="seat-legend available"></div> Available</div>
                                <div className="legend-item"><div class="seat-legend selected"></div> Selected</div>
                                <div className="legend-item"><div className="seat-legend sold"></div> Sold</div>
                            </div>

                            <div className="price-summary">
                                <div className="flex-between">
                                    <span>Selected Seats:</span>
                                    <span className="highlight-text">{selectedSeats.length}</span>
                                </div>
                                <div className="flex-between">
                                    <span>Price per Seat:</span>
                                    <span>${TICKET_PRICE.toFixed(2)}</span>
                                </div>
                                <div className="divider"></div>
                                <div className="flex-between total">
                                    <span>Total Price:</span>
                                    <span className="highlight-text">${(selectedSeats.length * TICKET_PRICE).toFixed(2)}</span>
                                </div>
                                <button 
                                    className="btn-primary w-100" 
                                    onClick={handleCheckout} 
                                    disabled={selectedSeats.length === 0}
                                    style={{ opacity: selectedSeats.length > 0 ? 1 : 0.5 }}
                                >
                                    <i className="ri-secure-payment-line"></i> Proceed to Payment
                                </button>
                            </div>
                        </div>

                        <div className="seat-map-wrapper">
                            <div className="screen-container">
                                <div className="screen-glow"></div>
                                <div className="screen-curve"></div>
                                <span className="screen-text">SCREEN</span>
                            </div>
                            
                            <div className="seat-map" style={{ transform: 'rotateX(20deg)' }}>
                                {ROWS.map(rowLabel => (
                                    <div className="seat-row" key={rowLabel}>
                                        <div className="row-label">{rowLabel}</div>
                                        {Array.from({ length: SEATS_PER_ROW }, (_, i) => i + 1).map(col => {
                                            const seatId = `${rowLabel}-${col}`;
                                            const isSold = soldSeats.has(seatId);
                                            const isSelected = selectedSeats.includes(seatId);
                                            
                                            let seatClass = "seat available";
                                            if (isSold) seatClass = "seat sold";
                                            else if (isSelected) seatClass = "seat selected";

                                            return (
                                                <div 
                                                    key={col}
                                                    className={seatClass}
                                                    onClick={() => handleSeatClick(seatId)}
                                                    style={{ 
                                                        marginRight: (col === 3 || col === 9) ? '30px' : '0' 
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer>
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="logo">TICKETY<span>.</span></div>
                        <p>The premium movie ticket booking experience. Futuristic, fast, and seamless. Next-generation cinematic journeys start here.</p>
                        <div className="socials">
                            <a href="#"><i className="ri-instagram-line"></i></a>
                            <a href="#"><i className="ri-twitter-x-line"></i></a>
                            <a href="#"><i className="ri-facebook-circle-fill"></i></a>
                            <a href="#"><i className="ri-youtube-fill"></i></a>
                        </div>
                    </div>
                    
                    <div className="footer-links">
                        <h4>Explore</h4>
                        <a href="#movies" onClick={(e) => { e.preventDefault(); document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' }); }}>Movies</a>
                        <a href="#theaters" onClick={(e) => { e.preventDefault(); document.getElementById('theaters')?.scrollIntoView({ behavior: 'smooth' }); }}>Theaters</a>
                        <a href="#booking-section" onClick={(e) => { e.preventDefault(); document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Events</a>
                        <a href="#">Offers</a>
                    </div>
                    
                    <div className="footer-links">
                        <h4>Support</h4>
                        <a href="#">Help Center</a>
                        <a href="#">Terms & Conditions</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Contact Us</a>
                    </div>
                    
                    <div className="footer-newsletter">
                        <h4>Subscribe to Newsletter</h4>
                        <p>Get the latest movie updates and exclusive offers directly in your inbox.</p>
                        <div className="newsletter-input-group">
                            <input type="email" placeholder="Enter your email" />
                            <button><i className="ri-send-plane-fill"></i></button>
                        </div>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>&copy; 2026 TICKETY. All rights reserved.</p>
                    <p>Designed with precision.</p>
                </div>
            </footer>

            {/* Sign In Modal */}
            {isSignInOpen && (
                <div className="modal-overlay active" style={{ display: 'flex' }} onClick={() => setIsSignInOpen(false)}>
                    <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setIsSignInOpen(false)}>
                            <i className="ri-close-line"></i>
                        </button>
                        <div className="modal-header">
                            <h2>Welcome Back</h2>
                            <p>Sign in to continue your cinematic journey</p>
                        </div>
                        <form className="signin-form" onSubmit={handleLoginSubmit}>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="Enter your email" 
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Enter your password" 
                                    required 
                                />
                            </div>
                            <div className="flex-between" style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" /> Remember me
                                </label>
                                <a href="#" className="text-gradient" style={{ textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                            </div>
                            <button type="submit" className="btn-primary w-100" style={{ justifyContent: 'center' }}>Sign In</button>
                        </form>
                        <div className="modal-footer">
                            <p>Don't have an account? <a href="#" className="text-gradient" style={{ textDecoration: 'none', fontWeight: 600 }} onClick={(e) => e.preventDefault()}>Sign Up</a></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
