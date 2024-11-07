const express = require ('express');
const app = express()

const cars_routes = require ('./routes/cars_routes')

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Running')
});

app.use('/api/v1/cars', cars_routes)

module.exports = app;