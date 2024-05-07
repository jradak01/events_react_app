import React from 'react'
import "./forms.css";
import "./buttons.css"
import {TextInputField, RadioButtonField, TimeInputField} from './formFields';

const FormaEvent = ({naslov, metoda, naziv, promjenaNaziva, tip, promjenaTipa, mjesto, 
    promjenaMjesta, adresa, promjenaAdrese, vrijeme, promjenaVremena,
    otvorenost, handleChangeOtvoreno, placanje, handleChangePlacanje,
    cijena, promjenaCijene, opis, promjenaOpisa, gumb}) => {
        return(
            <form onSubmit={metoda} style={{boxShadow: 'none'}}>
                <h3 className='naslov'>{naslov}</h3>
                <TextInputField naziv={"Naziv"} name={'Naziv'} value={naziv} method={promjenaNaziva} />
                <TextInputField naziv={"Tip"} name={"Tip"} value={tip} method={promjenaTipa} />
                <TextInputField naziv={"Mjesto"} name={"Mjesto"} value={mjesto} method={promjenaMjesta} />
                <TextInputField naziv={"Adresa"} name={"Adresa"} value={adresa} method={promjenaAdrese} />
                <TimeInputField naziv={"Vrijeme"} name={"Vrijeme"} value={vrijeme} method={promjenaVremena} />
                <RadioButtonField naziv={"Otvoreno"} tip1="DA" tip2="NE" checked1={otvorenost==="DA"} checked2={otvorenost==="NE"} name={"odabirOtvorenosti"} change={handleChangeOtvoreno}/>
                <RadioButtonField naziv={"Plačanje"} tip1="DA" tip2="NE" checked1={placanje==="DA"} checked2={placanje==="NE"} name={"odabirPlacanja"} change={handleChangePlacanje}/>
                <TextInputField naziv={"Cijena"} name={'Cijena'} value={cijena} method={promjenaCijene} />
                <TextInputField naziv={"Opis"} name={'Opis'} value={opis} method={promjenaOpisa} />
                <button className="btn-fullsize" type='submit'>{gumb}</button>
            </form>
    );
}

export default FormaEvent;