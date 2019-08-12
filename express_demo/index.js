// utility of mongodb
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to the Mongodb...'))
    .catch(err => console.error('Can not connect to the Mongodb...'))