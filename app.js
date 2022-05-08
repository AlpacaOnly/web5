const express = require ('express')
const path = require ('path')
var parseUrl=require('body-parser')
let encodeUrl=parseUrl.urlencoded({extended: true})

const app = express()
app.use(encodeUrl)

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/templates/register.html")
})

app.listen(9999, ()=>{
    console.log('Server up at 9999')
})