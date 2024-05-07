import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'
import {TextInputField, EmailInputField, PassInputField, RadioButtonField, TimeInputField} from './formFields';

test('renderiraj sadrzaj TextInputField', () => {
	const naziv='Testiranje komponente TextInputField'
    const komponenta = render(
        <TextInputField naziv={naziv} />
    )
 expect(komponenta.container).toHaveTextContent('Testiranje komponente TextInputField')
})
test('renderiraj sadrzaj EmailInputField', () => {
	const naziv='Testiranje komponente EmailInputField'
    const komponenta = render(
        <EmailInputField naziv={naziv} />
    )
 expect(komponenta.container).toHaveTextContent('Testiranje komponente EmailInputField')
})
test('renderiraj sadrzaj PassInputField', () => {
	const naziv='Testiranje komponente PassInputField'
    const komponenta = render(
        <PassInputField naziv={naziv} />
    )
    expect(komponenta.container).toHaveTextContent('Testiranje komponente PassInputField')
})
test('renderiraj sadrzaj RadioButtonField', () => {
	const naziv='Testiranje komponente RadioButtonField'
    const change=jest.fn()
    const komponenta = render(
        <RadioButtonField naziv={naziv} change={change} />
    )
    const element = komponenta.getByText('Testiranje komponente RadioButtonField:')
    expect(element).toBeDefined()
    //expect(komponenta.container).toHaveTextContent('Testiranje komponente RadioButtonField')
})
test('renderiraj sadrzaj TimeInputField', () => {
	const naziv='Testiranje komponente TimeInputField'
    const komponenta = render(
        <TimeInputField naziv={naziv} />
    )
    const div = komponenta.container.querySelector('.input-text-form')
    expect(div).toHaveTextContent('Testiranje komponente TimeInputField')
})