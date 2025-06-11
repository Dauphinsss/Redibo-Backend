const express = require('express');
const userRenterService = require('./user.service');

const userRenter = express.Router();

userRenter.get('/:id', async (req, res) => {
    const renterId = parseInt(req.params.id);
    try {
        const userRenterJson = await userRenterService.findAll(renterId);
        res.json(userRenterJson);
    } catch (error) {
        res.status(500).json({ error: 'Renter no encontrado' });
    }
})

module.exports = userRenter;