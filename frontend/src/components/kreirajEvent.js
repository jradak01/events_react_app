import React, { useState } from "react";
import { Modal, ModalFooter } from 'react-bootstrap';
import eventiAkcije from '../services/eventi'
import { useNavigate } from "react-router-dom";
import { preoblikovanoVrijeme } from "./pomocne";
import FormaEvent from './formEvent';

const KreirajEvent = ({ handleClose, show }) => {
    const [naziv, postaviNaziv] = useState('')
    const [tip, postaviTip] = useState('')
    const [mjesto, postaviMjesto] = useState('')
    const [adresa, postaviAdresu] = useState('')
    const [unesenoVrijeme, postaviVrijeme] = useState('')
    const [otvorenost, postaviOtvoreno] = useState("DA")
    const [placanje_, postaviPlacanje] = useState("NE")
    const [cijena, postaviCijenu] = useState('0.00')
    const [opis, postaviOpis] = useState('')
    const navigacija = useNavigate()
    const handleChangeOtvoreno = (event) => {
        postaviOtvoreno(event.target.value)
    }
    const handleChangePlacanje = (event) => {
        postaviPlacanje(event.target.value)
    }
    const createEvent = async (e) => {
        e.preventDefault()
        try {
            const logiraniKorisnikJSON = window.localStorage.getItem(
                "Prijavljeni korisnik"
            );
            if (logiraniKorisnikJSON) {
                const korisnik = JSON.parse(logiraniKorisnikJSON);
                eventiAkcije.postaviToken(korisnik.token);
            }
            const otvoreno = otvorenost === "DA" ? true : false
            const placanje = placanje_ === "DA" ? true : false
            const vrijeme = preoblikovanoVrijeme(unesenoVrijeme)
            const noviEvent = await eventiAkcije.stvori({
                naziv, tip, mjesto, adresa, vrijeme, otvoreno, placanje, cijena, opis
            })
            navigacija(0)
        } catch {
            alert('Neispravni podaci')
        }
    }
    return (
        <div>
            <Modal show={show} size="lg" onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <FormaEvent naslov="Kreiraj svoj event!" metoda={createEvent}
                        naziv={naziv} promjenaNaziva={({ target }) => postaviNaziv(target.value)}
                        tip={tip} promjenaTipa={({ target }) => postaviTip(target.value)}
                        mjesto={mjesto} promjenaMjesta={({ target }) => postaviMjesto(target.value)}
                        adresa={adresa} promjenaAdrese={({ target }) => postaviAdresu(target.value)}
                        vrijeme={unesenoVrijeme} promjenaVremena={({ target }) => postaviVrijeme(target.value)}
                        otvorenost={otvorenost} handleChangeOtvoreno={handleChangeOtvoreno}
                        placanje={placanje_} handleChangePlacanje={handleChangePlacanje}
                        cijena={cijena} promjenaCijene={({ target }) => postaviCijenu(target.value)}
                        opis={opis} promjenaOpisa={({ target }) => postaviOpis(target.value)}
                        gumb={"Kreiraj"}
                    />
                </Modal.Body>
                <ModalFooter></ModalFooter>
            </Modal>
        </div >
    );
}

export default KreirajEvent;