import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import Pocetna from './pocetna';
import {BrowserRouter as Router} from 'react-router-dom';

test('renderiraj sadrzaj Pocetna', () => {
    const komponenta = render(
        <Pocetna/>
    )
    expect(komponenta.container).toHaveTextContent('Zabavi se')
})