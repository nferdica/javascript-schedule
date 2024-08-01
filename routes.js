const express = require('express')
const route = express.Router();
const homeController = require('./src/controllers/homecontroller')
const loginController = require('./src/controllers/loginController')

// Rotas da home.
route.get('/', homeController.index);

// Rota de login.
route.get('/login/index', loginController.index)

module.exports = route