import React, { useState } from "react";
import "./forms.css";
import "./style.css"
import "./buttons.css"
import prijavaAkcije from "../services/login";
import eventiAkcije from "../services/eventi";
import korisniciAkcije from '../services/korisnici';
import { useNavigate } from "react-router-dom";
import {TextInputField, PassInputField} from './formFields';

const LoginForma = () => {
    const [username, postaviUsername] = useState('')
    const [pass, postaviPass] = useState('')
    const pocetna = useNavigate()

    const userLogin = async (e) => {
        e.preventDefault()
        try {
            const kor = await prijavaAkcije.prijava({
                username, pass
            })
            postaviUsername('')
            postaviPass('')
            eventiAkcije.postaviToken(kor.token)
            window.localStorage.setItem('Prijavljeni korisnik', JSON.stringify(kor))
            if (kor.uloga) {
                korisniciAkcije.postaviToken(kor.token)
            }
            pocetna('/')
            window.location.reload(false)
        } catch (exception) {
            alert('Neispravni podaci')
        }
    }
    return (
        <div>
            <div className="okvir-odmaknut" >
                <div className="form-div">
                    <form onSubmit={userLogin} className='loginForma'>
                        <h4>Prijava</h4>
                        <TextInputField naziv={"Korisničko ime"} name={'Username_'} id='username' value={username} method={(event) => postaviUsername(event.target.value)} />
                        <PassInputField naziv={"Lozinka"} name={'Pass_'} value={pass} method={(event) => postaviPass(event.target.value)} />
                        <button className="btn-fullsize" name='Prijava' type='submit' href='/'>Prijava</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default LoginForma;