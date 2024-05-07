const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const event = require('../models/event')
const Korisnik = require('../models/korisnik')
const pomocni = require('./test_pomocni')
const api = supertest(app)

beforeEach(async () => {
    await event.deleteMany({})
    let noviEvent = new event(pomocni.eventiPocetne[0])
    await noviEvent.save()
    noviEvent = new event(pomocni.eventiPocetne[1])
    await noviEvent.save()
    noviEvent = new event(pomocni.eventiPocetne[2])
    await noviEvent.save()
    noviEvent = new event(pomocni.eventiPocetne[3])
    await noviEvent.save()

    await Korisnik.deleteMany({})
    const passHash = await bcrypt.hash('tajna', 10)
    const korisnik = new Korisnik({ime: 'pocetniTestini', username: 'testni', email: "testni@email.com", uloga: "admin", passHash})
    const korisnik2 = new Korisnik({ime: 'pocetniTestini2', username: 'testni2', email: "testni2@email.com", uloga: "korisnik", passHash})
    await korisnik.save()
    await korisnik2.save()
})

test('Eventi se vraćaju u JSON formatu', async () => {
    await api
    .get('/api/eventi')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
test('Dohvacanje svih eventa', async () => {
    const odgovor = await api
                    .get('/api/eventi')
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
    expect(odgovor.body).toHaveLength(4)
})
test('Dohvacanje jednog eventa', async () => {
    const eventiPocetak = await pomocni.eventiBaze()
    const eventZaDohvacanje = eventiPocetak[1]

    const odgovor = await api
                    .get(`/api/eventi/${eventZaDohvacanje.id}`)
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
    expect( odgovor.body.tip).toContain('Kino na otvorenom')
})
test('uspjesno dodavanje eventa', async () => {
    let token = null
    const podaciLogin = {
        username: "testni2",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(podaciLogin)
    .expect('Content-Type', /application\/json/)
    .expect((res) => token = res._body.token)

    const noviEvent = {
        naziv: "test party",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        vrijeme: new Date("2022-07-05T22:00:00+00:00"),
        otvoreno: true,
        placanje: true,
        cijena:  190,
        opis: "neki opis",
    }

    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
    const eventiNaKraju = await pomocni.eventiBaze()
    expect(eventiNaKraju).toHaveLength(pomocni.eventiPocetne.length + 1)
    const cijena = eventiNaKraju.map(ev => ev.cijena) 
    expect(cijena).toContain(190)
})
test('uspjesno mijenjanje eventa', async () => {
    let token = null
    const podaciLogin = {
        username: "testni2",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(podaciLogin)
    .expect('Content-Type', /application\/json/)
    .expect((res) => token = res._body.token)
    
    let idNovi= null
    const noviEvent = {
        naziv: "test party",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        vrijeme: new Date("2022-07-05T22:00:00+00:00"),
        otvoreno: true,
        placanje: false,
        cijena:  0,
        opis: "neki opis",
    }
    
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    .expect(res => idNovi = res.body.id)

    const izmjenaEventa = {
        placanje: true,
        cijena: 160
    }

    await api
    .put(`/api/eventi/${idNovi}`)
    .set({ Authorization: `bearer ${token}` })
    .send(izmjenaEventa)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
    const eventiNaKraju = await pomocni.eventiBaze()
    const cijena = eventiNaKraju.map(ev => ev.cijena)
    expect(cijena).toContain(160)
})
test('neovlasteno mijenjanje eventa', async () => {
    let token = null
    const podaciLogin = {
        username: "testni",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(podaciLogin)
    .expect('Content-Type', /application\/json/)
    .expect((res) => token = res._body.token)

    let neovlasteniToken = null
    const podaciLoginNeovlasteni = {
        username: "testni2",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(podaciLoginNeovlasteni)
    .expect('Content-Type', /application\/json/)
    .expect((res) => neovlasteniToken = res._body.token)

    let idNovi = null
    const noviEvent = {
        naziv: "test party",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        vrijeme: new Date("2022-07-05T22:00:00+00:00"),
        otvoreno: true,
        placanje: false,
        cijena:  0,
        opis: "neki opis",
    }

    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    .expect((res) => idNovi = res._body.id)

    const izmjenaEventa = {
        placanje: true,
        cijena: 160
    }
    
    await api
    .put(`/api/eventi/${idNovi}`)
    .set({ Authorization: `bearer ${neovlasteniToken}` })
    .send(izmjenaEventa)
    .expect(401)

    const eventiNaKraju = await pomocni.eventiBaze()
    const cijena = eventiNaKraju.map(ev => ev.cijena)
    expect(cijena).not.toContain(160)
})
test('uspješno dodavanje ocjene na event', async () => {
    let token = null
    const podaciLogin = {
        username: "testni",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(podaciLogin)
    .expect('Content-Type', /application\/json/)
    .expect((res) => token = res._body.token)
    let token2 = null
    const podaciLogin2 = {
        username: "testni2",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(podaciLogin2)
    .expect('Content-Type', /application\/json/)
    .expect((res) => token2 = res._body.token)
    
    let idNovi= null
    const noviEvent = {
        naziv: "test party",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        vrijeme: new Date("2022-07-05T22:00:00+00:00"),
        otvoreno: true,
        placanje: false,
        cijena:  0,
        opis: "neki opis",
    }
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    .expect(res => idNovi = res.body.id)

    let prid = null
    await api
    .put(`/api/prijave/${idNovi}`)
    .set({ Authorization: `bearer ${token2}` })
    .expect((res) => prid = res._body.prijavljeniKorisnici[0]._id)

    const ocjeni = {
        ocjena: 4
    }
    const odgovor = await api
    .put(`/api/eventi/${idNovi}/${prid}`)
    .set({ Authorization: `bearer ${token2}` })
    .send(ocjeni)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    expect(odgovor._body.prijavljeniKorisnici[0].ocjena).toBe(4)
})
test('ispravno brisanje eventa', async () => {
    let token = null
    const podaciLogin = {
        username: "testni2",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(podaciLogin)
    .expect('Content-Type', /application\/json/)
    .expect((res) => token = res._body.token)
    
    let idNovi= null
    const noviEvent = {
        naziv: "test party",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        vrijeme: new Date("2022-07-05T22:00:00+00:00"),
        otvoreno: true,
        placanje: false,
        cijena:  0,
        opis: "neki opis",
    }
    
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    .expect(res => idNovi = res.body.id)

    const eventiPocetak = await pomocni.eventiBaze()
    const odgovor = await api
    .delete(`/api/eventi/${idNovi}`)
    .set({ Authorization: `bearer ${token}` })
    .expect(204)
    const eventiKraj = await pomocni.eventiBaze()
    expect(eventiKraj).toHaveLength(eventiPocetak.length - 1)
    const naziv = eventiKraj.map(ev => ev.naziv)
    expect(naziv).not.toContain(noviEvent.naziv)
})
test('ispravno brisanje eventa od strane admina', async () => {
    let token = null
    const podaciLogin = {
        username: "testni2",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(podaciLogin)
    .expect('Content-Type', /application\/json/)
    .expect((res) => token = res._body.token)
    let tokenAdmin = null
    const podaciLoginAdmin = {
        username: "testni",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(podaciLoginAdmin)
    .expect('Content-Type', /application\/json/)
    .expect((res) => tokenAdmin = res._body.token)
    
    let idNovi= null
    const noviEvent = {
        naziv: "test party",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        vrijeme: new Date("2022-07-05T22:00:00+00:00"),
        otvoreno: true,
        placanje: false,
        cijena:  0,
        opis: "neki opis",
    }
    
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    .expect(res => idNovi = res.body.id)

    const eventiPocetak = await pomocni.eventiBaze()
    const odgovor = await api
    .delete(`/api/eventi/${idNovi}`)
    .set({ Authorization: `bearer ${tokenAdmin}` })
    .expect(204)
    const eventiKraj = await pomocni.eventiBaze()
    expect(eventiKraj).toHaveLength(eventiPocetak.length - 1)
    const naziv = eventiKraj.map(ev => ev.naziv)
    expect(naziv).not.toContain(noviEvent.naziv)
})
test('neovlasteno brisanje eventa', async () => {
    let token = null
    const podaciLogin = {
        username: "testni",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(podaciLogin)
    .expect('Content-Type', /application\/json/)
    .expect((res) => token = res._body.token)
    let tokenNeovlasteni = null
    const podaciLoginNeovlasteni = {
        username: "testni2",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(podaciLoginNeovlasteni)
    .expect('Content-Type', /application\/json/)
    .expect((res) => tokenNeovlasteni = res._body.token)
    
    let idNovi= null
    const noviEvent = {
        naziv: "test party",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        vrijeme: new Date("2022-07-05T22:00:00+00:00"),
        otvoreno: true,
        placanje: false,
        cijena:  0,
        opis: "neki opis",
    }
    
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    .expect(res => idNovi = res.body.id)

    const eventiPocetak = await pomocni.eventiBaze()
    const odgovor = await api
    .delete(`/api/eventi/${idNovi}`)
    .set({ Authorization: `bearer ${tokenNeovlasteni}` })
    .expect(401)
    const eventiKraj = await pomocni.eventiBaze()
    expect(eventiKraj).toHaveLength(eventiPocetak.length)
    const naziv = eventiKraj.map(ev => ev.naziv)
    expect(naziv).toContain(noviEvent.naziv)
})
test('brisanje svih eventa jednog korisnika', async () => {
    let token = null
    const podaciLogin = {
        username: "testni",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(podaciLogin)
    .expect('Content-Type', /application\/json/)
    .expect((res) => token = res._body.token)

    const noviEvent = {
        naziv: "test party",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        vrijeme: new Date("2022-07-05T22:00:00+00:00"),
        otvoreno: true,
        placanje: false,
        cijena:  0,
        opis: "neki opis",
    }
    let vlasnik=null
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    const noviEvent2 = {
        naziv: "test party2",
        tip: "test2",
        mjesto: "test2",
        adresa: "test2",
        vrijeme: new Date("2022-07-05T22:00:00+00:00"),
        otvoreno: true,
        placanje: false,
        cijena:  0,
        opis: "neki opis2",
    }
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent2)
    .expect(res => vlasnik = res._body.korisnik)
    
    const eventiPocetak = await pomocni.eventiBaze()
    
    const odgovor = await api
    .delete(`/api/eventi/visestruko/${vlasnik}`)
    .set({ Authorization: `bearer ${token}` })
    .expect(204)
    
    const eventiKraj = await pomocni.eventiBaze()
    expect(eventiKraj).toHaveLength(eventiPocetak.length - 2)
    const naziv = eventiKraj.map(ev => ev.naziv)
    expect(naziv).not.toContain(noviEvent.naziv)
    expect(naziv).not.toContain(noviEvent2.naziv)
})
afterAll(() => {
    mongoose.connection.close()
})
