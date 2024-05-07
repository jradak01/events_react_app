import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Login from './login';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Komponenta <Login />', () => {
    let komponenta
    beforeEach(() => {
        komponenta = render(
            <Router>
                <Login />
            </Router>
        )
    })

    test('renderiranje djece', () => {
        expect(
            komponenta.container.querySelector('.testDiv')
        ).not.toBeFalsy()
    })
    test('na početku drugi div nije prikazan', () => {
        const div = komponenta.container.querySelector('.promjenjivSadrzaj2')
        expect(div).toHaveStyle('display: none')
    })
    test('prikazuje se drugi div', () => {
        const div = komponenta.container.querySelector('.promjenjivSadrzaj')
        const button = komponenta.container.querySelector('.btn-clear-blue')
        fireEvent.click(button)
        expect(div).toHaveStyle('display: none')
    })
    test('prikazani sadrzaj se moze sakriti', () =>{
        const button = komponenta.container.querySelector('.btn-clear-blue')
        fireEvent.click(button)
        const odustaniButton = komponenta.container.querySelector('.btn-clear-blue:nth-child(2)')
        fireEvent.click(odustaniButton)
        const div = komponenta.container.querySelector('.promjenjivSadrzaj')
        const div2 = komponenta.container.querySelector('.promjenjivSadrzaj2')
        expect(div2).toHaveStyle('display: none')
        expect(div).not.toHaveStyle('display: none')
    }) 

})
