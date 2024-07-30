require('dotenv').config(); // Referente ao arquivo .env, onde armazenamos dados que não ficam visiveis no repositorio.

const express = require("express"); // Importando express.
const app = express(); // Carregando express.

const mongoose = require('mongoose') // Importando mongoose.
mongoose.connect(process.env.CONNECTIONSTRING) // Conectando na base de dados.
    .then(() => {
        app.emit('online') // Quando conectado ele vai emitir um evento, 
        console.log('BANCO DE DADOS: Online')
    })
    .catch(e => console.log(e))

const session = require('express-session') // Armazenamento de cookies.
const MongoStore = require('connect-mongo'); // As sessões seram salvas dentro da base de dados.
const flash = require('connect-flash') // Flash messages, mensagens auto-destrutivas, serve para mandar mensagens de erro por exemplo.

const routes = require('./routes') // Rotas da aplicação.
const path = require('path') // Caminhos absolutos.
const helmet = require('helmet') // Recomendação para maior segurança da aplicacão.
const csrf = require('csurf') // Tokens criados para formulários, segurança contra aplicativos externos.
const {middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middlewares') // Importando middlewares, funções executadas nas rotas.

app.use(helmet());
app.use(express.urlencoded({extended: true})); // Serve para postarmso formulários dentro da aplicação!
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public'))); // Setando caminho dos arquivos estáticos, imagens, estilos...

const sessionOptions = session({
    secret: 'qwer qwer qwer',
    store: MongoStore.create({mongoUrl: process.env.CONNECTIONSTRING}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
})
app.use(sessionOptions);
app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views')) // Setando caminho da pasta views.
app.set('view engine', 'ejs') // Setando engine...

// Middlewares próprios.
app.use(csrf())
app.use(middlewareGlobal)
app.use(checkCsrfError)
app.use(csrfMiddleware)
app.use(routes)

app.on('online', () => { // Captura do evento emitido pela conexão do banco de dados.
    app.listen(3000, () => {
        console.log('ACESSAR: http://localhost:3000');
        console.log('PORT: 3000')
    });
})
