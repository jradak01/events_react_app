import React, { useState, useEffect } from 'react'
import eventiAkcije from '../services/eventi';
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import Ocjena from './ocjena';
import {
    ispisBoolVrijednosti, postaviZvjezdice,
    postaviKorisnika, ocjenjuj
} from './pomocne'
const GotovDogadaj = ({ id, naziv, tip, mjesto, vrijeme, otvoreno, placanje,
    kreator, kor, dopusteno, rating, setRating, postavi, brisi }) => {
    const preusmjeri = useNavigate()
    const [ocjenjeno, postaviOcjenjeno] = useState(null)
    const postaviOcjenjeni = (objekt) => {
        if (objekt[0] !== undefined) {
            postaviOcjenjeno(objekt[0].ocjena)
        }
    }
    const prikaziDetalje = () => {
        preusmjeri(`/detalji/${id}`)
        window.location.reload(false)
    }
    useEffect(() => {
        const logiraniKorisnikJSON = window.localStorage.getItem(
            "Prijavljeni korisnik"
        );
        if (logiraniKorisnikJSON) {
            const korisnik = JSON.parse(logiraniKorisnikJSON);
            postaviKorisnika(korisnik);
            eventiAkcije.postaviToken(korisnik.token)
            eventiAkcije.dohvatiJendog(id)
                .then(res => postaviOcjenjeni(res.data.prijavljeniKorisnici.filter(pr => pr.prKorisnik.id === kor.id)))
        }
    }, []);
    const provjeraOcjene = () => {
        if (ocjenjeno === null || ocjenjeno === undefined) {
            return true;
        }
        return false;
    }
    return (
        <>
            {ocjenjuj(dopusteno, otvoreno) ?
                <tr>
                    <td>{naziv}</td>
                    <td>{tip}</td>
                    <td>{mjesto}</td>
                    <td>{vrijeme.substring(1,16)}</td>
                    <td>{ispisBoolVrijednosti(otvoreno)}</td>
                    <td>{ispisBoolVrijednosti(placanje)}</td>
                    <td>{postaviKorisnika(kreator)}</td>
                    {provjeraOcjene() ? <td><Ocjena setRating={setRating} rating={rating} /></td>
                        : <td>{postaviZvjezdice(ocjenjeno)}</td>}
                    {provjeraOcjene ? <td><Button variant='primary' onClick={postavi}>Podnesi</Button></td>
                        : ""}
                    <td><Button variant="primary" onClick={() => prikaziDetalje()}>Detalji</Button></td>   
                </tr> : ""
            }
        </>
    );
}
export default GotovDogadaj;