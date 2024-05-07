import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import Profil from './Profil';
import {BrowserRouter as Router} from 'react-router-dom';
import "jest-location-mock";

test('renderiraj sadrzaj Profil', () => {
    const komponenta = render(
        <Router>
        <Profil/>
        </Router>
    )
    expect(komponenta.container).toHaveTextContent('Obriši korisnički račun')
})
test("poziva onSubmit i mijenja stanje ", () => {
    window.alert = jest.fn();
    const komponenta=render(
        <Router>
                <Profil/>
        </Router>
    );
    const input = komponenta.container.querySelector('[name="Ime"]')
    const input2 = komponenta.container.querySelector('[name="oldPass"]')
    const forma = komponenta.container.querySelector('form')
    
    fireEvent.change(input, {
        target: {value: 'test'}
    })
    fireEvent.change(input2, {
        target: {value: 'testiranje forme nije jednostavno'}
    })
    fireEvent.submit(forma)   
    expect(jest.isMockFunction(window.location.reload)).toBe(true)
    expect(window.alert).toBeCalledWith('Neispravni podaci!')
});
test("poziva onSubmit i ne mijenja stanje ", () => {
    window.alert = jest.fn();
    const komponenta=render(
        <Router>
                <Profil/>
        </Router>
    );
    const input = komponenta.container.querySelector('[name="Ime"]')
    const forma = komponenta.container.querySelector('form')
    
    fireEvent.change(input, {
        target: {value: 'test'}
    })
    fireEvent.submit(forma)   
    expect(window.alert).toBeCalledWith('Niste unijeli sva tražena polja!')
});
test("poziva onSubmit i mijenja stanje2 ", () => {
    const komponenta=render(
        <Router>
                <Profil/>
        </Router>
    );
    const input = komponenta.container.querySelector('[name="Ime"]')
    const input2 = komponenta.container.querySelector('[name="oldPass"]')
    const input3 = komponenta.container.querySelector('[name="Username"]')
    const input4 = komponenta.container.querySelector('[name="Email"]')
    const input5 = komponenta.container.querySelector('[name="Lozinka"]')
    const forma = komponenta.container.querySelector('form')
    
    fireEvent.change(input, {
        target: {value: 'test'}
    })
    fireEvent.change(input2, {
        target: {value: 'testiranje forme nije jednostavno'}
    })
    fireEvent.change(input3, {
        target: {value: 'testni'}
    })
    fireEvent.change(input4, {
        target: {value: 'test@gmail.com'}
    })
    fireEvent.change(input5, {
        target: {value: 'novalozinka'}
    })
    fireEvent.submit(forma)   
    expect(jest.isMockFunction(window.location.reload)).toBe(true)
});
test("Klik na briši poziva eventHandler", () => {
    window.confirm = jest.fn();
    const komponenta = render(
        <Router>
        <Profil/>
        </Router>
    )
    const button = komponenta.getByText('Obriši korisnički račun')
    fireEvent.click(button)
    expect(window.confirm).toBeCalledWith('Jeste li sigurni da želite izbrisati korisnički račun?')
})