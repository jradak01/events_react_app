import React, { useState, useEffect } from 'react'
import { Table, Button } from 'react-bootstrap';
import eventiAkcije from '../services/eventi';
import korisniciAkcije from '../services/korisnici'
import prijaveAkcije from '../services/prijave'
import { useParams, useNavigate } from "react-router-dom";
import TablicaDogadaja from '../components/tablicaDogadaja';
import "../components/style.css";
import '../components/buttons.css'
const DetaljiKorisnik = ({ props }) => {

    let { username } = useParams();
    const [korIme, postaviKorIme] = useState('')
    const [ime, postaviIme] = useState('')
    const [email, postaviEmail] = useState('')
    const [id, postaviId] = useState('')
    const [uloga, postavIulogu] = useState('')
    const [dogadaji, postaviDogadaje] = useState([])
    const [korisnik, postaviKorisnika] = useState(null)
    const navigiraj = useNavigate()
    const brisi = (id) => {
        let akcija = "NE";
        if (window.confirm("Jeste li sigurni da želite izbrisati korisnički račun?")) {
            akcija = "DA";
        } else {
            akcija = "NE";
        }
        if (akcija === "DA") {
            prijaveAkcije.brisanjeSvihPrijava(id)
            eventiAkcije.brisiSve(id)
            korisniciAkcije.brisi(id)
            alert("Uspješno ste izbrisali korisnički račun! 😃")
            navigiraj('/korisnici');
        } else {
            return;
        }
    }
    const postaviPodatke = (korIme, ime, email, id, uloga, dogadaji) => {
        postaviKorIme(korIme)
        postaviIme(ime)
        postaviEmail(email)
        postaviId(id)
        postavIulogu(uloga)
        postaviDogadaje(dogadaji)
    }
    const promijeniUlogu = async (vrstaUloge, id) => {
        let akcija = "NE"
        if (window.confirm("Jeste li sigurni da želite promijeniti prava korisnika?")) {
            akcija = "DA";
        } else {
            akcija = "NE";
        }
        if (akcija === "DA") {
            const uloga = vrstaUloge === "admin" ? "korisnik" : "admin"
            const promjenaKorisnika = await korisniciAkcije.promijeniUlogu({ uloga }, id)
            navigiraj(0);
        } else { return; }
    }
    useEffect(() => {
        korisniciAkcije.dohvatiJednog(username)
            .then(res => postaviPodatke(res.data.username, res.data.ime,
                res.data.email, res.data.id, res.data.uloga, res.data.eventi))
    }, []);
    useEffect(() => {
        const logiraniKorisnikJSON = window.localStorage.getItem(
            "Prijavljeni korisnik"
        );
        if (logiraniKorisnikJSON) {
            const korisnik = JSON.parse(logiraniKorisnikJSON);
            postaviKorisnika(korisnik);
            korisniciAkcije.postaviToken(korisnik.token);
            eventiAkcije.postaviToken(korisnik.token)
            prijaveAkcije.postaviToken(korisnik.token)
        }
    }, []);
    return (
        <div>
            <div className='prozor'>
                <div className='tekst'>Korisničko ime: {korIme}</div>
                <div className='tekst'>Ime: {ime}</div>
                <div className='tekst'>Email: {email}</div>
                {uloga!=='masteradmin'?
                <div className='tekst'>Uloga: <Button variant="primary" className='promijeniUlogu' onClick={() =>korisnik.uloga==='admin'? '' : promijeniUlogu(uloga, id)}>{uloga}</Button></div>: <div>Uloga: {uloga}</div> }
            </div>
            <div>{dogadaji.length > 0 ?
                <Table striped hover className="table-cont">
                    <thead>
                        <tr>
                            <th>Naziv</th>
                            <th>Tip</th>
                            <th>Mjesto</th>
                            <th>Vrijeme</th>
                            <th>Otvoreno</th>
                            <th>Placanje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dogadaji.map(t =>
                            <TablicaDogadaja key={t.id} id={t.id} naziv={t.naziv}
                                tip={t.tip} mjesto={t.mjesto} adresa={t.adresa} vrijeme={t.vrijeme}
                                otvoreno={t.otvoreno} placanje={t.placanje} opis={t.opis} />
                        )}
                    </tbody>
                </Table>
                : ""}
            </div>
            {uloga!=='masteradmin' ?
            <div className="btn-div">
                <button className='btn-clear' onClick={() => brisi(id)}>Obriši korisnički račun</button>
            </div>:''
            }
        </div>
    );
}

export default DetaljiKorisnik;