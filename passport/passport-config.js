const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const connectDb = require('../db');

async function initializePassport() {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        const db = await connectDb();

        try {
            const user = await db.collection('users').findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'No user with that email' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        console.log(user._id)
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const db = await connectDb();
        try {
            const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
            console.log(id)
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

module.exports = initializePassport;