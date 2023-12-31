const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();


const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');


const app = express();

mongoose.connect('mongodb+srv://'+process.env.USER_NAME+':'+process.env.PASSWORD+process.env.DBHOST,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;