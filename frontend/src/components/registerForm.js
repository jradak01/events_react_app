import React, { useState } from "react";
import "./forms.css";
import './style.css';
import './buttons.css'
import { TextInputField, PassInputField, EmailInputField } from './formFields';
import korisniciAkcije from '../services/korisnici';
import {provjeraEmaila, provjeraDuzineLozinke, provjeraImena, provjeraUsernameDuzina} from './pomocne'
const RegisterForma = () => {
    const [username, postaviUsername] = useState('')
    const [ime, postaviIme] = useState('')
    const [email, postaviEmail] = useState('')
    const [pass, postaviPass] = useState('')
    const [provjeri, postaviProvjeru] = useState([])
    const provjeraUsernamePostoji = (username) => {
        korisniciAkcije.dohvatiJednog(username)
            .then(res => postaviProvjeru(res.data))
    }
    const userRegister = async (e) => {
        e.preventDefault()
        try {
            if(provjeraEmaila(email)!=='' || provjeraDuzineLozinke(pass)!=='' 
            || provjeraImena(ime)!=='' || provjeraUsernameDuzina(username)){
                alert('Neispravni podaci! Ili je lozinka kraća od 7 znakova ili je email neispravan ili ime ima manje od 2 znaka ili username postoji!')
                return;
            }
            const kor = await korisniciAkcije.stvori({
                username, pass, ime, email
            })
            postaviUsername('');
            postaviIme('');
            postaviEmail('');
            postaviPass('');
            alert('Uspješno ste se registrirali!')
            window.location.reload(true)
        } catch (exception) {
            alert('Neispravni podaci')
        }
    }
    return (
        <div className="okvir-odmaknut">
            <div className="form-div">
                <form onSubmit={userRegister}>
                    <h4>Registracija</h4>
                    <TextInputField naziv={"Korisničko ime"} name={'Username'} value={username} method={(event) => postaviUsername(event.target.value)} />
                    <EmailInputField naziv={"Email"} name={'Email'} value={email} method={(event) => postaviEmail(event.target.value)} />
                    <TextInputField naziv={"Ime"} name={'Ime'} value={ime} method={(event) => postaviIme(event.target.value)} />
                    <PassInputField naziv={"Lozinka"} name={'Pass'} value={pass} method={(event) => postaviPass(event.target.value)} />
                    <button className="btn-fullsize" name='Registracija_' type='submit'>Registracija</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterForma;