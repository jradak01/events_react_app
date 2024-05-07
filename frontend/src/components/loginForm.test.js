import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import LoginForma from './loginForm';
import { TextInputField } from './formFields';
import {BrowserRouter as Router} from 'react-router-dom';
import "jest-location-mock";
test('renderiraj sadrzaj LoginForma', () => {
    const komponenta = render(
        <Router>
        <LoginForma/>
        </Router>
    )
    expect(komponenta.container).toHaveTextContent('Lozinka')
})
test('<LoginForma> poziva submit', () =>{
    window.alert = jest.fn();
    const komponenta = render(
        <Router> <LoginForma/></Router>
    )
    const input = komponenta.container.querySelector('[name="Username"]')
    const input2 = komponenta.container.querySelector('[name="Pass"]')
    const forma = komponenta.container.querySelector('form')
    fireEvent.change(input, {
        target: {value: 'test'}
    })
    fireEvent.change(input2, {
        target: {value: 'testLozinka'}
    })
    fireEvent.submit(forma)
    expect(jest.isMockFunction(window.location.reload)).toBe(true)
    expect(window.alert).not.toBeCalledWith('Neispravni podaci')
})