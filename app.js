const express = require ('express')
const bodyParser=require('body-parser')
const mongoose = require('mongoose')
const user = require ('./model/user')
const bcrypt = require ('bcryptjs')
mongoose.connect('mongodb://localhost:27017/login-db',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

const app = express()

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/templates/register.html")
})

app.use(bodyParser.json())

app.post('/api/register', async (req, res)=> {
    console.log(req.body)
    const { barcode, first_name, last_name, password: plainTextPassword, password_confirm } = req.body
    if(plainTextPassword.length < 7) {
        return res.json({status:'error', error: 'Password too small. Should be at least 7 characters'})
    }
    if(plainTextPassword.search(/[a-z]/i) < 0) {
        return res.json({status:'error', error: 'Your password must contain at least one small letter.'})
    }
    if(plainTextPassword.search(/[A-Z]/i) < 0) {
        return res.json({status:'error', error: 'Your password must contain at least one capital letter.'})
    }
    if(plainTextPassword.search(/[0-9]/i) < 0) {
        return res.json({status:'error', error: 'Your password must contain at least one digit.'})
    }
    const password = await bcrypt.hash(plainTextPassword, 10)
    try {
        const response = await user.create({
            barcode,
            first_name,
            last_name,
            password,
            password_confirm
        })
        console.log('User created successfully: ', response)
    }
    catch(error) {
        if (error.code===11000) {
        return res.json({status: 'error', error: 'Barcode is already in use'})
        }
        throw error
    }
    res.json({status: 'ok'})
})

app.listen(9999, ()=>{
    console.log('Server up at 9999')
})