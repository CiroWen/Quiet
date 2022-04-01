const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    email:{
        type: String,
        required:true,
        unique: true
    }
})

userSchema.plugin(passportLocalMongoose)
// it automatically adds in the username and a hashed password for it

module.exports = mongoose.model('User', userSchema)