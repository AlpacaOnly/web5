const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    barcode: {type: Number, required: true, unique: true}
}, {collection: 'admins'})

const model = mongoose.model('AdminSchema', AdminSchema)

module.exports = model