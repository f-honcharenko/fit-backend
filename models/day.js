const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');



const daySchema = new Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    birthdays: {
        type: Array,
        required: false,
        unique: false,
        employee: [String]
    },
    groups: {           // object
        // type: mongoose.ObjectId,
        // strict: false,
        // toObject: { getters: true }
    }



},
    // {
    // collection: 'rozklad-AP1'
    // }
    // ,
    {
        timestamps: true
    },
);

const AP1 = mongoose.model('rozklad-AP-1', daySchema);
const SoftEng3 = mongoose.model('rozklad-SoftEng-3', daySchema);

module.exports = {
    "AP1": AP1,
    "SoftEng3": SoftEng3,
}
