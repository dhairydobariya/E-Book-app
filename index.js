let express = require("express")
let app = express()

let port = process.env.PORT || 4000

let route = require('./route/route')

let ebookRoute = require('./route/bookRoutes')

let bodyparser = require('body-parser')

let mongoose =  require('./db/database')

let cookieparser = require('cookie-parser')

require('dotenv').config();


app.use(bodyparser.urlencoded({extended : true}))
app.use(express.json());
app.use(cookieparser())
app.use('/' , route)
app.use('/ebook' , ebookRoute)

app.listen(port , (req ,res) => {
    console.log(`port successfully run on ${port}`)
})
 
