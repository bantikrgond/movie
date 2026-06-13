import Movie from '../models/Movie.js';

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
export const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({}).sort({ createdAt: -1 });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ message: "Movie not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a movie
// @route   POST /api/movies
// @access  Private/Admin
export const createMovie = async (req, res) => {
    try {
        const { title, image, genre, duration, rating, description, imdbRating, status } = req.body;

        const movie = new Movie({
            title: title || "Sample Movie",
            image: image || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
            genre: genre || "Action",
            duration: duration || "2h 15m",
            rating: rating || "PG-13",
            description: description || "Cinematic journey experience.",
            imdbRating: imdbRating || 8.0,
            status: status || "Showing"
        });

        const createdMovie = await movie.save();
        res.status(201).json(createdMovie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
export const updateMovie = async (req, res) => {
    try {
        const { title, image, genre, duration, rating, description, imdbRating, status } = req.body;

        const movie = await Movie.findById(req.params.id);

        if (movie) {
            movie.title = title || movie.title;
            movie.image = image || movie.image;
            movie.genre = genre || movie.genre;
            movie.duration = duration || movie.duration;
            movie.rating = rating || movie.rating;
            movie.description = description || movie.description;
            movie.imdbRating = imdbRating || movie.imdbRating;
            movie.status = status || movie.status;

            const updatedMovie = await movie.save();
            res.json(updatedMovie);
        } else {
            res.status(404).json({ message: "Movie not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
export const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (movie) {
            await movie.deleteOne();
            res.json({ message: "Movie removed successfully" });
        } else {
            res.status(404).json({ message: "Movie not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/movies/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
    try {
        const totalMovies = await Movie.countDocuments({});
        const activeMovies = await Movie.countDocuments({ status: 'Showing' });
        
        res.json({
            totalRevenue: 45231,
            ticketsSold: 1245,
            activeMovies: activeMovies || totalMovies,
            newUsers: 342
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
