import React, { useState, useEffect } from "react";
import { BsPlusLg } from "react-icons/bs";
import { Button, Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Login from './views/login';
import Dogadaji from './views/dogadaji'
import Korisnici from "./views/korisnici";
import MojiEventi from "./views/mojiEventi";
import MojePrijave from "./views/mojePrijave";
import Detalji from "./views/detalji";
import Pocetna from "./views/pocetna";
import Profil from "./views/profil";
import DetaljiKorisnik from "./views/detaljiKorisnik";
import KreirajEvent from "./components/kreirajEvent";

const App = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [korisnik, postaviKorisnika] = useState(null)
  const logout = () => {
    window.localStorage.clear()
  }
  const postaviLinkove = (kor, element_) => {
    if (korisnik.uloga === kor || korisnik.uloga === "master" + kor) {
      return element_;
    }
  }
  const preusmjeri = (korisnik, element_) => {
    if (korisnik.uloga === "admin" || korisnik.uloga === "masteradmin") {
      return element_;
    }
    else {
      return <Pocetna />
    }
  }
  useEffect(() => {
    const logiraniKorisnikJSON = window.localStorage.getItem(
      "Prijavljeni korisnik"
    );
    if (logiraniKorisnikJSON) {
      const korisnik = JSON.parse(logiraniKorisnikJSON);
      postaviKorisnika(korisnik);
    }
  }, []);
  return (
    <Router>
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/">Eventi</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/dogadaji">Istaži</Nav.Link>
                {korisnik === null ? "" : postaviLinkove("admin",
                  <Nav.Link name='korisnici' href="/korisnici">Korisnici</Nav.Link>)
                }
                {korisnik === null ? "" : postaviLinkove("korisnik",
                  <Nav.Link href="/mojidogadaji">Moji Eventi</Nav.Link>)
                }
                {korisnik === null ? "" : postaviLinkove("korisnik",
                  <Nav.Link href="/mojeprijave">Moje Prijave</Nav.Link>)
                }
              </Nav>
              <Nav>
                {korisnik === null ?
                  <Nav.Link eventKey={2} href="/login">Login</Nav.Link> :
                  <em style={{ color: "white" }}>Prijava kao: <Link name='profil-ulaz' to={`/profil`} style={{ color: "white" }}>{korisnik.username}</Link></em>
                }
              </Nav>
              {korisnik === null ?
                "" :
                <Button variant="dark" onClick={() => logout()} href="/">Logout</Button>
              }
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {korisnik === null ? "" : postaviLinkove("korisnik",
          <div style={{ padding: "20px", bottom: "0", position: "fixed", right: "0px" }}>
            <Button variant="dark" className="btn-round" style={{height:'40px', width:'40px', borderRadius: "20px" }} onClick={handleShow}><BsPlusLg /></Button>
            <KreirajEvent show={show} handleShow={handleShow} handleClose={handleClose} />
          </div>)
        }
      </div>
      <Routes>
        <Route path="/" element={<Pocetna />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dogadaji" element={<Dogadaji />} />
        <Route path="/mojidogadaji" element={korisnik !== null ? <MojiEventi /> : <Login />} />
        <Route path="/mojeprijave" element={korisnik !== null ? <MojePrijave /> : <Login />} />
        <Route path="/korisnici" element={korisnik !== null ? preusmjeri(korisnik, <Korisnici />) : <Login />} />
        <Route path="/detalji/:id" element={<Detalji />} />
        <Route path="/profil" element={korisnik !== null ? <Profil /> : <Login />} />
        <Route path="/detaljikorisnik/:username" element={korisnik !== null ? preusmjeri(korisnik, <DetaljiKorisnik />) : <Login />} />
      </Routes>
    </Router>
  );

}

export default App;
