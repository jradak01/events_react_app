import React, { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';
import '../components/style.css'
import eventiAkcije from '../services/eventi';
import prijaveAkcije from '../services/prijave';
import korisniciAkcije from '../services/korisnici'
import Dogadaj from '../components/dogadaj';
import { vrijemeZaFilter } from "../components/pomocne";
const Dogadaji = () => {
    const [eventi, postaviEvente] = useState([])
    const [ispisSve, postaviIspis] = useState(null);
    const [unos, postaviUnos] = useState('')
    const [korisnik, postaviKorisnika] = useState(null)
    const [kor, postaviKor] = useState(null)
    const eventiZaIspis = ispisSve
        ? eventi
        : eventi.filter(ev => ev.naziv.toLowerCase().includes(unos.toLowerCase())
            || ev.tip.toLowerCase().includes(unos.toLowerCase())
            || ev.mjesto.toLowerCase().includes(unos.toLowerCase())
            || ev.adresa.toLowerCase().includes(unos.toLowerCase())
            || ev.opis.toLowerCase().includes(unos.toLowerCase()))
    const promjenaUnosa = (e) => {
        postaviUnos(e.target.value)
    }
    const brisi = (id) => {
        eventiAkcije.brisi(id).then((response) => {
            postaviEvente(eventi.filter(t => t.id !== id))
        })
    }
    const prijava = async (id) => {
        const novaPrijava = await prijaveAkcije.prijava(id)
    }
    const brisiPrijavu = async (id, kor) => {
        const korisnik = await korisniciAkcije.dohvatiJednog(kor.username)
        const prijaveEvent = await prijaveAkcije.dohvatiSveNaJedan(id)
        const prijavaZaBrisanje = prijaveEvent.data.filter(pr => pr.prKorisnik.id === korisnik.data.id)
        const idPrijaveZaBrisanje = prijavaZaBrisanje.map(pr => pr._id)
        const brisiOdabranuPrijavu = await prijaveAkcije.uklanjanjePrijave(id, idPrijaveZaBrisanje[0])
    }
    useEffect(() => {
        const logiraniKorisnikJSON = window.localStorage.getItem(
            "Prijavljeni korisnik"
        );
        if (logiraniKorisnikJSON) {
            const korisnik = JSON.parse(logiraniKorisnikJSON);
            postaviKorisnika(korisnik);
            eventiAkcije.postaviToken(korisnik.token)
            prijaveAkcije.postaviToken(korisnik.token)
            korisniciAkcije.dohvatiJednog(korisnik.username)
                .then(res => postaviKor(res.data))
        }
    }, []);
    useEffect(() => {
        eventiAkcije.dohvatiSve()
            .then(res => postaviEvente(res.data.filter(ev => vrijemeZaFilter(ev.vrijeme) === true)))
    }, []);
    return (
        <div>
            <div className="search-div">
                <input className="search-element" type="search" value={unos} placeholder=" ⌕ " onChange={promjenaUnosa}></input>
            </div>
            <Table striped hover className="table-cont">
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Tip</th>
                        <th>Mjesto</th>
                        <th>Vrijeme</th>
                        <th>Otvoreno</th>
                        <th>Placanje</th>
                        <th>Kreator</th>
                    </tr>
                </thead>
                <tbody>
                    {eventiZaIspis.map(t =>
                        <Dogadaj key={t.id} id={t.id} naziv={t.naziv}
                            tip={t.tip} mjesto={t.mjesto} adresa={t.adresa} vrijeme={t.vrijeme}
                            otvoreno={t.otvoreno} placanje={t.placanje} cijena={t.cijena} kreator={t.korisnik} korisnik={kor}
                            opis={t.opis} prijava={() => prijava(t.id)} brisiPrijavu={() => brisiPrijavu(t.id, korisnik)} brisi={() => brisi(t.id)} />
                    )}
                </tbody>
            </Table>
        </div>
    );
}
export default Dogadaji;