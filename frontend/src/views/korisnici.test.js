import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Korisnici from './korisnici';
import { BrowserRouter as Router } from 'react-router-dom';

test('renderiraj sadrzaj Korisnici', () => {
    const komponenta = render(
        <Router>
            <Korisnici />
        </Router>
    )
    const table = komponenta.container.querySelector('table')
    expect(table.className).toBe('table-cont table table-striped table-hover')
})
test('input field mijenja vrijendost', () => {
    const komponenta = render(
        <Router>
            <Korisnici />
        </Router>
    )

    const input = komponenta.container.querySelector('input')
    fireEvent.change(input, {
        target: {value: 'test'}
    })
    expect(input).toHaveValue('test')
})