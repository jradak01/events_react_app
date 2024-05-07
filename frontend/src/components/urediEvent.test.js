import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import UrediEvent from './urediEvent';
import {BrowserRouter as Router} from 'react-router-dom';
import "jest-location-mock";

const mockChildComponent = jest.fn();
jest.mock("./formEvent", () => (props) => {
  mockChildComponent(props);
  return <mock-childComponent />;
});
test("Poziva se Child komponenta", () => {
    const show=true
    const komponenta=render(
    <Router>
        <UrediEvent show={show}/>
        </Router>
    );
    expect(mockChildComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        naslov: "Kreiraj svoj event!"
      })
    );
  });
  
  test("Child Komponenta se ne poziva ako joj se ne pošalju parametri", () => {
    const komponenta=render(
    <Router>
        <UrediEvent/>
    </Router>
    );
    expect(mockChildComponent).not.toHaveBeenCalled();
  });