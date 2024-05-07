const vrijemeZaFilter = (vrijeme) => {
    const danasnjiDatum = new Date()
    if (vrijeme !== "") {
        const dan = vrijeme[8].toString() + vrijeme[9].toString();
        const mjesec = vrijeme[5].toString() + vrijeme[6].toString();
        const godina = vrijeme[0].toString() + vrijeme[1].toString() + vrijeme[2].toString() + vrijeme[3].toString();
        const sati = vrijeme[11].toString() + vrijeme[12].toString();
        const date1 = new Date(parseInt(godina), parseInt(mjesec - 1), parseInt(dan), parseInt(sati))
        if (date1 <= danasnjiDatum) {
            return false;
        }
        else {
            return true;
        }
    }
    return false;
}
const preoblikovanoVrijeme = (vrijeme) => {
    const datum = new Date()
    const zona = datum.toISOString().substring(16, 23)
    let tocnoVrijeme = vrijeme + zona + "Z"
    return tocnoVrijeme
}
const ispisBoolVrijednosti = (varijabla) => {
    if (varijabla === true) {
        return "DA"
    } else {
        return "NE"
    }
}
const postaviIspisDopustenog = (dop) => {
    if (dop !== undefined) {
        return dop[0].dopusteno === true ? "DA" : "NE"
    }
}
const postaviKorisnika = (kor) => {
    if (kor !== null) {
        return kor.username
    }
    return "---";
}
const postaviZvjezdice = (ocjena) => {
    let ispis = ""
    for (let i = 0; i < ocjena; i++) {
        ispis += "★"
    }
    return ispis;
}
const ocjenjuj=(dopusteno, otvoreno)=>{
    if(otvoreno===false && dopusteno===false){
        return false;
    }
    return true;
}

const provjera = (korisnik, kreator) => {
    if (korisnik !== null) {
        if ((korisnik.username === kreator.username && korisnik.email === kreator.email)
            || korisnik.uloga === "admin" || korisnik.uloga === "masteradmin") {
            return true;
        } else {
            return false;
        }
    } else { return false; }
}
const provjeraPrijave = (korisnik, kreator) => {
    if (korisnik !== null) {
        if ((korisnik.username === kreator.username && korisnik.email === kreator.email)
            || korisnik.uloga === "admin" || korisnik.uloga === "masteradmin") {
            return false;
        }
        return true;
    } else {
        return false;
    }
}
const provjeraUredenje = (korisnik, kreator) => {
    if (korisnik !== null) {
        if (korisnik.username === kreator.username && korisnik.email === kreator.email) {
            return true;
        } else {
            return false;
        }
    }
    else {
        return false;
    }
}
const provjeraMastera=(kor, uloga)=>{
    if(kor.uloga==="masteradmin" && uloga!=="masteradmin"){
        return true;
    }else{
        return false;
    }
}
const provjeraAdmina=(kor, uloga)=>{
    if(kor.uloga==="masteradmin" && uloga!=="masteradmin"){
        return true;
    }else if(kor.uloga==="admin" && uloga==="korisnik"){
        return true;
    }else {return false;}
}

const provjeraPodudaranjaLozinki = (pass, ponovniPass) => {
    if (pass !== ponovniPass) {
        return 'Ponovnite unos ponovljene lozinke. Ne odgovara unesenoj lozinci!'
    }else{
        return '';
    }
}
const provjeraDuzineLozinke = (pass) => {
    if (pass.length < 7 || pass===null) {
        return 'Unesena lozinka ima manje od 7 znakova! Unesite ponovno!'
    }else{
        return '';
    }
}
const provjeraUsername = (username, postoji) => {
    if (username.length < 3 || username===null) {
        return 'Korisničko ime nije odgovarajuće dužine! Potrebno je najmanje 3 znaka!'
    }else if(postoji.length>0){
        return 'Odabrano korisničko ime već postoji! Pokušajte odabrati neko drugo!'

    }else{
        return '';
    }
}
const provjeraUsernameDuzina = (username) => {
    if (username.length < 3 || username===null) {
        return 'Korisničko ime nije odgovarajuće dužine! Potrebno je najmanje 3 znaka!'
    }else{
        return '';
    }
}
const provjeraImena = (name) =>{
    if (name.length < 2 || name===null) {
        return 'Vaše ime nije odgovarajuće dužine! Potrebno je najmanje 2 znaka!'
    }else{
        return '';
    } 
}
const provjeraEmaila = (email) => {
    if (email.indexOf('@') < 4 ||
        email.indexOf('.') - email.indexOf('@') < 3 ||
        email.length - email.indexOf('.') < 3 || email===null) {
        return 'Neodgovarajući email! Pokušajte ponovno!'
    }else{
        return '';
    }
}
const provjeraVlasnikaProfila = (user1, user2) => {
    if (user1 !== null && user1 === user2) {
        return true;
    } else { return false; }
}

export {
    vrijemeZaFilter, ispisBoolVrijednosti, preoblikovanoVrijeme, 
    provjera, provjeraPrijave, provjeraUredenje, postaviIspisDopustenog, postaviKorisnika,
    postaviZvjezdice, provjeraAdmina, provjeraMastera,
    provjeraDuzineLozinke, provjeraPodudaranjaLozinki, provjeraImena, provjeraUsername, 
    provjeraEmaila, provjeraVlasnikaProfila, ocjenjuj, provjeraUsernameDuzina
}