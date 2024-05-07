import React, { useState } from "react";
import LoginForma from "../components/loginForm";
import RegisterForma from "../components/registerForm";

import "../components/style.css";
import "../components/buttons.css"

const Login = () => {
    const [loginVidljiv, postaviLoginVidljiv] = useState(true)
    const prikaziLogin = { display: loginVidljiv ? '' : 'none' }
    const sakrijLogin = { display: loginVidljiv ? 'none' : '' }
    return (
        <div className="testDiv">
            <div style={prikaziLogin}  className="promjenjivSadrzaj">
                <LoginForma />
                <div className="btn-div">
                    <button className="btn-clear-blue" name='Registracija' onClick={() => postaviLoginVidljiv(false)}>
                            Registracija
                    </button>
                </div>
            </div>
            <div style={sakrijLogin} className='promjenjivSadrzaj2'>
                <div className="btn-div">
                    <RegisterForma postaviLogin={postaviLoginVidljiv} />
                    <button className="btn-clear-blue" onClick={() => postaviLoginVidljiv(true)}>
                            Prijava
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;