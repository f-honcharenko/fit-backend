const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');



const blockSchema = new Schema({
    weekday: {
        type: String,
        required: true,
        unique: true
    },
    groups: {
    }
},
    {
        timestamps: true
    },
);

const AP1 = mongoose.model('rozklad-AP-1-blocks', blockSchema);
const SoftEng3 = mongoose.model('rozklad-SoftEng-3-blocks', blockSchema);

module.exports = {
    "AP1": AP1,
    "SoftEng3": SoftEng3,
}
