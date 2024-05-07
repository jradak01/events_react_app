import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react';
import {
    vrijemeZaFilter, ispisBoolVrijednosti, preoblikovanoVrijeme, 
    provjera, provjeraPrijave, provjeraUredenje, postaviIspisDopustenog, postaviKorisnika,
    postaviZvjezdice, provjeraAdmina, provjeraMastera,
    provjeraDuzineLozinke, provjeraPodudaranjaLozinki, provjeraImena, provjeraUsername, 
    provjeraEmaila, provjeraVlasnikaProfila, ocjenjuj
} from './pomocne'

test('postaviIspisDopustenog vraca pravu vrijednost', () => {
    const ev=[
        {
            dopusteno: true
        },
        {
            dopusteno: false
        }
    ]
    const value = postaviIspisDopustenog(ev);
    expect(value).toBe("DA");
})
test('postaviIspisDopustenog vraca pravu vrijednost', () => {
    const ev=[
        {
            dopusteno: undefined
        }
    ]
    const value = postaviIspisDopustenog(ev);
    expect(value).not.toBe("DA");
})
test('provjera prepoznaje da se ne vraća prava vrijednost', () => {
    const korisnik = null
    const kreator = {
        username:"test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const value = provjera(korisnik, kreator);
    expect(value).not.toBe(true);
})
test('provjera vraca pravu vrijednost', () => {
    const korisnik = {
        username:"test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const kreator = {
        username:"test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const value = provjera(korisnik, kreator);
    expect(value).toBe(true);
})
test('postaviKorisnika vraca pravu vrijednost', () => {
    const korisnik = {
        username:"test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }

    const value = postaviKorisnika(korisnik);
    expect(value).toBe("test");
})
test('postaviKorisnika prepoznaje krivi unos', () => {
    const korisnik = null

    const value = postaviKorisnika(korisnik);
    expect(value).not.toBe("test");
})
test('postaviZvjezdice vraca pravu vrijednost', () => {
    const ocjena=2
    const value = postaviZvjezdice(ocjena);
    expect(value).toBe("★★");
})
test('provjeraUredenje vraca pravu vrijednost', () => {
    const korisnik = {
        username:"test-admin",
        email: "test-admin@gmail.com",
        uloga: "admin"
    }
    const kreator = {
        username:"test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const value = provjeraUredenje(korisnik, kreator);
    expect(value).not.toBe(true);
})
test('provjeraUredenje vraca pravu vrijednost2', () => {
    const korisnik = {
        username:"test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const kreator = {
        username:"test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const value = provjeraUredenje(korisnik, kreator);
    expect(value).toBe(true);
})
test('provjeraUredenje prepoznaje krivu vrijednost', () => {
    const korisnik = null
    const kreator = {
        username:"test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const value = provjeraUredenje(korisnik, kreator);
    expect(value).toBe(false);
})
test('provjeraPrijave vraca pravu vrijednost', () => {
    const korisnik = {
        username:"test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const kreator = {
        username:"test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const value = provjeraPrijave(korisnik, kreator);
    expect(value).toBe(false);
})
test('provjeraPrijave prepoznaje krivu vrijednost', () => {
    const korisnik = null
    const kreator = {
        username:"test",
        email: "test@gmail.com",
        uloga: "korisnik"
    }
    const value = provjeraPrijave(korisnik, kreator);
    expect(value).toBe(false);
})
test('provjeraMastera vraca pravu vrijednost', () => {
    const uloga='korisnik'
    const korisnik = {
        username:"test",
        email: "test@gmail.com",
        uloga: "masteradmin"
    }
    const value = provjeraMastera(korisnik, uloga);
    expect(value).toBe(true);
})
test('provjeraMastera prepoznaje krivu vrijednost', () => {
    const uloga='masteradmin'
    const korisnik = {
        username:"test",
        email: "test@gmail.com",
        uloga: "masteradmin"
    }
    const value = provjeraMastera(korisnik, uloga);
    expect(value).toBe(false);
})
test('provjeraAdmina vraca pravu vrijednost', () => {
    const uloga='korisnik'
    const korisnik = {
        username:"test",
        email: "test@gmail.com",
        uloga: "masteradmin"
    }
    const value = provjeraAdmina(korisnik, uloga);
    expect(value).toBe(true);
})
test('provjeraAdmina vraca pravu vrijednost2', () => {
    const uloga='korisnik'
    const korisnik = {
        username:"test",
        email: "test@gmail.com",
        uloga: "admin"
    }
    const value = provjeraAdmina(korisnik, uloga);
    expect(value).toBe(true);
})
test('provjeraAdmina prepoznaje krivu vrijednost', () => {
    const uloga='masteradmin'
    const korisnik = {
        username:"test",
        email: "test@gmail.com",
        uloga: "admin"
    }
    const value = provjeraAdmina(korisnik, uloga);
    expect(value).toBe(false);
})
test('IspisBoolVrijednosti vraca pravu vrijednost', () => {
    const varijabla=true
    const value = ispisBoolVrijednosti(varijabla);
    expect(value).toBe("DA");
})
test('preoblikovanoVrijeme vraca pravu vrijednost', () => {
    const danas = new Date()
    const zona = danas.toISOString().substring(16, 23) 
    const vrijeme='2022-08-25T23:59:29'
    const value = preoblikovanoVrijeme(vrijeme);
    expect(value).toBe(vrijeme + zona + "Z");
})

test('vrijemeZaFilter vraca pravu vrijednost', () => {
    const vrijeme='2022-08-25T23:59:29.516Z'
    const value = vrijemeZaFilter(vrijeme);
    expect(value).toBe(true);
})
test('vrijemeZaFilter vraca pravu vrijednost', () => {
    const vrijeme='2021-08-25T23:59:29.516Z'
    const value = vrijemeZaFilter(vrijeme);
    expect(value).not.toBe(true);
})
test('vrijemeZaFilter vraca pravu vrijednost', () => {
    const vrijeme=''
    const value = vrijemeZaFilter(vrijeme);
    expect(value).not.toBe(true);
})
test('ProvjeraPodudaranjaLozinki prepoznaje krivu vrijednost', () => {
    const pass='test'
    const ponovniPass='testni'
    const value = provjeraPodudaranjaLozinki(pass, ponovniPass);
    expect(value).not.toBe('');
})
test('ProvjeraPodudaranjaLozinki vraca pravu vrijednost', () => {
    const pass='test'
    const ponovniPass='test'
    const value = provjeraPodudaranjaLozinki(pass, ponovniPass);
    expect(value).toBe('');
})
test('ProvjeraDuzineLozinke prepoznaje krivu vrijednost', () => {
    const pass='123456'
    const value = provjeraDuzineLozinke(pass);
    expect(value).not.toBe('');
})
test('ProvjeraDuzineLozinke vraca pravu vrijednost', () => {
    const pass='1234567'
    const value = provjeraDuzineLozinke(pass);
    expect(value).toBe('');
})
test('ProvjeraUsername prepoznaje krivu vrijednost', () => {
    const username='a'
    const postoji= []
    const value = provjeraUsername(username, postoji);
    expect(value).not.toBe('');
})
test('ProvjeraUsername prepoznaje krivi unos', () => {
    const username='testni'
    const postoji= ['test']
    const value = provjeraUsername(username, postoji);
    expect(value).not.toBe('');
})
test('ProvjeraUsername vraca pravu vrijednost', () => {
    const username='testni'
    const postoji= []
    const value = provjeraUsername(username, postoji);
    expect(value).toBe('');
})
test('ProvjeraImena prepoznaje krivu vrijednost', () => {
    const name='a'
    const value = provjeraImena(name);
    expect(value).not.toBe('');
})
test('ProvjeraImena vraca pravu vrijednost', () => {
    const name='testni'
    const value = provjeraImena(name);
    expect(value).toBe('');
})
test('ProvjeraEmaila prepoznaje krivu vrijednost', () => {
    const email1='te@gmail.com'
    const value1 = provjeraEmaila(email1);
    expect(value1).not.toBe('');
    const email2='test@g.com'
    const value2 = provjeraEmaila(email2);
    expect(value2).not.toBe('');
    const email3='test@gmail.c'
    const value3 = provjeraEmaila(email3);
    expect(value3).not.toBe('');
})
test('ProvjeraEmaila vraca pravu vrijednost', () => {
    const email='testni@gmail.com'
    const value = provjeraEmaila(email);
    expect(value).toBe('');
})
test('provjeraVlasnikaProfila vraca pravu vrijednost', () => {
    const user1='test'
    const user2='test'
    const value = provjeraVlasnikaProfila(user1, user2);
    expect(value).toBe(true);
})
test('provjeraVlasnikaProfila prepoznaje krivu vrijednost', () => {
    const user1=null
    const user2='test'
    const value = provjeraVlasnikaProfila(user1, user2);
    expect(value).toBe(false);
})
test('Ocjenjuj vraca pravu vrijednost', () => {
    const dopusteno= false;
    const otvoreno=false
    const value = ocjenjuj(dopusteno, otvoreno);
    expect(value).toBe(false);
})
test('Ocjenjuj prepoznaje krivu vrijednost', () => {
    const dopusteno= true;
    const otvoreno=false;
    const value = ocjenjuj(dopusteno, otvoreno);
    expect(value).not.toBe(false);
})