// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Custom Cursor (Only on Desktop)
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (window.innerWidth > 768 && cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effects for cursor
    const interactives = document.querySelectorAll('a, button, .movie-card, .theater-card, input, select, .seat:not(.sold)');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(249, 0, 77, 0.1)';
            cursorOutline.style.borderColor = 'var(--neon-pink)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'rgba(255,255,255,0.5)';
        });
    });
}

// Seat Map Generation and Logic
const seatMap = document.getElementById('seat-map');
const seatCountEl = document.getElementById('seat-count');
const totalPriceEl = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const TICKET_PRICE = 15;

let selectedSeatsCount = 0;

function initSeats() {
    if (!seatMap) return;
    
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const seatsPerRow = 12;
    
    rows.forEach(rowLabel => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        
        // Row Label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'row-label';
        labelDiv.innerText = rowLabel;
        rowDiv.appendChild(labelDiv);
        
        for (let i = 1; i <= seatsPerRow; i++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            
            // Randomly assign some seats as sold
            if (Math.random() < 0.3) {
                seat.classList.add('sold');
            } else {
                seat.classList.add('available');
                
                // Add click listener
                seat.addEventListener('click', () => {
                    if (seat.classList.contains('selected')) {
                        seat.classList.remove('selected');
                        seat.classList.add('available');
                        selectedSeatsCount--;
                    } else {
                        seat.classList.remove('available');
                        seat.classList.add('selected');
                        selectedSeatsCount++;
                    }
                    updateBookingSummary();
                });
            }
            
            rowDiv.appendChild(seat);
        }
        
        seatMap.appendChild(rowDiv);
    });
}

function updateBookingSummary() {
    seatCountEl.innerText = selectedSeatsCount;
    totalPriceEl.innerText = `$${(selectedSeatsCount * TICKET_PRICE).toFixed(2)}`;
    
    if (selectedSeatsCount > 0) {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
    } else {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initSeats();
});

// Smooth scroll and View Toggle for anchor links
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // Remove active class from all links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        // Add active class to clicked link
        this.classList.add('active');

        const userView = document.getElementById('user-view');
        const adminView = document.getElementById('admin-view');

        if (targetId === '#admin') {
            if(userView) userView.style.display = 'none';
            if(adminView) adminView.style.display = 'block';
            window.scrollTo({top: 0, behavior: 'smooth'});
            return;
        } else {
            if(adminView) adminView.style.display = 'none';
            if(userView) userView.style.display = 'block';
            
            if (targetId === '#') {
                window.scrollTo({top: 0, behavior: 'smooth'});
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Admin Sidebar Links Mock Behavior
document.querySelectorAll('.admin-nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.admin-nav a').forEach(link => link.classList.remove('active'));
        this.classList.add('active');
    });
});

// Sign In Modal Logic
const signinBtn = document.querySelector('.btn-login');
const signinModal = document.getElementById('signin-modal');
const closeModal = document.getElementById('close-modal');

if (signinBtn && signinModal && closeModal) {
    signinBtn.addEventListener('click', () => {
        signinModal.classList.add('active');
    });

    closeModal.addEventListener('click', () => {
        signinModal.classList.remove('active');
    });

    signinModal.addEventListener('click', (e) => {
        if (e.target === signinModal) {
            signinModal.classList.remove('active');
        }
    });

    // Handle Mock Login
    const signinForm = document.querySelector('.signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('signin-email');
            const userEmail = emailInput ? emailInput.value : 'prasadbanti2004@gmail.com';
            
            // Close modal
            signinModal.classList.remove('active');
            
            // Update navbar UI to show logged in state
            signinBtn.innerHTML = '<i class="ri-user-star-fill" style="color: var(--neon-pink);"></i> Banti Kr Gond';
            signinBtn.style.color = 'var(--neon-pink)';
            signinBtn.style.borderColor = 'var(--neon-pink)';
            
            // Show custom welcome
            if (userEmail.includes('prasadbanti2004@gmail.com')) {
                if (confirm(`Super Admin Authenticated: prasadbanti2004@gmail.com\nWelcome back, BANTI KR GOND!\n\nWould you like to launch the Premium Admin Dashboard portal now?`)) {
                    window.location.href = 'admin.html';
                }
            } else {
                alert(`Welcome back! Logged in successfully as ${userEmail}`);
            }
        });
    }
}

// Hidden Admin Route Logic
function handleHashRoute() {
    const hash = window.location.hash;
    const userView = document.getElementById('user-view');
    const adminView = document.getElementById('admin-view');
    
    if (hash === '#admin') {
        if (userView) userView.style.display = 'none';
        if (adminView) adminView.style.display = 'block';
        window.scrollTo(0, 0);
        renderAdminDashboard();
    } else {
        if (adminView) adminView.style.display = 'none';
        if (userView) userView.style.display = 'block';
    }
}

window.addEventListener('load', () => {
    handleHashRoute();
    initAdminSystem();
});
window.addEventListener('hashchange', handleHashRoute);

// --- Admin Portal Dynamic CRUD Logic ---
const INITIAL_MOVIES = [
    {
        title: "Cyberpunk 2077",
        image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
        genre: "Action, Sci-Fi",
        rating: "4.8",
        status: "Showing"
    },
    {
        title: "The Dark Web",
        image: "https://images.unsplash.com/photo-1611416517780-eff3a13b0359?q=80&w=1949&auto=format&fit=crop",
        genre: "Thriller, Action",
        rating: "8.5",
        status: "Showing"
    },
    {
        title: "Interstellar Journey",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
        genre: "Sci-Fi, Adventure",
        rating: "9.1",
        status: "Showing"
    },
    {
        title: "Neon City",
        image: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=1974&auto=format&fit=crop",
        genre: "Action, Cyberpunk",
        rating: "7.8",
        status: "Showing"
    },
    {
        title: "Cosmic Wars",
        image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1974&auto=format&fit=crop",
        genre: "Sci-Fi, Action",
        rating: "8.2",
        status: "Upcoming"
    },
    {
        title: "Virtual Reality",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1994&auto=format&fit=crop",
        genre: "Sci-Fi, Thriller",
        rating: "8.7",
        status: "Showing"
    },
    {
        title: "Matrix Awakening",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
        genre: "Sci-Fi, Cyberpunk",
        rating: "8.9",
        status: "Showing"
    },
    {
        title: "Blade Runner 2099",
        image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1974&auto=format&fit=crop",
        genre: "Action, Sci-Fi",
        rating: "9.3",
        status: "Showing"
    },
    {
        title: "Silent Horizon",
        image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1947&auto=format&fit=crop",
        genre: "Horror, Mystery",
        rating: "7.5",
        status: "Showing"
    },
    {
        title: "Galactic Comedy",
        image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=2069&auto=format&fit=crop",
        genre: "Comedy, Adventure",
        rating: "8.1",
        status: "Showing"
    },
    {
        title: "Chrono Paradox",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
        genre: "Sci-Fi, Thriller",
        rating: "8.6",
        status: "Upcoming"
    },
    {
        title: "Cyber Samurai",
        image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop",
        genre: "Action, Fantasy",
        rating: "8.8",
        status: "Showing"
    }
];

function getMovies() {
    const stored = localStorage.getItem('tickety_movies');
    if (!stored) {
        localStorage.setItem('tickety_movies', JSON.stringify(INITIAL_MOVIES));
        return INITIAL_MOVIES;
    }
    const parsed = JSON.parse(stored);
    // Guarantee fresh additions automatically propagate if older snapshot cached
    if (parsed.length < INITIAL_MOVIES.length) {
        localStorage.setItem('tickety_movies', JSON.stringify(INITIAL_MOVIES));
        return INITIAL_MOVIES;
    }
    return parsed;
}

function saveMovies(movies) {
    localStorage.setItem('tickety_movies', JSON.stringify(movies));
}

function initAdminSystem() {
    // Back button in admin
    const backBtn = document.getElementById('back-to-site');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '';
        });
    }

    // Modal elements
    const addMovieBtn = document.getElementById('add-movie-btn');
    const movieModal = document.getElementById('movie-modal');
    const closeMovieModal = document.getElementById('close-movie-modal');
    const movieForm = document.getElementById('movie-form');

    if (addMovieBtn && movieModal && closeMovieModal) {
        addMovieBtn.addEventListener('click', () => {
            document.getElementById('movie-modal-title').innerText = "Add New Movie";
            movieForm.reset();
            document.getElementById('edit-movie-index').value = '';
            movieModal.classList.add('active');
        });

        closeMovieModal.addEventListener('click', () => {
            movieModal.classList.remove('active');
        });

        movieModal.addEventListener('click', (e) => {
            if (e.target === movieModal) {
                movieModal.classList.remove('active');
            }
        });

        movieForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const index = document.getElementById('edit-movie-index').value;
            const title = document.getElementById('movie-title').value;
            const image = document.getElementById('movie-image').value;
            const genre = document.getElementById('movie-genre').value;
            const rating = document.getElementById('movie-rating').value;
            const status = document.getElementById('movie-status').value;

            const movies = getMovies();
            if (index === '') {
                // Add
                movies.unshift({ title, image, genre, rating, status });
                alert("Movie successfully added to the catalog!");
            } else {
                // Edit
                movies[index] = { title, image, genre, rating, status };
                alert("Movie details successfully updated!");
            }
            saveMovies(movies);
            movieModal.classList.remove('active');
            renderAdminDashboard();
            renderCustomerGrid();
        });
    }

    // Initial render
    renderCustomerGrid();

    // Hook up dynamic category filters
    const filterButtons = document.querySelectorAll('.filters .filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCustomerGrid(btn.innerText.trim());
        });
    });
}

function renderAdminDashboard() {
    const tbody = document.getElementById('admin-movie-list');
    if (!tbody) return;

    const movies = getMovies();
    tbody.innerHTML = '';

    let activeCount = 0;
    movies.forEach((m, idx) => {
        if (m.status === 'Showing') activeCount++;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="table-movie">
                    <img src="${m.image}" alt="${m.title}" onerror="this.src='https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop'">
                    <span>${m.title}</span>
                </div>
            </td>
            <td>${m.genre}</td>
            <td><i class="ri-star-fill text-yellow"></i> ${m.rating}</td>
            <td><span class="status ${m.status === 'Showing' ? 'active' : 'inactive'}">${m.status}</span></td>
            <td>
                <button class="action-btn edit" onclick="editMovie(${idx})"><i class="ri-edit-line"></i></button>
                <button class="action-btn delete" onclick="deleteMovie(${idx})"><i class="ri-delete-bin-line"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Update stats dynamically
    const statCards = document.querySelectorAll('.admin-preview .stat-card h2');
    if (statCards.length >= 3) {
        statCards[2].innerText = activeCount;
    }
}

window.editMovie = function(idx) {
    const movies = getMovies();
    const m = movies[idx];
    if (!m) return;

    document.getElementById('movie-modal-title').innerText = "Edit Movie";
    document.getElementById('edit-movie-index').value = idx;
    document.getElementById('movie-title').value = m.title;
    document.getElementById('movie-image').value = m.image;
    document.getElementById('movie-genre').value = m.genre;
    document.getElementById('movie-rating').value = m.rating;
    document.getElementById('movie-status').value = m.status;

    document.getElementById('movie-modal').classList.add('active');
};

window.deleteMovie = function(idx) {
    if (confirm("Are you sure you want to delete this movie from the catalog?")) {
        const movies = getMovies();
        movies.splice(idx, 1);
        saveMovies(movies);
        renderAdminDashboard();
        renderCustomerGrid();
    }
};

function renderCustomerGrid(filterGenre = 'All') {
    const grid = document.getElementById('dynamic-movie-grid');
    if (!grid) return;

    const movies = getMovies();
    grid.innerHTML = '';

    const filteredMovies = filterGenre === 'All' 
        ? movies 
        : movies.filter(m => m.genre.toLowerCase().includes(filterGenre.toLowerCase()));

    if (filteredMovies.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem 0; font-size: 1.1rem;">No cinematic journeys found under the <span style="color: var(--neon-pink);">${filterGenre}</span> category.</p>`;
        return;
    }

    filteredMovies.forEach(m => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="poster-wrapper">
                <img src="${m.image}" alt="${m.title}" onerror="this.src='https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop'">
                <div class="poster-overlay">
                    <button class="btn-glass btn-book" onclick="document.getElementById('booking-section').scrollIntoView({behavior: 'smooth'}); document.querySelector('.selected-movie-title').innerText = '${m.title.replace(/'/g, "\\'").toUpperCase()}';">Book Now</button>
                </div>
                <div class="imdb-rating"><i class="ri-star-fill"></i> ${m.rating}</div>
            </div>
            <div class="movie-info">
                <h3>${m.title}</h3>
                <p>${m.genre}</p>
            </div>
        `;
        grid.appendChild(card);
    });

    // Reattach cursor interactive listener for newly created elements
    const cursorOutline = document.getElementById('cursor-outline');
    if (window.innerWidth > 768 && cursorOutline) {
        const newInteractives = grid.querySelectorAll('.movie-card, button');
        newInteractives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(249, 0, 77, 0.1)';
                cursorOutline.style.borderColor = 'var(--neon-pink)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorOutline.style.borderColor = 'rgba(255,255,255,0.5)';
            });
        });
    }
}
