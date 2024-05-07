const bcrypt = require('bcrypt')
const Korisnik = require('../models/korisnik')
const pomocni = require('./test_pomocni')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('tests korisnici', () =>{
    beforeEach(async () => {
        await Korisnik.deleteMany({})
        const passHash = await bcrypt.hash('tajna', 10)
        const korisnik = new Korisnik({ime: 'pocetniTestini', username: 'testni', email: "testni@email.com", uloga: "masteradmin", passHash})
        const korisnik2 = new Korisnik({ime: 'pocetniTestini2', username: 'testni2', email: "testni2@email.com", uloga: "korisnik", passHash})
        await korisnik.save()
        await korisnik2.save()    
    })
    test('Korisnici se vraćaju u JSON formatu', async () => {
        let token = null
        const podaciLogin = {
            username : "testni",
            pass: "tajna"
        }
        await api
        .post('/api/login/')
        .send(podaciLogin)
        .expect('Content-Type', /application\/json/)
        .expect((res) => token = res._body.token)

        await api
            .get('/api/korisnici')
            .set({Authorization: `bearer ${token}`})
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('Dohvacanje svih korisnika', async () => {
        let token = null
        const podaciLogin = {
            username : "testni",
            pass: "tajna"
        }
        await api
        .post('/api/login/')
        .send(podaciLogin)
        .expect('Content-Type', /application\/json/)
        .expect((res) => token = res._body.token)
        
        const odgovor = await api
                        .get('/api/korisnici')
                        .set({Authorization: `bearer ${token}`})
                        .expect(200)
                        .expect('Content-Type', /application\/json/)
        expect(odgovor.body).toHaveLength(2)
    })
    test('Dohvacanje jednog korisnika', async () => {
        const korisnici = await pomocni.korisniciBaze()
        const korisnik = korisnici[1]
        const odgovor = await api
                        .get(`/api/korisnici/${korisnik.username}`)
                        .expect(200)
                        .expect('Content-Type', /application\/json/)
        expect(odgovor.body.ime).toContain('pocetniTestini2')
    })

    test('stvaranje novog korisnika', async () => {
        const pocetniKorisnici = await pomocni.korisniciBaze()

        const novi = {
            username: 'testniKorisnik',
            ime: 'Test',
            pass: 'tajna',
            email: "test@email.com"
        }

        await api
        .post('/api/korisnici')
        .send(novi)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const korisniciKraj= await pomocni.korisniciBaze()
        expect(korisniciKraj).toHaveLength(pocetniKorisnici.length + 1)

        const korImena = korisniciKraj.map(u => u.username)
        expect(korImena).toContain(novi.username)
    })
    test('uspjesno mijenjanje korisnika', async () => {
        let token = null
        const podaciLogin = {
            username : "testni2",
            pass: "tajna"
        }
        await api
        .post('/api/login/')
        .send(podaciLogin)
        .expect('Content-Type', /application\/json/)
        .expect((res) => token = res._body.token)
        
        const korisniciPocetak = await pomocni.korisniciBaze()
        const korisnikZaMijenjanje = korisniciPocetak[1]
        
        const izmjenaKorisnika = {
            username: "test3",
            pass: "novatajna",
            staraLozinka: "tajna"
        }

        await api
        .put(`/api/korisnici/${korisnikZaMijenjanje.id}`)
        .set({Authorization: `bearer ${token}`})
        .send(izmjenaKorisnika)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        const korisniciNaKraju = await pomocni.korisniciBaze()
        const username = korisniciNaKraju.map(k => k.username)
        expect(username).toContain("test3")
    })
    test('uspjesno mijenjanje uloge korisnika', async () => {
        let token = null
        const podaciLogin = {
            username : "testni",
            pass: "tajna"
        }
        await api
        .post('/api/login/')
        .send(podaciLogin)
        .expect('Content-Type', /application\/json/)
        .expect((res) => token = res._body.token)
        
        const korisniciPocetak = await pomocni.korisniciBaze()
        const korisnikZaMijenjanje = korisniciPocetak[1]
        
        const izmjenaKorisnika = {
            uloga: "admin"
        }

        await api
        .put(`/api/korisnici/uloga/${korisnikZaMijenjanje.id}`)
        .set({Authorization: `bearer ${token}`})
        .send(izmjenaKorisnika)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        const korisniciNaKraju = await pomocni.korisniciBaze()
        const uloga = korisniciNaKraju.map(k => k.uloga)
        expect(uloga).toContain('admin')
    })
    test('ispravno brisanje korisnika kao sam korisnik', async () => {
        let token = null
        const podaciLogin = {
            username : "testni2",
            pass: "tajna"
        }
        await api
        .post('/api/login/')
        .send(podaciLogin)
        .expect('Content-Type', /application\/json/)
        .expect((res) => token = res._body.token)

        const korisniciPocetak = await pomocni.korisniciBaze()
        const korisnikZaBrisanje = korisniciPocetak[1]
        
        const odgovor = await api
        .delete(`/api/korisnici/${korisnikZaBrisanje.id}`)
        .set({Authorization: `bearer ${token}`})
        .expect(204)
        
        const korisniciKraj = await pomocni.korisniciBaze()
        expect(korisniciKraj).toHaveLength(korisniciPocetak.length - 1)
        const email = korisniciKraj.map(k => k.email)
        expect(email).not.toContain(korisnikZaBrisanje.email)
    })
    test('ispravno brisanje korisnika kao admin', async () => {
        let token = null
        const podaciLogin = {
            username : "testni",
            pass: "tajna"
        }
        await api
        .post('/api/login/')
        .send(podaciLogin)
        .expect('Content-Type', /application\/json/)
        .expect((res) => token = res._body.token)

        const korisniciPocetak = await pomocni.korisniciBaze()
        const korisnikZaBrisanje = korisniciPocetak[1]
        
        const odgovor = await api
        .delete(`/api/korisnici/${korisnikZaBrisanje.id}`)
        .set({Authorization: `bearer ${token}`})
        .expect(204)
        
        const korisniciKraj = await pomocni.korisniciBaze()
        expect(korisniciKraj).toHaveLength(korisniciPocetak.length - 1)
        const email = korisniciKraj.map(k => k.email)
        expect(email).not.toContain(korisnikZaBrisanje.email)
    })

})
afterAll(() => {
    mongoose.connection.close()
})
