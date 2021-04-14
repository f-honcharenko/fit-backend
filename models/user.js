const { Schema, model } = require('mongoose');


const userSchema = new Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    //К чему Юзер имеет доступ
    spec: {
        type: String,
        required: false,
    },
    groups: {
        type: [String],
        required: false
    }

}, {
    collection: 'rozklad-users'
}, {
    timestamps: true
},
);

module.exports = model('User', userSchema); 