import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Prijave from './prijave';

test('renderiraj sadrzaj Prijave', () => {
    const kor = 'Testiranje komponente Prijave'
    const table = document.createElement('tbody');
    const komponenta = render(
        <Prijave kor={kor} />
        , {
            container: document.body.appendChild(table)
        }
    );
    expect(komponenta.container).toHaveTextContent('Testiranje komponente Prijave')
})
test('klik na NemojDopustiti poziva event handler', () => {
    const testHandler = jest.fn()
    const kor = 'Testiranje komponente Prijave'
    const provjera = true
    const otvorenost = "NE"
    const dopusteno = true
    const table = document.createElement('tbody');
    const komponenta = render(
        <Prijave kor={kor} provjera={provjera} dopusteno={dopusteno} otvorenost={otvorenost} promijeniDopustenje={testHandler}/>
        , {
            container: document.body.appendChild(table)
        }
    );
    const button = komponenta.getByText("Nemoj Dopustiti")
    fireEvent.click(button)
    expect(komponenta.container).toHaveTextContent('Dopusti')
    expect(testHandler.mock.calls).toHaveLength(1)
})
test('klik na Dopusti poziva event handler', () => {
    const testHandler = jest.fn()
    const kor = 'Testiranje komponente Prijave'
    const provjera = true
    const otvorenost = "NE"
    const dopusteno = false
    const table = document.createElement('tbody');
    const komponenta = render(
        <Prijave kor={kor} provjera={provjera} dopusteno={dopusteno} otvorenost={otvorenost} promijeniDopustenje={testHandler}/>
        , {
            container: document.body.appendChild(table)
        }
    );
    const button = komponenta.getByText("Dopusti")
    fireEvent.click(button)
    expect(testHandler.mock.calls).toHaveLength(1)
})