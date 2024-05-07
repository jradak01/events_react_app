const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    naziv: {
        type: String,
        minlength: 2,
        required: true
    },
    tip: {
        type: String,
        required: true
    },
    mjesto: {
        type: String,
        minlength: 3,
        required: true
    },
    adresa: {
        type: String,
        minlength: 3,
        required: true
    },
    vrijeme: {
        type: Date,
        required: true
    },
    otvoreno: {
        type: Boolean,
        required: true
    },
    placanje: {
        type: Boolean,
        required: true
    },
    cijena: {
        type: Number,
        required: true
    },
    opis: String,
    korisnik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Korisnik'
    },
    prijavljeniKorisnici: [
        {
            prKorisnik: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Korisnik'
            },
            dopusteno: Boolean,
            ocjena: {
                type: Number
            }
        }
    ]
})

eventSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        delete ret._id
        delete ret.__v
        return ret
    }
})

module.exports = mongoose.model('Event', eventSchema, 'eventi')