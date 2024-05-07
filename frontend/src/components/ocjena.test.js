import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import Ocjena from './ocjena';

test('renderiraj sadrzaj Ocjena', () => {
    const komponenta = render(
        <Ocjena/>
    )
    expect(komponenta.container).toHaveTextContent('★★★★★')
})

test('klik poziva event handler', () => {
    const testHandler = jest.fn()
    const komponenta = render(
    <Ocjena rating={2} setRating={testHandler} />
    )
    const button = komponenta.container.querySelector('button')
    fireEvent.click(button)
    expect(testHandler.mock.calls).toHaveLength(1)
})
test('doubleklik poziva event handler', () => {
    const testHandler = jest.fn()
    const komponenta = render(
    <Ocjena rating={2} setRating={testHandler}/>
    )
    const button = komponenta.container.querySelector('button')
    fireEvent.doubleClick(button)
    expect(testHandler.mock.calls).toHaveLength(1)
})