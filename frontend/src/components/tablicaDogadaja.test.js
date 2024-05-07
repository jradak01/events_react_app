import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import TablicaDogadaja from './tablicaDogadaja';
import {BrowserRouter as Router} from 'react-router-dom';
import "jest-location-mock";

test('renderiraj sadrzaj TablicaDogadaja', () => {
    const naziv='test'
    const vrijeme = '2022-08-25T23:59:29.516Z'
    const table = document.createElement('tbody');
    const komponenta = render(
        <Router>
            <TablicaDogadaja vrijeme={vrijeme} naziv={naziv}/>
        </Router>
    ,{
        container: document.body.appendChild(table)
    });
    expect(komponenta.container).toHaveTextContent('test')    
})

test('klik poziva event handler', () => {
    const naziv='test'
    const vrijeme = '2022-08-25T23:59:29.516Z'
    const table = document.createElement('tbody');
    const komponenta = render(
        <Router>
            <TablicaDogadaja vrijeme={vrijeme} naziv={naziv}/>
        </Router>
    ,{
        container: document.body.appendChild(table)
    });
    const button = komponenta.getByText('Detalji')
    fireEvent.click(button)
    expect(jest.isMockFunction(window.location.reload)).toBe(true);
})