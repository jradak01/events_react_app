import React, { useState } from 'react'
import { Button } from 'react-bootstrap';

const Prijave = ({ id, kor, dopusteno, otvorenost, ocjena, vrijeme, provjera, promijeniDopustenje }) => {
    const [dopustenje, promijeniDopusteno] = useState(dopusteno)
    return (
        <tr>
            <td>{kor}</td>
            {provjera ?
            <td>{otvorenost === "NE" ? <Button variant="primary" onClick={promijeniDopustenje}>{dopustenje ? "Nemoj Dopustiti" : "Dopusti"}</Button> : "Ovaj događaj je otvorenog tipa!"}</td>:""}
            <td>{ocjena}</td>
        </tr>
    );
}
export default Prijave;