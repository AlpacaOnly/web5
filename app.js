const express = require ('express')
const bodyParser=require('body-parser')
const mongoose = require('mongoose')
const user = require ('./model/user')
mongoose.connect('mongodb://localhost:27017/login-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const app = express()

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/templates/register.html")
})

app.use(bodyParser.json())

app.post('/api/register', async (req, res)=> {
    console.log(req.body)
    res.json({status: 'ok'})
})

app.listen(9999, ()=>{
    console.log('Server up at 9999')
})