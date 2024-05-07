import axios from 'axios';

const osnovniUrl = 'http://localhost:3001/api/prijave'

let token = null
const postaviToken = (noviToken) => {
    token = `bearer ${noviToken}`
}

const dohvatiSve = async () => {
    const config = {
        headers: { Authorization: token }
    }
    const odgovor = await axios.get(osnovniUrl, config)
    return odgovor
}
const dohvatiSveNaJedan = async (id) => {
    const odgovor = await axios.get(`${osnovniUrl}/${id}`)
    return odgovor
}
const dohvatiJedan = async (id, prid) => {
    const odgovor = await axios.get(`${osnovniUrl}/${id}/${prid}`)
    return odgovor
}

const prijava = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    const odgovor = await axios.put(`${osnovniUrl}/${id}`, null, config)
    return odgovor
}

const dozvola = async (id, prid, noviObjekt) => {
    const config = {
        headers: { Authorization: token }
    }
    const odgovor = await axios.put(`${osnovniUrl}/${id}/${prid}`, noviObjekt, config)
    return odgovor
}

const uklanjanjePrijave = async (id, prid) => {
    const config = {
        headers: { Authorization: token }
    }
    const odgovor = await axios.put(`${osnovniUrl}/delete/${id}/${prid}`, null, config)
    return odgovor
}

const brisanjeSvihPrijava = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    const odgovor = await axios.delete(`${osnovniUrl}/${id}`, config)
    return odgovor
}

export default {
    postaviToken, dohvatiSve, dohvatiSveNaJedan, dohvatiJedan,
    prijava, dozvola, uklanjanjePrijave, brisanjeSvihPrijava
}