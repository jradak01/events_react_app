import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import GotovDogadaj from './gotovdogadaj';
import {BrowserRouter as Router} from 'react-router-dom';

test('renderiraj sadrzaj GotovDogadaj', () => {
    const naziv='Testiranje komponente GotovDogadaj'
    const vrijeme= '2022-08-25T23:59:29.516Z'
    const korisnik = {
        username:"test",
        email:"test@gamil.com",
        uloga: "korisnik"
    }
    const kreator = {
        username:"test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const table = document.createElement('tbody');
    const komponenta = render(
        <Router>
        <GotovDogadaj naziv={naziv} dopusteno="DA" vrijeme={vrijeme}  korisnik={korisnik} kreator={kreator}/>
        </Router>
    ,{
        container: document.body.appendChild(table)
    });
    expect(komponenta.container).toHaveTextContent('Testiranje komponente GotovDogadaj')
})

test('klik na Podnesi poziva event handler', () => {
    const testHandler = jest.fn()
    const naziv='Testiranje komponente GotovDogadaj'
    const vrijeme= '2022-08-25T23:59:29.516Z'
    const korisnik = {
        username:"test",
        email:"test@gamil.com",
        uloga: "korisnik"
    }
    const kreator = {
        username:"test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const table = document.createElement('tbody');
    const komponenta = render(
        <Router>
        <GotovDogadaj naziv={naziv} dopusteno="DA" vrijeme={vrijeme}  korisnik={korisnik} kreator={kreator} postavi={testHandler}/>
        </Router>
    ,{
        container: document.body.appendChild(table)
    });
    const button = komponenta.getByText('Podnesi')
    fireEvent.click(button)
    expect(testHandler.mock.calls).toHaveLength(1)
})