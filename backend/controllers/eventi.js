const eventiRouter = require('express').Router()
const Event = require('../models/event')
const Korisnik = require('../models/korisnik')
const jwt = require('jsonwebtoken')

const dohvatiToken = (req) => {
    const auth = req.get('Authorization')
    if (auth && auth.toLowerCase().startsWith('bearer')) {
        return auth.substring(7)
    }
    return null
}

eventiRouter.get('/', async (req, res) => {
    const eventi = await Event.find({})
    .populate('korisnik', { username: 1, ime: 1, email: 1 })
    .populate('prijavljeniKorisnici.prKorisnik', { username: 1, ime: 1, email: 1 })
    res.json(eventi)
})

eventiRouter.get('/:id', async (req, res) => {
    const event = await Event.findById(req.params.id)
    .populate('korisnik', { username: 1, ime: 1, email: 1 })
    .populate('prijavljeniKorisnici.prKorisnik', { username: 1, ime: 1, email: 1 })
    res.json(event)
})

eventiRouter.post('/', async (req, res) => {
    const podatak = req.body
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "Neispravni token" }).end()
    }
    const vlasnikEventa = await Korisnik.findById(dekToken.id)
    const noviEvent = new Event({
        naziv: podatak.naziv,
        tip: podatak.tip,
        mjesto: podatak.mjesto,
        adresa: podatak.adresa,
        vrijeme: podatak.vrijeme,
        otvoreno: podatak.otvoreno,
        placanje: podatak.placanje,
        cijena: podatak.cijena,
        opis: podatak.opis,
        korisnik: vlasnikEventa._id
    })

    const spremljeniEvent = await noviEvent.save()
    vlasnikEventa.eventi = vlasnikEventa.eventi.concat(spremljeniEvent._id)
    await vlasnikEventa.save()
    res.json(spremljeniEvent)
})

eventiRouter.put('/:id', async (req, res) => {
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "Neispravni token" })
    }
    
    const podatak = req.body
    const id = req.params.id
    let eventZaMijenjanje = await Event.findById(req.params.id)
    let vlasnikEventa = eventZaMijenjanje.korisnik._id.toString()
    
    const event = {
        naziv: podatak.naziv,
        tip: podatak.tip,
        mjesto: podatak.mjesto,
        adresa: podatak.adresa,
        vrijeme: podatak.vrijeme,
        otvoreno: podatak.otvoreno,
        placanje: podatak.placanje,
        cijena: podatak.cijena,
        opis: podatak.opis
    }

    if (vlasnikEventa === dekToken.id) {
        const noviEvent = await Event.findByIdAndUpdate(id, event, { new: true })
        return res.json(noviEvent) 
    }else{
        return res.status(401).json({ error: "Neispravni token" }).end()
    }
})
eventiRouter.put('/:id/:prid', async (req, res) => {
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "Neispravni token" })
    }
    
    const id = req.params.id
    const idKorisnikEvent = req.params.prid
    const ocjena = req.body.ocjena

    const event = await Event.findById(id)
    const prijave = event.prijavljeniKorisnici
    const odredeni = prijave.find(el => el._id.toString() === idKorisnikEvent)
    const idKorisnika = odredeni.prKorisnik

    if (idKorisnika.toString() === dekToken.id) {
        const dodaj = await Event.findOneAndUpdate({
            id: id,
            'prijavljeniKorisnici._id': idKorisnikEvent
        },
            { $set: { 'prijavljeniKorisnici.$.ocjena': ocjena } }, { safe: true, new: true })
        dodaj.save()
        res.json(dodaj)
    } else {
        return res.status(401).json({ error: "Neispravni token" }).end()
    }

})
eventiRouter.delete('/:id', async (req, res) => {
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "Neispravni token" })
    }
    
    let eventZaBrisanje = await Event.findById(req.params.id)
    let vlasnikEventa = eventZaBrisanje.korisnik._id.toString()

    if (vlasnikEventa === dekToken.id || dekToken.uloga === 'admin' || dekToken.uloga ==='masteradmin') {
        await Korisnik.findByIdAndUpdate(vlasnikEventa, 
        {$pull: {eventi : req.params.id}})
        await Event.findByIdAndRemove(req.params.id)
        return res.status(204).end()
    } else {
        return res.status(401).json({ error: "Neispravni token" }).end()
    }
})
eventiRouter.delete('/visestruko/:id', async (req, res) => {
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "Neispravni token" })
    }
    let vlasnikEventa = req.params.id
    if (vlasnikEventa === dekToken.id || dekToken.uloga === 'admin' || dekToken.uloga ==='masteradmin') {
        await Event.deleteMany({ 'korisnik': vlasnikEventa })
        return res.status(204).end()
    } else {
        return res.status(401).json({ error: "Neispravni token" }).end()
    }
})

module.exports = eventiRouter