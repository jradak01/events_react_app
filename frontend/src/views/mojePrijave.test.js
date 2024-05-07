import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import MojePrijave from './mojePrijave';
import { BrowserRouter as Router } from 'react-router-dom';

test('renderiraj sadrzaj MojePrijave', () => {
    const komponenta = render(
        <Router>
            <MojePrijave />
        </Router>
    )
    expect(komponenta.container).toHaveTextContent('Eventi koje planiram posjetiti')
})