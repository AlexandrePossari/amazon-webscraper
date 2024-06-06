const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const apiRoutes = require('../src/routes/api');
const pagesRoutes = require('../src/routes/pages');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', apiRoutes);
app.use('/', pagesRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data })
});

app.listen(8080)