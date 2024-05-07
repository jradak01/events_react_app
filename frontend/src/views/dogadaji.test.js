import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import Dogadaji from './dogadaji';
import {BrowserRouter as Router} from 'react-router-dom';

test('renderiraj sadrzaj Korisnik', () => {
    const komponenta = render(
        <Router>
        <Dogadaji/>
        </Router>
    )
    expect(komponenta.container).toHaveTextContent('Naziv')
})