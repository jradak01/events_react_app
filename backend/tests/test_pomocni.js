const Event = require('../models/event')
const Korisnik = require('../models/korisnik')

const eventiPocetne = [
    {
        naziv: "Rave Split",
        tip: "Techno party",
        mjesto: "Split",
        adresa: "Plaža Bačvice",
        vrijeme: new Date("2022-08-05T22:00:00+00:00"),
        otvoreno: true,
        placanje: true,
        cijena: 100,
        opis: "Najveći Techno party ovog ljeta u Splitu",
    },
    {
        naziv: "Filmska većer pod zvijezdama",
        tip: "Kino na otvorenom",
        mjesto: "Split",
        adresa: "Plaža Bačvice",
        vrijeme: new Date("2022-07-05T21:00:00+00:00"),
        otvoreno: true,
        placanje: false,
        cijena: 0,
        opis: "Dođite i pogledajte najveće filmske klasike te uživajte pod zvjezdanim nebom"
    },
    {
        naziv: "Ribarska većer",
        tip: "Kulturna manifestacija",
        mjesto: "Kaštel Stari",
        adresa: "Riva",
        vrijeme: new Date("2022-07-23T21:00:00+00:00"),
        otvoreno: true,
        placanje: false,
        cijena: 0,
        opis: "Zabilježite s nama još jednu Ribarsku većer te se zabavite uz glazbu, hranu i piće."
    },
    {
        naziv: "Party kod Mate",
        tip: "Privatno događanje",
        mjesto: "Split",
        adresa: "Vukovarska ulica, 267",
        vrijeme: new Date("2022-06-05T22:00:00+00:00"),
        otvoreno: false,
        placanje: true,
        cijena: 20,
        opis: "Organiziram privatni party."
    }
]

const eventiBaze = async () => {
    const event = await Event.find({})
    return event.map(p => p.toJSON())
}
const korisniciBaze = async () => {
    const korisnici = await Korisnik.find({})
    return korisnici.map(k => k.toJSON())
}

module.exports = { eventiPocetne, eventiBaze, korisniciBaze }