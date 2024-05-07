const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const korisniciRouter= require('express').Router()
const Korisnik = require('../models/korisnik')

const dohvatiToken = (req) => {
    const auth = req.get('Authorization')
    if (auth && auth.toLowerCase().startsWith('bearer')){
        return auth.substring(7)
    }
    return null
}

korisniciRouter.get('/', async (req, res) => {
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "Neispravni token" })
    }
    if (dekToken.uloga === 'admin' || dekToken.uloga ==='masteradmin') {
        const korisnici = await Korisnik
            .find({})
            .populate('eventi', {
                naziv: 1, tip: 1, mjesto: 1,
                adresa: 1, vrijeme: 1, otvoreno: 1, placanje: 1, opis: 1
            })
        res.json(korisnici)
    } else {
        return res.status(401).json({ error: "Neispravni token" })
    }
})
// korisniciRouter.get('/:id', async (req, res) => {
//     const korisnik = await Korisnik.findById(req.params.id)
//     res.json(korisnik)
// })
korisniciRouter.get('/:username', async (req, res) => {
    const korisnik = await Korisnik.findOne({username: req.params.username})
    .populate('eventi', {
        naziv: 1, tip: 1, mjesto: 1,
        adresa: 1, vrijeme: 1, otvoreno: 1, placanje: 1, opis: 1
    })
    res.json(korisnik)
})
korisniciRouter.post('/', async (req, res) => {
    const sadrzaj = req.body
    const kor = Korisnik.find({username: sadrzaj.username})
    if(kor.length>0){
        return res.status(401).json({
            error: "korisnicko ime vec postoji!"
        })
    }
    const runde = 10
    const passHash = await bcrypt.hash(sadrzaj.pass, runde)

    const uloga = sadrzaj.uloga === undefined ? 'korisnik' : sadrzaj.uloga
    const korisnik = new Korisnik ({
        username: sadrzaj.username,
        ime: sadrzaj.ime,
        uloga: uloga,
        passHash,
        email: sadrzaj.email
    })

    const sprKorisnik = await korisnik.save()
    res.json(sprKorisnik)
})
korisniciRouter.put('/:id', async (req, res) => {
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "Neispravni token" })
    }
    const sadrzaj = req.body
    const id = req.params.id
    const runde = 10
    const kor = await Korisnik.findById(id)
    const passOk = kor === null
    ? false
    : await bcrypt.compare(sadrzaj.staraLozinka, kor.passHash)
    
    if (!(kor && passOk)) {
        return res.status(401).json({
        error: "ne postoji korisnik ili pogrešna lozinka"
    })}
    const passHash = await bcrypt.hash(sadrzaj.pass, runde)
    
    const korisnik ={
        username: sadrzaj.username,
        ime: sadrzaj.ime,
        uloga: sadrzaj.uloga,
        email: sadrzaj.email,
        passHash
    }
    const korisnikUloga={
        uloga: sadrzaj.uloga
    }

    if (dekToken.id===kor.id){
        const promjena = await Korisnik.findByIdAndUpdate(id, korisnik, { new: true })
        res.json(promjena)
    }
    else {
        return res.status(401).json({ error: "Neispravni token" })
    }
})
korisniciRouter.put('/uloga/:id', async (req, res) => {
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "Neispravni token" })
    }
    const id = req.params.id
    const sadrzaj = req.body
    const kor = await Korisnik.findById(id)
    if (!(kor)) {
        return res.status(401).json({
            error: "ne postoji korisnik"
        })
    }
    const korisnik = {
        uloga: sadrzaj.uloga,
    }
    if (dekToken.uloga === 'masteradmin') {
        const promjena = await Korisnik.findByIdAndUpdate(id, korisnik, { new: true })
        res.json(promjena)
    } else {
        return res.status(401).json({ error: "Neautoriziran pokušaj izmjene" })
    }
})
korisniciRouter.delete('/:id', async (req, res) => {
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "Neispravni token" })
    }
    if (dekToken.uloga === 'admin' || dekToken.id === req.params.id || dekToken.uloga ==='masteradmin') {
        const idKorisnika = req.params.id
        await Korisnik.findByIdAndRemove(idKorisnika)
        return res.status(204).end()
    }else {
        return res.status(401).json({ error: "Neispravni token" })
    }
})
module.exports = korisniciRouter