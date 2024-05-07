import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import FormaEvent from './formEvent';

test('renderiraj sadrzaj FormEvent', () => {
    const naslov= "test"
    const komponenta = render(
            <FormaEvent naslov={naslov}/>   
    )
    expect(komponenta.container).toHaveTextContent('test')
})
test('<FormaEvent> poziva onSubmit i mijenja stanje roditelja', () => {
    const metoda= jest.fn()
    const naslov='test'
    const naziv='testiram'
    const komponenta = render(
            <FormaEvent metoda={metoda} naslov={naslov} naziv={naziv}/>   
    )
    const forma = komponenta.container.querySelector('form')
    fireEvent.submit(forma)
    expect(metoda.mock.calls).toHaveLength(1)
})