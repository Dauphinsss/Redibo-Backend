import express from 'express';
import searchController from '../controllers/searchController.js';

const router = express.Router();

//POST: Guardar
router.post('/save', searchController.saveSearch);

//GET: Obtener
router.get('/id/:userId', searchController.getUserSearches);

//DELETE: Eliminar
router.delete('/delete/:id', searchController.deleteSearchById);

// Ver todas las búsquedas
router.get('/all', searchController.getAllSearches);

export default router;