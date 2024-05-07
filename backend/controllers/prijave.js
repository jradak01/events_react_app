const prijaveRouter = require('express').Router()
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

//dohvat svih eventa gdje je korisnik prijavljen
prijaveRouter.get('/', async (req, res) => {
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "Neispravni token" })
    }
    const eventi = await Event.find({ 'prijavljeniKorisnici.prKorisnik': dekToken.id })
        .populate('korisnik', { username: 1, ime: 1, email: 1 })
        .populate('prijavljeniKorisnici.prKorisnik', { username: 1, ime: 1, email: 1 })
    res.json(eventi)

})
//dohvat svih prijava na jedan event
prijaveRouter.get('/:id', async (req, res) => {
    const event = await Event.findById(req.params.id).populate('prijavljeniKorisnici.prKorisnik', { username: 1, ime: 1, email: 1 })
    const prijave = event.prijavljeniKorisnici
    res.json(prijave)
})

//dohvat jedne prijave korisnika u odredenom eventu
prijaveRouter.get('/:id/:prid', async (req, res) => {
    const event = await Event.findById(req.params.id)
    const prijave = event.prijavljeniKorisnici
    const odredeni = prijave.find(el => el._id.toString() === req.params.prid)
    res.json(odredeni)

})
//prijava na event
prijaveRouter.put('/:id', async (req, res) => {
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "Neispravni token" })
    }
    const id = req.params.id
    const event = {
        $push: {
            prijavljeniKorisnici:
                [
                    {
                        prKorisnik: dekToken.id.toString(),
                        dopusteno: false
                    }
                ]
        }
    }
    const noviEvent = await Event.findByIdAndUpdate(id, event, { new: true })
    res.json(noviEvent)
})
//davanje dopustenja prijavi od strane vlasnika eventa
prijaveRouter.put('/:id/:prid', async (req, res) => {
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "Neispravni token" })
    }

    const podatak = req.body
    const id = req.params.id
    const idKorisnikEvent = req.params.prid
    let kojiEvent = await Event.findById(id)
    let vlasnikEventa = kojiEvent.korisnik._id.toString()
    if (vlasnikEventa === dekToken.id) {
        const promjena = await Event.updateOne({
            id: id,
            'prijavljeniKorisnici._id': idKorisnikEvent
        },
            { $set: { 'prijavljeniKorisnici.$.dopusteno': podatak.dopustenje } }, { new: true })
        res.json(promjena)
    } else {
        return res.status(401).json({ error: "Neispravni token" }).end()
    }
})
//odjavljivanje prijave na event
prijaveRouter.put('/delete/:id/:prid', async (req, res) => {
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "Neispravni token" })
    }
    const id = req.params.id
    const idKorisnikEvent = req.params.prid
    const event = await Event.findById(id)
    const prijave = event.prijavljeniKorisnici
    const odredeni = prijave.find(el => el._id.toString() === req.params.prid)
    const idKorisnika = odredeni.prKorisnik

    if (dekToken.id === idKorisnika.toString()) {
        const promjena = await Event.findOneAndUpdate({
            id: id,
            'prijavljeniKorisnici._id': idKorisnikEvent
        },
            { $pull: { 'prijavljeniKorisnici': { _id: idKorisnikEvent.toString() } } }, { safe: true, new: true })
        promjena.save()
        res.json(promjena)
    } else {
        return res.status(401).json({ error: "Neispravni token" }).end()
    }

})
//brisanje svih prijava koje je jedan korisnik postavio
prijaveRouter.delete('/:id', async (req, res) => {
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id) {
        return res.status(401).json({ error: "Neispravni token" })
    }
    const idKorisnika = req.params.id
    if (idKorisnika === dekToken.id || dekToken.uloga === 'admin' || dekToken.uloga ==='masteradmin') {
        const eventi = await Event.find({ 'prijavljeniKorisnici.prKorisnik': idKorisnika })
        let promjene=[]
        for (let ev = 0; ev < eventi.length; ev++) {
            const promjena = await Event.findOneAndUpdate({
                id: eventi[ev]._id,
                'prijavljeniKorisnici.prKorisnik': idKorisnika.toString()
            },
                { $pull: { 'prijavljeniKorisnici': { 'prKorisnik': idKorisnika.toString() } } }, { safe: true, new: true })
            promjena.save()
            promjene.push(promjena)
        }
        res.json(promjene)
    } else {
        return res.status(401).json({ error: "Neispravni token" }).end()
    }
})
module.exports = prijaveRouter