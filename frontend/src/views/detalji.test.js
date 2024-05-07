import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import Detalji from './detalji';
import {BrowserRouter as Router} from 'react-router-dom';

test('renderiraj sadrzaj Korisnik', () => {
    const komponenta = render(
        <Router>
        <Detalji/>
        </Router>
    )
    expect(komponenta.container).toHaveTextContent('Tip')
})