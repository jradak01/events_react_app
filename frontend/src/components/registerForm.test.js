import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import RegisterForma from './registerForm';
import {BrowserRouter as Router} from 'react-router-dom';
import "jest-location-mock";

test('renderiraj sadrzaj RegisterForma', () => {
    const komponenta = render(
        <RegisterForma/>
    )
    expect(komponenta.container).toHaveTextContent('Registracija')
})

test('<RegisterForma> poziva submit neuspješno', () =>{
    window.alert = jest.fn();
    const komponenta = render(
        <Router> <RegisterForma/></Router>
    )
    const input = komponenta.container.querySelector('[name="Username"]')
    const input2 = komponenta.container.querySelector('[name="Email"]')
    const input3 = komponenta.container.querySelector('[name="Ime"]')
    const input4 = komponenta.container.querySelector('[name="Pass"]')
    const forma = komponenta.container.querySelector('form')
    fireEvent.change(input, {
        target: {value: 'test'}
    })
    fireEvent.change(input2, {
        target: {value: 'test'}
    })
    fireEvent.change(input3, {
        target: {value: 'test'}
    })
    fireEvent.change(input4, {
        target: {value: 'test'}
    })
    fireEvent.submit(forma)
    expect(window.alert).toBeCalledWith('Neispravni podaci! Ili je lozinka kraća od 7 znakova ili je email neispravan ili ime ima manje od 2 znaka ili username postoji!')
})

test('<RegisterForma> poziva submit uspješno', () =>{
    window.alert = jest.fn();
    const komponenta = render(
        <Router> <RegisterForma/></Router>
    )
    const input = komponenta.container.querySelector('[name="Username"]')
    const input2 = komponenta.container.querySelector('[name="Email"]')
    const input3 = komponenta.container.querySelector('[name="Ime"]')
    const input4 = komponenta.container.querySelector('[name="Pass"]')
    const forma = komponenta.container.querySelector('form')
    fireEvent.change(input, {
        target: {value: 'testni'}
    })
    fireEvent.change(input2, {
        target: {value: 'testni@gmail.com'}
    })
    fireEvent.change(input3, {
        target: {value: 'Test'}
    })
    fireEvent.change(input4, {
        target: {value: '12345678'}
    })
    fireEvent.submit(forma)
    expect(jest.isMockFunction(window.location.reload)).toBe(true);
})