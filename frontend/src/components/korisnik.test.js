import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Korisnik from './korisnik';
import { BrowserRouter as Router } from 'react-router-dom';

test('renderiraj sadrzaj Korisnik', () => {
    const ime = 'Testiranje komponente Korisnik'
    const username = "test"
    const uloga='korisnik'
    const korisnik = {
        username:"test",
        email:"test@gamil.com",
        uloga: "masteradmin"
    }
    const table = document.createElement('tbody');
    const komponenta = render(
        <Router>
            <Korisnik ime={ime} username={username} uloga={uloga} korisnik={korisnik} />
        </Router>
    ,{
        container: document.body.appendChild(table)
    });
    const td = komponenta.container.querySelector('.td')
    expect(td).toHaveTextContent('Testiranje komponente Korisnik')
})

test('klik na Brisi poziva event handler', () => {
    const testHandler = jest.fn()
    const ime = 'Testiranje komponente Korisnik'
    const username = "test"
    const uloga='korisnik'
    const korisnik = {
        username:"test",
        email:"test@gamil.com",
        uloga: "masteradmin"
    }
    const table = document.createElement('tbody');
    const komponenta = render(
        <Router>
            <Korisnik ime={ime} username={username}  uloga={uloga} korisnik={korisnik} brisi={testHandler} />
        </Router>
    ,{
        container: document.body.appendChild(table)
    });
    const button = komponenta.getByText('Briši')
    fireEvent.click(button)
    expect(testHandler.mock.calls).toHaveLength(1)
})
test('klik na Promijeni poziva event handler', () => {
    const testHandler = jest.fn()
    const ime = 'Testiranje komponente Korisnik'
    const username = "test"
    const uloga = "korisnik"
    const korisnik = {
        username:"test",
        email:"test@gamil.com",
        uloga: "masteradmin"
    }
    const table = document.createElement('tbody');
    const komponenta = render(
        <Router>
            <Korisnik ime={ime} username={username} id={"12345"} uloga={uloga} korisnik={korisnik} promijeniUlogu={testHandler} />
        </Router>
    ,{
        container: document.body.appendChild(table)
    });
    const button = komponenta.getByText('Promijeni')
    fireEvent.click(button)
    expect(testHandler.mock.calls).toHaveLength(1)
})
const mockedUsedNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockedUsedNavigate,
}));
test('klik na username poziva event handler', () => {
    const ime = 'Testiranje komponente Korisnik'
    const username = "test"
    const uloga='korisnik'
    const korisnik = {
        username:"test",
        email:"test@gamil.com",
        uloga: "masteradmin"
    }
    const table = document.createElement('tbody');
    const komponenta = render(
        <Router>
            <Korisnik ime={ime} username={username} uloga={uloga} korisnik={korisnik} />
        </Router>
    ,{
        container: document.body.appendChild(table)
    });
    const button = komponenta.getByText(username)
    fireEvent.click(button)
    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
})
