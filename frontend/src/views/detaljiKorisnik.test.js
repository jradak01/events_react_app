import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import DetaljiKorisnik from './detaljiKorisnik';
import {BrowserRouter as Router} from 'react-router-dom';

test('renderiraj sadrzaj Korisnik', () => {
    const komponenta = render(
        <Router>
        <DetaljiKorisnik/>
        </Router>
    )
    expect(komponenta.container).toHaveTextContent('Uloga')
})