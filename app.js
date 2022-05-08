const express = require ('express')
const bodyParser=require('body-parser')
const mongoose = require('mongoose')
const user = require ('./model/user')
const bcrypt = require ('bcryptjs')
mongoose.connect('mongodb://localhost:27017/login-db', {
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
    const {barcode, first_name, last_name, password: plainTextPassword} = req.body
    const password = await bcrypt.hash(password, 10)
    res.json({status: 'ok'})
})

app.listen(9999, ()=>{
    console.log('Server up at 9999')
})