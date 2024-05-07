import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Dogadaj from './dogadaj';
import { BrowserRouter as Router } from 'react-router-dom';
import "jest-location-mock";

test('renderiraj sadrzaj Dogadaj', () => {
    const vrijeme = '2022-08-25T23:59:29.516Z'
    const korisnik = {
        username: "test",
        email: "test@gamil.com",
        uloga: "korisnik"
    }
    const kreator = {
        username: "test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const naziv = "test"
    const table = document.createElement('tbody');
    const {container} = render(
        <Router>
            <Dogadaj vrijeme={vrijeme} korisnik={korisnik} kreator={kreator} naziv={naziv}/>   
        </Router>
    ,{
        container: document.body.appendChild(table)
    });
    expect(container).toHaveTextContent('test')
})
test('klik na Prijava poziva event handler', () => {
    const testHandler = jest.fn()
    const vrijeme = '2022-08-25T23:59:29.516Z'
    const korisnik = {
        username: "test",
        email: "test@gamil.com",
        uloga: "korisnik"
    }
    const kreator = {
        username: "test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const naziv = "test"
    const table = document.createElement('tbody');
    const komponenta = render(
        <Router>
            <Dogadaj prijava={testHandler} vrijeme={vrijeme} korisnik={korisnik} kreator={kreator} naziv={naziv}/>   
        </Router>
    ,{
        container: document.body.appendChild(table)
    });
    const button = komponenta.getByText('Prijava')
    fireEvent.click(button)
    expect(komponenta.container).toHaveTextContent('Odjava')
    expect(testHandler.mock.calls).toHaveLength(1)
})
test('klik na Odjava poziva event handler', () => {
    const testHandler = jest.fn()
    const handler = jest.fn()
    const vrijeme = '2022-08-25T23:59:29.516Z'
    const korisnik = {
        username: "test",
        email: "test@gamil.com",
        uloga: "korisnik"
    }
    const kreator = {
        username: "test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const naziv = "test"
    const table = document.createElement('tbody');
    const komponenta = render(
        <Router>
            <Dogadaj brisiPrijavu={testHandler} prijava={handler} vrijeme={vrijeme} korisnik={korisnik} kreator={kreator} naziv={naziv}/>   
        </Router>
    ,{
        container: document.body.appendChild(table)
    });
    const button = komponenta.getByText('Prijava')
    fireEvent.click(button)
    const button2 = komponenta.getByText('Odjava')
    fireEvent.click(button2)
    expect(komponenta.container).toHaveTextContent('Prijava')
    expect(testHandler.mock.calls).toHaveLength(1)
})
test('klik na Detalji poziva event handler', () => {
    const vrijeme = '2022-08-25T23:59:29.516Z'
    const korisnik = {
        username: "test",
        email: "test@gamil.com",
        uloga: "korisnik"
    }
    const kreator = {
        username: "test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const naziv = "test"
    const table = document.createElement('tbody');
    const komponenta = render(
        <Router>
            <Dogadaj vrijeme={vrijeme} korisnik={korisnik} kreator={kreator} naziv={naziv}/>   
        </Router>
    ,{
        container: document.body.appendChild(table)
    });
    const button = komponenta.getByText('Detalji')
    fireEvent.click(button)
    expect(jest.isMockFunction(window.location.reload)).toBe(true)
})