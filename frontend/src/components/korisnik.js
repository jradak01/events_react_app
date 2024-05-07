import React from 'react';
import { Button } from 'react-bootstrap';
import { provjeraAdmina, provjeraMastera } from './pomocne';
import { useNavigate } from "react-router-dom";
import './style.css'
import './buttons.css';

const Korisnik = ({ id, username, ime, email, uloga, korisnik, promijeniUlogu, brisi }) => {
    const navigacija = useNavigate()
    return (
        <tr>
            <td>
                <button className='btn-clear' onClick={() => navigacija(`/detaljikorisnik/${username}`)} >{username}</button>
            </td>
            <td className='td'>{ime}</td>
            <td>{email}</td>
            <td>{uloga}</td>
            {provjeraMastera(korisnik, uloga)?
                <td>
                    <Button variant="primary" onClick={() => promijeniUlogu(id, uloga)}>Promijeni</Button>
                </td> : <td></td> }
            {provjeraAdmina(korisnik, uloga)?
                <td><Button variant="danger" onClick={() => brisi(id)}>Briši</Button></td>
                : <td></td>
            }
        </tr>
    );
}

export default Korisnik;