const bcrypt = require('bcrypt')
const Korisnik = require('../models/korisnik')
const pomocni = require('./test_pomocni')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('tests login', () =>{
    beforeEach(async () => {
        await Korisnik.deleteMany({})
        const passHash = await bcrypt.hash('tajna', 10)
        const korisnik = new Korisnik({ime: 'testni', username: 'test', email: "testni@email.com", uloga: "admin", passHash})
        await korisnik.save()
        
    })
    test('uspješna prijava postojeceg korisnika', async () => {
        const podaciLogin = {
            username : "test",
            pass: "tajna"
        }
        await api
        .post('/api/login/')
        .send(podaciLogin)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => res._body.username === "tajna")
    })
    test('neuspješna prijava postojeceg korisnika', async () => {
        const podaciLogin = {
            username : "test",
            pass: "lozinka"
        }
        await api
        .post('/api/login/')
        .send(podaciLogin)
        .expect(401)
        .expect('Content-Type', /application\/json/)
        .expect((res) => res._body.username===undefined)
    })
    test('pokusaj prijave nepostojeceg korisnika', async () => {
        const podaciLogin = {
            username : "nepostojeci korisnik",
            pass: "lozinka"
        }
        await api
        .post('/api/login/')
        .send(podaciLogin)
        .expect(401)
        .expect('Content-Type', /application\/json/)
        .expect((res) => res._body.username===undefined)
    })
})
afterAll(() => {
    mongoose.connection.close()
})
