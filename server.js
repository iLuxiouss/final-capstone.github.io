const express = require('express')
const session = require('express-session')
const flash = require('express-flash')
const connectDb = require('./db')
const bodyParser = require('body-parser')
const initializePassport = require("./passport/passport-config")

/*
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://capstone:b72BRGr1n2ZCBTlJ@capstone.d7zn2h7.mongodb.net/capstone?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        return client.db('capstone'); // Replace '<database-name>' with your actual database name
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

module.exports = connectToDatabase;
*/

const passport = require('passport')

const views = require('./routes/routes')

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.use(express.static("public"))



/// sessions
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: '8cBkdM3sJEFlKRXrDPNQwtAn8uDWlquR',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
}))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
app.use('/',views)

initializePassport()

connectDb().then(db => {
    console.log('Successfully connected to the database');
}).catch(e => {
    console.error('Error connecting to the database:', e);
    // Close the server in case of a database connection error
    process.exit(1);
});

app.listen(5003,() => {
    console.log("server fire at 5003")
})



