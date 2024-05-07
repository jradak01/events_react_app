import axios from 'axios';

const osnovniUrl = 'http://localhost:3001/api/korisnici'

let token = null
const postaviToken = (noviToken) => {
    token = `bearer ${noviToken}`
}

const dohvatiSve = async () => {
    const config = {
        headers: { Authorization: token }
    }
    const odgovor = await axios.get(osnovniUrl, config);
    return odgovor
}

// const dohvatiJednog = async (id) => {
//     const odgovor = await axios.get(`${osnovniUrl}/${id}`);  
//     return odgovor
// }

const dohvatiJednog = async (username) => {
    const odgovor = await axios.get(`${osnovniUrl}/${username}`);
    return odgovor
}

const stvori = async (noviObjekt) => {
    const odgovor = await axios.post(osnovniUrl, noviObjekt)
    return odgovor
}

const osvjezi = async (noviObjekt, id) => {
    const config = {
        headers: { Authorization: token }
    }
    const odgovor = await axios.put(`${osnovniUrl}/${id}`, noviObjekt, config)
    return odgovor
}
const promijeniUlogu = async (noviObjekt, id) => {
    const config = {
        headers: { Authorization: token }
    }
    const odgovor = await axios.put(`${osnovniUrl}/uloga/${id}`, noviObjekt, config)
    return odgovor
}
const brisi = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    const odgovor = await axios.delete(`${osnovniUrl}/${id}`, config)
    return odgovor
}

export default {postaviToken, dohvatiSve, dohvatiJednog, stvori, osvjezi, brisi, promijeniUlogu};
