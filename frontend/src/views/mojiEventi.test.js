import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import MojiEventi from './mojiEventi';
import { BrowserRouter as Router } from 'react-router-dom';

test('renderiraj sadrzaj MojiEventi', () => {
    const komponenta = render(
        <Router>
            <MojiEventi />
        </Router>
    )
    expect(komponenta.container).toHaveTextContent('Nadolazeći eventi')
})