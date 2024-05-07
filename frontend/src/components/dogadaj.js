import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap';
import UrediEvent from './urediEvent'
import { useNavigate } from "react-router-dom";
import prijaveAkcije from '../services/prijave'
import {
    ispisBoolVrijednosti,
    provjera, provjeraPrijave, provjeraUredenje, postaviIspisDopustenog
} from './pomocne'

const Dogadaj = ({ id, naziv, tip, mjesto, vrijeme, otvoreno, placanje,
    kreator, korisnik, brisi, prijava, brisiPrijavu, dopusteno, ispis }) => {
    const preusmjeri=useNavigate()
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [prijavljen, postaviPrijavljen] = useState(false)
    const prikaziDetalje = () => {
        preusmjeri(`/detalji/${id}`)
        window.location.reload(false)
    }
    const PostaviPrijavljenEvent = (korisnik, data) => {
        if (korisnik != null) {
            const postoji = data.filter(pr => pr.prKorisnik.id === korisnik.id)
            if (postoji.length > 0) {
                postaviPrijavljen(true)
            } else {
                postaviPrijavljen(false)
            }
        } else {
            postaviPrijavljen(false)
        }
    }
    const brisiPrijavu_ = () => {
        postaviPrijavljen(false)
        brisiPrijavu()
    }
    const prijava_ = () => {
        postaviPrijavljen(true)
        prijava()
    }
    useEffect(() => {
        prijaveAkcije.dohvatiSveNaJedan(id)
            .then((res) => {
                PostaviPrijavljenEvent(korisnik, res.data)
            })
    }, []);
    return (
        <tr>
            <td>{naziv}</td>
            <td>{tip}</td>
            <td>{mjesto}</td>
            <td>{vrijeme.substring(1,16)}</td>
            <td>{ispisBoolVrijednosti(otvoreno)}</td>
            <td>{ispisBoolVrijednosti(placanje)}</td>
            <td>{kreator.username}</td>
            {ispis !== undefined ? <td>{postaviIspisDopustenog(dopusteno)}</td> : ""}
            <td><Button className='Detalji' variant="primary" onClick={prikaziDetalje}>Detalji</Button></td>
            {provjeraPrijave(korisnik, kreator) ?
                <td>{prijavljen ?
                    <Button variant='primary' onClick={() => brisiPrijavu_()}>Odjava</Button>
                    : <Button variant='primary' onClick={() => prijava_()}>Prijava</Button>
                }</td>
                : ''
            }
            {provjeraUredenje(korisnik, kreator) ?
               <td>
                <Button variant='success' onClick={handleShow}>Uredi</Button>
                <UrediEvent show={show} handleShow={handleShow} handleClose={handleClose} id={id} />
                </td>
                : ''
            }
            {provjera(korisnik, kreator) ?
                <td><Button variant="danger" onClick={brisi}>Briši</Button></td> : <td></td>}
        </tr>
    );
}
export default Dogadaj;