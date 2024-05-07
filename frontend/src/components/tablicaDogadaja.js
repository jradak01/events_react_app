import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const TablicaDogadaja = ({ id, naziv, tip, mjesto, vrijeme, otvoreno, placanje }) => {
    const preusmjeri = useNavigate()
    const otvorenost = otvoreno ? "DA" : "NE"
    const zaPlatiti = placanje ? "DA" : "NE"
    const prikaziDetalje = () => {
        preusmjeri(`/detalji/${id}`)
        window.location.reload(false)
    }
    return (
        <tr className='test-tr'>
            <td>{naziv}</td>
            <td>{tip}</td>
            <td>{mjesto}</td>
            <td>{vrijeme.substring(1,16)}</td>
            <td>{otvorenost}</td>
            <td>{zaPlatiti}</td>
            <td><Button variant="primary" onClick={() => prikaziDetalje()}>Detalji</Button></td>
        </tr>
    );
}
export default TablicaDogadaja;