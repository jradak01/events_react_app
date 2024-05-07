const jwt= require('jsonwebtoken')
const bcrypt= require('bcrypt')
const loginRouter= require('express').Router()
const Korisnik = require('../models/korisnik')

loginRouter.post('/', async (req, res) => {
    const podaci = req.body
    const korisnik = await Korisnik.findOne({ username: podaci.username })
    const passOk = korisnik === null
        ? false
        : await bcrypt.compare(podaci.pass, korisnik.passHash)
    if (!(korisnik && passOk)) {
        return res.status(401).json({
            error: "ne postoji korisnik ili pogrešna lozinka"
        })
    }
    const userToken = {
        username: korisnik.username,
        email: korisnik.email,
        uloga: korisnik.uloga,
        id: korisnik._id
    }
    const token = jwt.sign(userToken, process.env.SECRET)
    return res.status(200).send({
        token, username: korisnik.username, uloga: korisnik.uloga, email: korisnik.email, ime: korisnik.ime
    })
})
module.exports = loginRouter