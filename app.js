const express = require ('express')
const bodyParser=require('body-parser')
const mongoose = require('mongoose')
const User_model = require ('./model/user')
const bcrypt = require ('bcryptjs')
const sessions = require ('express-session')
const cookieParser = require ('cookie-parser')
const jwt = require("jsonwebtoken")
const path = require("path")

const Jwt_secret = 'oesmjenxijmwqs xiok,mpw29nq81nmc18bs'
mongoose.connect('mongodb://localhost:27017/login-db',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/templates/register.html")
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname+"/templates/login.html")
})

app.get('/profile', (req,res)=>{
    res.render('profile',{user: req.cookies.user})
})

app.get('/editInfo', async (req, res) => {
    const users = await User_model.find({}).lean()
    console.log(users)
    res.render('index', {users:users})
})

app.post('/api/login', async (req, res) =>{
    const {barcode, password} = req.body
    const user = await User_model.findOne({barcode}).lean();
    const id = await User_model.findOne({barcode}).lean().distinct("barcode")
    if(!user) {
        return res.json({status: 'error', error: 'Invalid barcode/password'})
    }

    if(await bcrypt.compare(password, user.password)) {
        //username, password combination is successful
        const token= jwt.sign({
            id: user._id,
            barcode: user.barcode},
            Jwt_secret
        )
        res.cookie('user', user)
        return res.json({status: 'ok', data: token})
    }
    return res.json({status: 'error', error: 'Invalid barcode/password'})
})

app.post('/api/register', async (req, res)=> {
    const { barcode, first_name, last_name, password: plainTextPassword} = req.body
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
        const response = await User_model.create({
            barcode,
            first_name,
            last_name,
            password
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

app.get('/delete_user/:id', (req,res)=>{
    function delete_user(user) {
        User_model.deleteOne(user)
        res('user deleted')
    }
})

app.get('/logout', (req,res)=>{
    if (sessions != null) {
        sessions().delete
    }
    res.redirect('http://localhost:9999/login')
})

app.listen(9999, ()=>{
    console.log('Server up at 9999')
})