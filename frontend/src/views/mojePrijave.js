import React, { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';
import '../components/style.css';
import { useNavigate } from "react-router-dom";
import eventiAkcije from '../services/eventi';
import prijaveAkcije from '../services/prijave'
import korisniciAkcije from '../services/korisnici'
import Dogadaj from '../components/dogadaj';
import GotovDogadaj from "../components/gotovDogadaj";
import { vrijemeZaFilter } from "../components/pomocne";

const MojePrijave = () => {
    const [eventi, postaviEvente] = useState([])
    const [korisnik, postaviKorisnika] = useState(null)
    const [kor, postaviKor] = useState(null)
    const [rating, setRating] = useState(0);
    const navigacija = useNavigate()

    const eventiZaIspis = eventi.filter(ev => vrijemeZaFilter(ev.vrijeme) === true)
    const eventiZaIspis2 = eventi.filter(ev => vrijemeZaFilter(ev.vrijeme) === false)

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
    const postavi = async (id, rating, kor) => {
        if (rating !== 0) {
            const korisnik = await korisniciAkcije.dohvatiJednog(kor.username)
            const prijaveEvent = await prijaveAkcije.dohvatiSveNaJedan(id)
            const prijavaZaOcjenu = prijaveEvent.data.filter(pr => pr.prKorisnik.id == korisnik.data.id)
            const prid = prijavaZaOcjenu.map(pr => pr._id)
            const ocjena = {
                ocjena: rating
            }
            const postavljanje = await eventiAkcije.postaviOcjenu(id, prid[0].toString(), ocjena)
            navigacija(0)
        }
    }
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
            prijaveAkcije.postaviToken(korisnik.token)
            eventiAkcije.postaviToken(korisnik.token)
            korisniciAkcije.dohvatiJednog(korisnik.username)
                .then(res => postaviKor(res.data))
            prijaveAkcije.dohvatiSve()
                .then(res => postaviEvente(res.data))
        }
    }, []);
    return (
        <>
            <h4>Eventi koje planiram posjetiti</h4>
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
                        <th>Dopušteno</th>
                        <th>Opis</th>
                    </tr>
                </thead>
                <tbody>
                    {eventiZaIspis.map(t =>
                        <Dogadaj key={t.id} id={t.id} naziv={t.naziv}
                            tip={t.tip} mjesto={t.mjesto} adresa={t.adresa} vrijeme={t.vrijeme}
                            otvoreno={t.otvoreno} placanje={t.placanje} cijena={t.cijena}
                            kreator={t.korisnik} opis={t.opis}
                            dopusteno={t.prijavljeniKorisnici.filter(pr => pr.prKorisnik.username === korisnik.username)}
                            korisnik={kor} prijava={() => prijava(t.id)} brisi={() => brisi(t.id)}
                            brisiPrijavu={() => brisiPrijavu(t.id, korisnik)} ispis={"DA"} />
                    )}
                </tbody>
            </Table>
            <h4>Eventi za ocjenu</h4>
            <Table striped hover className="table-scroll">
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Tip</th>
                        <th>Mjesto</th>
                        <th>Vrijeme</th>
                        <th>Otvoreno</th>
                        <th>Placanje</th>
                        <th>Kreator</th>
                        <th>Ocjena</th>
                    </tr>
                </thead>
                <tbody>
                    {eventiZaIspis2.map(t =>
                        <GotovDogadaj key={t.id} id={t.id} naziv={t.naziv}
                            tip={t.tip} mjesto={t.mjesto} vrijeme={t.vrijeme}
                            otvoreno={t.otvoreno} placanje={t.placanje}
                            kreator={t.korisnik} kor={kor} rating={rating}
                            setRating={setRating} postavi={() => postavi(t.id, rating, korisnik)}
                            dopusteno={t.prijavljeniKorisnici.filter(pr => pr.prKorisnik.username === korisnik.username)} />
                    )}
                </tbody>
            </Table>
        </>
    );
}

export default MojePrijave;