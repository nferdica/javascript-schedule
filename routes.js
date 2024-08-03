const express = require('express')
const route = express.Router();
const homeController = require('./src/controllers/homecontroller')
const loginController = require('./src/controllers/loginController')

// Rotas da home.
route.get('/', homeController.index);

// Rota de login.
route.get('/login/index', loginController.index)
route.post('/login/register', loginController.register)
route.post('/login/login', loginController.login)
route.get('/login/logout', loginController.logout)


module.exports = route