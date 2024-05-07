import React, { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';
import '../components/style.css';
import korisniciAkcije from '../services/korisnici';
import Korisnik from '../components/korisnik';
import prijaveAkcije from '../services/prijave'
import eventiAkcije from '../services/eventi';
import { useNavigate } from "react-router-dom";
const Korisnici = () => {
    const [korisnik, postaviKorisnika] = useState(null)
    const [korisnici, postaviKorisnike] = useState([])
    const [ispisSve, postaviIspis] = useState(null);
    const [unos, postaviUnos] = useState('')
    const navigiraj = useNavigate()
    const korisniciZaIpsis= ispisSve
    ? korisnici
    :korisnici.filter(k=>k.username.toLowerCase().includes(unos.toLowerCase())
        || k.ime.toLowerCase().includes(unos.toLowerCase())
        || k.email.toLowerCase().includes(unos.toLowerCase())
        || k.uloga.toLowerCase().includes(unos.toLowerCase())
    )

    const promjenaUnosa = (e) => {
        postaviUnos(e.target.value)
    }
    const brisi = (id) => {
        prijaveAkcije.brisanjeSvihPrijava(id)
        eventiAkcije.brisiSve(id)
        korisniciAkcije.brisi(id).then((response) => {
            postaviKorisnike(korisnici.filter(t => t.id !== id))
        })

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
            const promjena = await korisniciAkcije.promijeniUlogu({ uloga }, id)
            navigiraj(0);
        } else { return; }
    }
    useEffect(() => {
        const logiraniKorisnikJSON = window.localStorage.getItem(
            "Prijavljeni korisnik"
        );
        if (logiraniKorisnikJSON) {
            const korisnik = JSON.parse(logiraniKorisnikJSON);
            postaviKorisnika(korisnik);
            korisniciAkcije.postaviToken(korisnik.token)
            eventiAkcije.postaviToken(korisnik.token)
            prijaveAkcije.postaviToken(korisnik.token)
        }
    }, []);
    useEffect(() => {
        korisniciAkcije.dohvatiSve()
            .then(res => postaviKorisnike(res.data))
    }, []);
    return (
        <div>
            <div className="search-div">
                <input className="search-element" type="search" value={unos} placeholder=" ⌕ " onChange={promjenaUnosa}></input>
            </div>
            <Table striped hover className="table-cont">
                <thead>
                    <tr>
                        <th>Korisničko ime</th>
                        <th>Ime</th>
                        <th>Email</th>
                        <th>Uloga</th>
                    </tr>
                </thead>
                <tbody>
                    {korisniciZaIpsis.map(t =>
                        <Korisnik key={t.id} id={t.id} username={t.username}
                            ime={t.ime} uloga={t.uloga} email={t.email} korisnik={korisnik} brisi={() => brisi(t.id)} promijeniUlogu={() => promijeniUlogu(t.uloga, t.id)}/>
                    )}
                </tbody>
            </Table>
        </div>
    );
}
export default Korisnici;