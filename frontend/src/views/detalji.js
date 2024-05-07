import React, { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';
import "../components/style.css";
import '../components/buttons.css'
import eventiAkcije from '../services/eventi';
import prijaveAkcije from '../services/prijave';
import korisniciAkcije from '../services/korisnici'
import { useParams, useNavigate } from "react-router-dom";
import Prijave from "../components/prijave";
import UrediEvent from '../components/urediEvent';
import { postaviKorisnika, provjera, provjeraPrijave, provjeraUredenje, vrijemeZaFilter } from '../components/pomocne';

const Detalji = ({ props }) => {
    const preusmjeri = useNavigate()
    let { id } = useParams();
    const [prijavljeniNaEvent, postaviPrijavljeneNaEvent] = useState([])
    const [ocjenjivanje, postupakOcjenjivanja] = useState("Ocjene još nisu dostupne :(")
    const [otvorenost, postaviOtvoreno] = useState("DA")
    const [korisnik, postaviKorisnikaGlob] = useState(null)
    const [naziv, postaviNaziv] = useState("")
    const [tip, postaviTip] = useState("")
    const [mjesto, postaviMjesto] = useState("")
    const [adresa, postaviAdresu] = useState("")
    const [unesenoVrijeme, postaviVrijeme] = useState("")
    const [placanje_, postaviPlacanje] = useState("NE")
    const [cijena, postaviCijenu] = useState("")
    const [opis, postaviOpis] = useState("")
    const [kreator, postaviKreatora] = useState("---")
    const [prijavljen, postaviPrijavljen] = useState(false)
    const [prijavljeni, postaviPrijavljene] = useState([])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const postaviParametre = (naziv, tip, mjesto, adresa,
        vrijeme, otvorenost, placanje, cijena, opis, kor, prijavljenoKr) => {
        postaviOtvoreno(otvorenost ? "DA" : "NE")
        postaviNaziv(naziv)
        postaviTip(tip)
        postaviMjesto(mjesto)
        postaviAdresu(adresa)
        postaviVrijeme(vrijeme.substring(0, 19))
        postaviOtvoreno(otvorenost ? "DA" : "NE")
        postaviPlacanje(placanje ? "DA" : "NE")
        postaviCijenu(cijena)
        postaviOpis(opis)
        postaviKreatora(kor)
        postaviPrijavljene(prijavljenoKr)
    }
    const promijeniDopusteno = async (id, prid, dopusteno) => {
        const dopustenje = {
            dopustenje: dopusteno
        }
        const promjena = await prijaveAkcije.dozvola(id, prid, dopustenje)
        preusmjeri(0)
    };
    const prijava = async (id) => {
        const novaPrijava = await prijaveAkcije.prijava(id)
        preusmjeri(0)
    }
    const brisiPrijavu = async (id, kor) => {
        const korisnik = await korisniciAkcije.dohvatiJednog(kor.username)
        const prijaveEvent = await prijaveAkcije.dohvatiSveNaJedan(id)
        const prijavaZaBrisanje = prijaveEvent.data.filter(pr => pr.prKorisnik.id === korisnik.data.id)
        const idPrijaveZaBrisanje = prijavaZaBrisanje.map(pr => pr._id)
        const brisiOdabranuPrijavu = await prijaveAkcije.uklanjanjePrijave(id, idPrijaveZaBrisanje[0])
        preusmjeri(0)
    }
    const brisi = async (_id) => {
        const obrisi = await eventiAkcije.brisi(_id)
        preusmjeri('/')
        window.location.reload(true)
    }
    const izracunajOcjenu = (prijavljeniNaEvent) => {
        if(prijavljeniNaEvent!==undefined){
        let prijavljeniNePrazni = prijavljeniNaEvent.filter(pr => pr.ocjena !== undefined)
        let postaviUkupnuOcjenu = prijavljeniNePrazni.reduce((acc, oc) => acc + parseInt(oc.ocjena), 0)
        let ukPrijavljenih = prijavljeniNaEvent.filter(prijava => prijava.ocjena !== undefined)
        let ukupnoPrijavljenih = ukPrijavljenih.length
        if (ukupnoPrijavljenih > 0 && (!isNaN(postaviUkupnuOcjenu) || postaviUkupnuOcjenu > 0)) {
            let konacnaOcijena = postaviUkupnuOcjenu / ukupnoPrijavljenih
            postupakOcjenjivanja(konacnaOcijena);
        } else {
            postupakOcjenjivanja("Ocjene još nisu dostupne :(")
        }
        }
    }
    const PostaviPrijavljenEvent = (korisnik, data) => {
        if (korisnik != null) {
            const postoji = data.filter(pr => pr.prKorisnik.username === korisnik.username)
            if (postoji.length > 0) {
                postaviPrijavljen(true)
            } else {
                postaviPrijavljen(false)
            }
        } else {
            postaviPrijavljen(false)
        }
    }
    useEffect(() => {
        const logiraniKorisnikJSON = window.localStorage.getItem(
            "Prijavljeni korisnik"
        );
        if (logiraniKorisnikJSON) {
            const korisnik = JSON.parse(logiraniKorisnikJSON);
            postaviKorisnikaGlob(korisnik);
            prijaveAkcije.postaviToken(korisnik.token)
            eventiAkcije.postaviToken(korisnik.token)
            // if (korisnik !== null) {
            //     eventiAkcije.dohvatiJendog(id)
            //         .then(res => PostaviPrijavljenEvent(korisnik, res.data))
            // }
            prijaveAkcije.dohvatiSveNaJedan(id)
                    .then((res) => {
                        PostaviPrijavljenEvent(korisnik, res.data)
                        postaviPrijavljeneNaEvent(res.data)
                        izracunajOcjenu(res.data)
            })
        }
        eventiAkcije.dohvatiJendog(id)
        .then(res => postaviParametre(res.data.naziv, res.data.tip, res.data.mjesto,
            res.data.adresa, res.data.vrijeme, res.data.otvoreno, res.data.placanje,
            res.data.cijena, res.data.opis, res.data.korisnik, res.data.prijavljeniKorisnici))
    }, []);
    return (
        <div>
            <div className='okvir'>
                <div className="prozor">
                <div className="header"> {naziv} </div>
                    <div className="tekst">Tip: {tip} </div>
                    <div className="tekst">Mjesto: {mjesto} </div>
                    <div className="tekst">Adresa: {adresa} </div>
                    <div className="tekst">Vrijeme: {unesenoVrijeme.substring(1,16)} </div>
                    <div className="tekst">Otvoreno: {otvorenost} </div>
                    <div className="tekst">Placanje: {placanje_} </div>
                    <div className="tekst">Cijena: {cijena} kn </div>
                    <div className="tekst">Kreator : {postaviKorisnika(kreator)}</div>
                    <div className="tekst">Opis: {opis} </div>
                    {provjeraPrijave(korisnik, kreator) ?
                        <div>{prijavljen ?
                            <button className='btn-fullsize' onClick={() => brisiPrijavu(id, korisnik)}>Odjava</button>
                            : <button className='btn-fullsize' onClick={() => prijava(id, korisnik)}>Prijava</button>
                        }</div>
                        : ""
                    }
                    {provjeraUredenje(korisnik, kreator) ?
                        <button className='btn-leftshadow' onClick={handleShow}>Uredi</button>
                        : ""
                    }
                    <UrediEvent show={show} handleShow={handleShow} handleClose={handleClose} id={id} />
                    {provjera(korisnik, kreator) ?
                        <button className='btn-rightshadow' onClick={() => brisi(id)}>Briši</button>
                        : ""
                    }
                </div>
            </div>
            <Table hover className='table-cont'>
                <thead>
                    <tr>
                        <th>Prijavljeni korisnici</th>
                        {provjeraUredenje(korisnik, kreator) ? <th>Dopuštenje</th> : ""}
                        <th>Ocjena</th>
                    </tr>
                </thead>
                <tbody>
                    {prijavljeniNaEvent.map(pr =>
                        <Prijave key={pr._id} id={pr._id} kor={pr.prKorisnik.username}
                            dopusteno={pr.dopusteno} ocjena={pr.ocjena === undefined ? "x" : pr.ocjena} 
                            otvorenost={otvorenost}  vrijeme={vrijemeZaFilter(unesenoVrijeme)}
                            promijeniDopustenje={() => promijeniDopusteno(id, pr._id, pr.dopusteno ? false : true)}
                            provjera={provjeraUredenje(korisnik, kreator)} />
                    )}
                </tbody>
                <tfoot>
                    <tr><td>Ukupna ocjena:</td><td>{ocjenjivanje}</td></tr>
                </tfoot>
            </Table>
        </div>
    );
}

export default Detalji;