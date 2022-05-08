const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    barcode: {type: Number, required: true, unique: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    password: {type: String, required: true},
    password_confirm: {type: String, required: true},
}, {collection: 'users'})

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model