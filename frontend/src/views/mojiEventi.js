import React, { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';
import '../components/style.css';
import eventiAkcije from '../services/eventi';
import prijaveAkcije from '../services/prijave'
import korisniciAkcije from '../services/korisnici'
import Dogadaj from '../components/dogadaj';
import { vrijemeZaFilter } from "../components/pomocne";

const MojiEventi = () => {
    const [eventi, postaviEvente] = useState([])
    const [korisnik, postaviKorisnika] = useState(null)
    const [kor, postaviKor] = useState(null)
    const eventiZaIspis = eventi.filter(ev => vrijemeZaFilter(ev.vrijeme) === true)
    const eventiZaIspis2 = eventi.filter(ev => vrijemeZaFilter(ev.vrijeme) === false)
    const brisi = (id) => {
        eventiAkcije.brisi(id).then((response) => {
            postaviEvente(eventi.filter(t => t.id !== id))
        })
    }
    useEffect(() => {
        const logiraniKorisnikJSON = window.localStorage.getItem(
            "Prijavljeni korisnik"
        );
        if (logiraniKorisnikJSON) {
            const korisnik = JSON.parse(logiraniKorisnikJSON);
            postaviKorisnika(korisnik);
            eventiAkcije.postaviToken(korisnik.token)
            korisniciAkcije.dohvatiJednog(korisnik.username)
                .then(res => postaviKor(res.data))
            eventiAkcije.dohvatiSve()
                .then(res => postaviEvente(res.data.filter(ev=> ev.korisnik.username===korisnik.username)))
    
        }
    }, []);
    return (
        <div>
            <h4>Nadolazeći eventi</h4>
            <Table striped hover className="table-scroll">
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Tip</th>
                        <th>Mjesto</th>
                        <th>Adresa</th>
                        <th>Vrijeme</th>
                        <th>Otvoreno</th>
                        <th>Placanje</th>
                        <th>Kreator</th>
                        <th>Cijena</th>
                        <th>Opis</th>
                    </tr>
                </thead>
                <tbody>
                    {eventiZaIspis.map(t =>
                        <Dogadaj key={t.id} id={t.id} naziv={t.naziv}
                            tip={t.tip} mjesto={t.mjesto} adresa={t.adresa} vrijeme={t.vrijeme}
                            otvoreno={t.otvoreno} placanje={t.placanje} cijena={t.cijena}
                            kreator={t.korisnik} opis={t.opis} korisnik={kor} brisi={()=>brisi(t.id)}/>
                    )}
                </tbody>
            </Table>
            <h4>Prošli eventi</h4>
            <Table striped hover className="table-scroll">
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Tip</th>
                        <th>Mjesto</th>
                        <th>Adresa</th>
                        <th>Vrijeme</th>
                        <th>Otvoreno</th>
                        <th>Placanje</th>
                        <th>Kreator</th>
                        <th>Cijena</th>
                        <th>Opis</th>
                    </tr>
                </thead>
                <tbody>
                    {eventiZaIspis2.map(t =>
                        <Dogadaj key={t.id} id={t.id} naziv={t.naziv}
                            tip={t.tip} mjesto={t.mjesto} adresa={t.adresa} vrijeme={t.vrijeme}
                            otvoreno={t.otvoreno} placanje={t.placanje} cijena={t.cijena}
                            kreator={t.korisnik} opis={t.opis} korisnik={kor} brisi={()=>brisi(t.id)}/>
                    )}
                </tbody>
            </Table>
        </div>
    );
}

export default MojiEventi;