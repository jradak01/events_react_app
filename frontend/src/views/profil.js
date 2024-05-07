import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import eventiAkcije from '../services/eventi';
import korisniciAkcije from '../services/korisnici'
import prijaveAkcije from "../services/prijave";
import loginAkcije from '../services/login';
import { TextInputField, PassInputField } from '../components/formFields';
import { provjeraUsername, provjeraDuzineLozinke, provjeraEmaila, provjeraImena } from '../components/pomocne';
import '../components/style.css';
import "../components/buttons.css"

const Profil = ({ props }) => {
    const [korIme, postaviKorIme] = useState('')
    const [ime, postaviIme] = useState('')
    const [email, postaviEmail] = useState('')
    const [lozinka, postaviLozinku] = useState('')
    const [oldPass, postaviStaruLozinku] = useState('')
    const [id, postaviId] = useState('')
    const [uloga, postavIulogu] = useState('')
    const [korisnik, postaviKorisnika] = useState(null)
    const [provjeri, postaviProvjeru] = useState([])
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
            alert("Vaš korisnički račun je uspješno izbrisan!")
            window.localStorage.clear()
            navigiraj(0);
        } else {
            return;
        }
    }
    const postaviPodatke = (korIme, ime, email, id, uloga) => {
        postaviKorIme(korIme)
        postaviIme(ime)
        postaviEmail(email)
        postaviId(id)
        postavIulogu(uloga)
    }
    const provjeraUsernamePostoji = (username) => {
        korisniciAkcije.dohvatiJednog(username)
            .then(res => postaviProvjeru(res.data))
    }
    const urediProfil = async (e) => {
        e.preventDefault()
        if (oldPass === "") {
            alert('Niste unijeli sva tražena polja!')
            return;
        }
        else {
            try {
                if (korisnik.username !== korIme) {
                    provjeraUsernamePostoji(korIme)
                    let usernameProvjera = provjeraUsername(korIme, provjeri)
                    if (usernameProvjera !== '') {
                        alert('Korisničko ime već postoji!')
                        return;
                    }
                }
                let lozProvjera = provjeraDuzineLozinke(lozinka)
                let emailProvjera = provjeraEmaila(email)
                let imeProvjera = provjeraImena(ime)
                if (emailProvjera !== '') {
                    alert('Email mora biti valjan!')
                    return;
                }
                if (imeProvjera !== '') {
                    alert('Ime mora sadržavati najmanje 2 znaka!')
                    return;
                }
                const staraLozinka = oldPass
                const username = korIme
                let pass = lozinka
                if (lozinka === "") {
                    pass = staraLozinka
                    const promjenaKorisnika = await korisniciAkcije.osvjezi({
                        username, ime, email, pass, uloga, staraLozinka
                    }, id)
                } else {
                    if (lozProvjera === '') {
                        const promjenaKorisnika = await korisniciAkcije.osvjezi({
                            username, ime, email, pass, uloga, staraLozinka
                        }, id)
                    } else {
                        alert('Lozinka mora sadržavati minimalno 7 znakova!')
                        return;
                    }
                }
                postaviStaruLozinku("")
                postaviLozinku("")
                alert('Vaši su podaci promijenjeni!')
                if (korisnik.username !== korIme) {
                    const kor = await loginAkcije.prijava({
                        username, pass
                    })
                    window.localStorage.setItem('Prijavljeni korisnik', JSON.stringify(kor))
                    if (kor.uloga) {
                    korisniciAkcije.postaviToken(kor.token)
                    }
                }
                navigiraj(0)
                window.location.reload(false)
            } catch {
                alert('Neispravni podaci!')
            }
        }
    }
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
            korisniciAkcije.dohvatiJednog(korisnik.username)
                .then(res => postaviPodatke(res.data.username, res.data.ime,
                    res.data.email, res.data.id, res.data.uloga))
        }
    }, []);
    return (
        <div className="okvir-odmaknut">
            <div>
                <div>
                    <form onSubmit={urediProfil}>
                        <TextInputField naziv={"Korisničko ime"} name={"Username"} value={korIme} method={({ target }) => postaviKorIme(target.value)} />
                        <TextInputField naziv={"Ime"} name={"Ime"} value={ime} method={({ target }) => postaviIme(target.value)} />
                        <TextInputField naziv={"Email"} name={"Email"} value={email} method={({ target }) => postaviEmail(target.value)} />
                        <PassInputField naziv={"Lozinka"} name={"Lozinka"} value={lozinka} method={({ target }) => postaviLozinku(target.value)} />
                        <PassInputField naziv={"Stara Loznika"} name={"oldPass"} value={oldPass} method={({ target }) => postaviStaruLozinku(target.value)} />
                        <p className='text-upozorenja'>Kako bi ste promijenili podatke, ovo polje mora biti popunjeno!</p>
                        <button className="btn-fullsize" type="Submit">Promijeni podatke</button>
                    </form>
                </div>
                <div className="btn-div">
                    <button className='btn-clear' onClick={() => brisi(id)}>Obriši korisnički račun</button>
                </div>
            </div>
        </div>
    );
}

export default Profil;