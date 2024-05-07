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
    const korisnik3 = new Korisnik({ime: 'pocetniTestini3', username: 'testni3', email: "testni3@email.com", uloga: "korisnik", passHash})
    await korisnik.save()
    await korisnik2.save()
    await korisnik3.save()
})

test('dohvacanje svih prijava na jedan event', async () => {
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
    let token3 = null
    const podaciLogin3 = {
        username: "testni3",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(podaciLogin3)
    .expect('Content-Type', /application\/json/)
    .expect((res) => token3 = res._body.token)

    let idNovi = null
    const noviEvent = {
        naziv: "test",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        otvoreno: true,
        placanje: true,
        vrijeme: new Date("2022-06-05T22:00:00+00:00"),
        cijena: 40,
        opis: "test",
    }
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    .expect((res) => idNovi = res._body.id)

    await api
    .put(`/api/prijave/${idNovi}`)
    .set({ Authorization: `bearer ${token2}` })
    .expect(200)
    await api
    .put(`/api/prijave/${idNovi}`)
    .set({ Authorization: `bearer ${token3}` })
    .expect(200)

    const odgovor = await api
    .get(`/api/prijave/${idNovi}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
    expect(odgovor._body).toHaveLength(2)

})
test('dohvacanje svih eventa na koje je korisnik prijavljen', async () => {
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
    
    let idNovi = null
    const noviEvent = {
        naziv: "test",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        otvoreno: true,
        placanje: true,
        vrijeme: new Date("2022-06-05T22:00:00+00:00"),
        cijena: 40,
        opis: "test",
    }
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    .expect((res) => idNovi = res._body.id)
    let idNovi2 = null
    const noviEvent2 = {
        naziv: "test2",
        tip: "test2",
        mjesto: "test2",
        adresa: "test2",
        otvoreno: true,
        placanje: true,
        vrijeme: new Date("2022-07-05T22:00:00+00:00"),
        cijena: 30,
        opis: "test2",
    }
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent2)
    .expect((res) => idNovi2 = res._body.id)

    await api
    .put(`/api/prijave/${idNovi}`)
    .set({ Authorization: `bearer ${token2}` })
    .expect(200)
    await api
    .put(`/api/prijave/${idNovi2}`)
    .set({ Authorization: `bearer ${token2}` })
    .expect(200)

    const odgovor = await api
    .get('/api/prijave')
    .set({ Authorization: `bearer ${token2}` })
    .expect(200)
    .expect('Content-Type', /application\/json/)

    expect(odgovor._body).toHaveLength(2)
})
test('dohvacanje jedne prijave na jednom eventu', async () => {
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

    let idNovi = null
    const noviEvent = {
        naziv: "test",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        otvoreno: true,
        placanje: true,
        vrijeme: new Date("2022-06-05T22:00:00+00:00"),
        cijena: 40,
        opis: "test",
    }
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    .expect((res) => idNovi = res._body.id)

    let prid = null
    await api
    .put(`/api/prijave/${idNovi}`)
    .set({ Authorization: `bearer ${token2}` })
    .expect((res) => prid = res._body.prijavljeniKorisnici[0]._id)

    const odgovor = await api
    .get(`/api/prijave/${idNovi}/${prid}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    expect(odgovor._body.dopusteno).toBe(false)

})
test('prijava korisnika na event', async () => {
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

    let tokenPrijavljenog = null
    const loginPodaciPrijavljenog = {
        username: "testni2",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(loginPodaciPrijavljenog)
    .expect('Content-Type', /application\/json/)
    .expect((res) => tokenPrijavljenog = res._body.token)

    let idNovi = null
    const noviEvent = {
        naziv: "test",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        otvoreno: true,
        placanje: true,
        vrijeme: new Date("2022-06-05T22:00:00+00:00"),
        cijena: 40,
        opis: "test",
    }
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    .expect((res) => idNovi = res._body.id)

    await api
    .put(`/api/prijave/${idNovi}`)
    .set({ Authorization: `bearer ${tokenPrijavljenog}` })
    .expect(200)

    const eventiNaKraju = await pomocni.eventiBaze()
    const brojPrijava = eventiNaKraju.map(ev => ev.prijavljeniKorisnici.length)
    console.log(brojPrijava)
    expect(brojPrijava).toContain(1)
})
test('mijenjanje dopustenja na event', async () => {
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
    let tokenPrijavljenog = null
    const loginPodaciPrijavljenog = {
        username: "testni2",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(loginPodaciPrijavljenog)
    .expect('Content-Type', /application\/json/)
    .expect((res) => tokenPrijavljenog = res._body.token)

    let idNovi = null
    const noviEvent = {
        naziv: "test",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        otvoreno: true,
        placanje: true,
        vrijeme: new Date("2022-06-05T22:00:00+00:00"),
        cijena: 40,
        opis: "test",
    }
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    .expect((res) => idNovi = res._body.id)

    let prid = null
    await api
    .put(`/api/prijave/${idNovi}`)
    .set({ Authorization: `bearer ${tokenPrijavljenog}` })
    .expect((res) => prid = res._body.prijavljeniKorisnici[0]._id)

    const promjena = {
        dopustenje: true
    }

    await api
    .put(`/api/prijave/${idNovi}/${prid}`)
    .set({ Authorization: `bearer ${token}` })
    .send(promjena)
    .expect(200)

    const eventiNaKraju = await pomocni.eventiBaze()
    const prijave = eventiNaKraju.map(p=>p.prijavljeniKorisnici)
    const odredenaPrijava = prijave[4][0].dopusteno
    expect(odredenaPrijava).toBe(true)
})
test('brisanje zahtjeva na event', async () => {
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
    let tokenPrijavljenog = null
    const loginPodaciPrijavljenog = {
        username: "testni2",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(loginPodaciPrijavljenog)
    .expect('Content-Type', /application\/json/)
    .expect((res) => tokenPrijavljenog = res._body.token)
    
    let idNovi = null
    const noviEvent = {
        naziv: "test",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        otvoreno: true,
        placanje: true,
        vrijeme: new Date("2022-06-05T22:00:00+00:00"),
        cijena: 40,
        opis: "test",
    }
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    .expect((res) => idNovi = res._body.id)

    let prid = null
    await api
    .put(`/api/prijave/${idNovi}`)
    .set({ Authorization: `bearer ${tokenPrijavljenog}` })
    .expect((res) => prid = res._body.prijavljeniKorisnici[0]._id)

    await api
    .put(`/api/prijave/delete/${idNovi}/${prid}`)
    .set({ Authorization: `bearer ${tokenPrijavljenog}` })
    .expect(200)
    
    const eventiNaKraju = await pomocni.eventiBaze()
    const brojPrijava = eventiNaKraju.map(ev => ev.prijavljeniKorisnici.length)
    console.log(brojPrijava)
    expect(brojPrijava).not.toContain(1)
})
test('brisanje svih prijava na evente jednog korisnika', async () =>{
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
    let tokenPrijavljenog = null
    let podaciPrijavljenog = null
    const loginPodaciPrijavljenog = {
        username: "testni2",
        pass: "tajna"
    }
    await api
    .post('/api/login/')
    .send(loginPodaciPrijavljenog)
    .expect('Content-Type', /application\/json/)
    .expect((res) => podaciPrijavljenog = res._body)
    tokenPrijavljenog = podaciPrijavljenog.token
    const korisnik = await api
    .get(`/api/korisnici/${podaciPrijavljenog.username}`)
    .expect('Content-Type', /application\/json/)
    const idKorisnik = korisnik._body.id

    let idNovi = null
    const noviEvent = {
        naziv: "test",
        tip: "test",
        mjesto: "test",
        adresa: "test",
        otvoreno: true,
        placanje: true,
        vrijeme: new Date("2022-06-05T22:00:00+00:00"),
        cijena: 40,
        opis: "test",
    }
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent)
    .expect((res) => idNovi = res._body.id)
    let idNovi2 = null
    const noviEvent2 = {
        naziv: "test2",
        tip: "test2",
        mjesto: "test2",
        adresa: "test2",
        otvoreno: true,
        placanje: true,
        vrijeme: new Date("2022-06-05T22:00:00+00:00"),
        cijena: 30,
        opis: "test2",
    }
    await api
    .post('/api/eventi')
    .set({ Authorization: `bearer ${token}` })
    .send(noviEvent2)
    .expect((res) => idNovi2 = res._body.id)

    await api
    .put(`/api/prijave/${idNovi}`)
    .set({ Authorization: `bearer ${tokenPrijavljenog}` })
    await api
    .put(`/api/prijave/${idNovi2}`)
    .set({ Authorization: `bearer ${tokenPrijavljenog}` })
    
    const odgovor = await api
    .delete(`/api/prijave/${idKorisnik}`)
    .set({ Authorization: `bearer ${tokenPrijavljenog}` })
    .expect(200)
    expect(odgovor._body[0].prijavljeniKorisnici).toHaveLength(0)
    expect(odgovor._body[1].prijavljeniKorisnici).toHaveLength(0)
})
afterAll(() => {
    mongoose.connection.close()
})
