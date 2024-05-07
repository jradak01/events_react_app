import axios from 'axios';

const osnovniUrl = 'http://localhost:3001/api/eventi'

let token = null
const postaviToken = (noviToken) => {
    token = `bearer ${noviToken}`
}

const dohvatiSve = async () => {
    const odgovor = await axios.get(osnovniUrl);
    return odgovor
}

const dohvatiJendog = async (id) => {
    return axios.get(`${osnovniUrl}/${id}`);
}

const stvori = async (noviObjekt) => {
    const config = {
        headers: { Authorization: token }
    }
    const odgovor = await axios.post(osnovniUrl, noviObjekt, config)
    return odgovor
}

const osvjezi = async (id, noviObjekt) => {
    const config = {
        headers: { Authorization: token }
    }
    const odgovor = await axios.put(`${osnovniUrl}/${id}`, noviObjekt, config)
    return odgovor
}
const postaviOcjenu = async (id, prid, noviObjekt) => {
    const config = {
        headers: { Authorization: token }
    }
    const odgovor = await axios.put(`${osnovniUrl}/${id}/${prid}`, noviObjekt, config)
    return odgovor
}

const brisi = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    const odgovor = await axios.delete(`${osnovniUrl}/${id}`, config)
    return odgovor
}
const brisiSve = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    const odgovor = await axios.delete(`${osnovniUrl}/visestruko/${id}`, config)
    return odgovor
}

export default { postaviToken, dohvatiSve, dohvatiJendog, stvori, osvjezi, postaviOcjenu, brisi, brisiSve };