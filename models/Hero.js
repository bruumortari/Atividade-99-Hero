const mongoose = require('mongoose');

const Hero = mongoose.model('Hero', {
    name: {
        type: String,
        select: false
    },
    codename: String,
    disasters: String,
    cities: String,
    teamwork: {
        type: String,
        default: 'Indiferente'
    }
});


module.exports = Hero;