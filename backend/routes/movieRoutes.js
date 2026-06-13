import express from 'express';
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie, getAdminStats } from '../controllers/movieController.js';

const router = express.Router();

// Admin stats route must precede /:id to avoid matching 'admin' as an ID
router.route('/admin/stats').get(getAdminStats);

router.route('/')
    .get(getMovies)
    .post(createMovie);

router.route('/:id')
    .get(getMovieById)
    .put(updateMovie)
    .delete(deleteMovie);

export default router;
