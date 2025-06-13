const express =require('express');
const comentarServicio = require('./comments.service');

const buscarComentario= express.Router();
buscarComentario.get('/:id',async(req,res) => {
const carId = parseInt(req.params.id);
  console.log('Id recibido',carId);
  try {
    const car = await comentarServicio.findById(carId);
    if (!car) {
      console.log('carro no encontrado')
      return res.status(404).json({ message: "Auto no disponible" });
    }
    res.json(car);
    console.log(car);
    }catch(error){
        console.error("Error en el controlador:", error);
        console.log('Autos no encontrados')
        res.status(500).json({error : 'Autos no encontrados'})
    }
})

module.exports = buscarComentario;