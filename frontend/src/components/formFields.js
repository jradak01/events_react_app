import React from 'react'
import "./forms.css";

const TextInputField = ({naziv, name, value, method}) =>{
    return(
        <div className="input-div">
        <div className="input-text-form">{naziv}:</div>
            <input className="input-form" type='text' name={name} value={value} 
                onChange={method} />
        </div>
    );
}
const EmailInputField = ({naziv, name, value, method}) =>{
    return(
        <div className="input-div">
        <div className="input-text-form">{naziv}:</div>
            <input className="input-form" type='email' name={name} value={value} 
                onChange={method} />
        </div>
    );
}
const PassInputField = ({naziv, name, value, method}) =>{
    return(
        <div className="input-div">
        <div className="input-text-form">{naziv}:</div>
            <input className="input-form" type='password' name={name} value={value} 
                onChange={method} />
        </div>
    );
}
const RadioButtonField = ({naziv, tip1, tip2, checked1, checked2, name, change}) =>{
    return(
        <div className="input-div">
        <div className="input-text-form">{naziv}:</div>
            <input className="radio-form" value={tip1} checked={checked1} type="radio" name={name} onChange={change} ></input><span className="input-text-form">{tip1}</span>
            <input className="radio-form" value={tip2} checked={checked2} type="radio" name={name} onChange={change} ></input><span className="input-text-form">{tip2}</span>
        </div>
    );
}
const TimeInputField = ({naziv, name, value, method}) =>{
    return(
        <div className="input-div">
        <div className="input-text-form">{naziv}</div>
            <input className="input-form" type='datetime-local' name={name} value={value} 
                onChange={method} />
        </div>
    );
}

export {TextInputField, EmailInputField, PassInputField, RadioButtonField, TimeInputField};