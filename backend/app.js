const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const eventiRouter = require('./controllers/eventi')
const korisniciRouter = require('./controllers/korisnici')
const loginRouter = require('./controllers/login')
const prijaveRouter = require('./controllers/prijave')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('Spajam se na', config.DB_URI)

mongoose.connect(config.DB_URI)
  .then(result => {
    logger.info("Spojeni smo na bazu");
  }).catch(error => {
    logger.greska("Greška pri spajanju", error.message);
  })

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(middleware.zahtjevInfo)

app.use('/api/eventi', eventiRouter)
app.use('/api/korisnici', korisniciRouter)
app.use('/api/login', loginRouter)
app.use('/api/prijave', prijaveRouter)
app.use(middleware.nepoznataRuta)
app.use(middleware.errorHandler)

module.exports = app