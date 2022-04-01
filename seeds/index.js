const mongoose = require('mongoose')
const QuietLoc = require('../models/quietLoc')
const {city} = require('./nameGen')
const {name} = require('./nameGen')

mongoose.connect('mongodb://localhost:27017/quiet')
// connects to the specified database of mongoDB.

const db = mongoose.connection
db.on("error", console.error.bind(console, 'connection error:'))
// ?the use of error.bind
db.once('open',(err)=>{
    if(err){
        console.log('connection error');
    }else{
        console.log('connection success');
    }
})

// generates seed data into the quiet location database
const seedGen = async() => {
    await QuietLoc.deleteMany({})
    // clearning up all ducuments in the collection before seeding
    const genSize = 20
    for(let i = 0; i< genSize;i++) {
        let loc =  new QuietLoc({
            name:name[Math.floor(Math.random()*14)],
            city:city[Math.floor(Math.random()*19)],
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa rerum dolorem sit commodi rem, qui molestiae non quis dolores impedit corporis magni itaque aperiam unde sapiente repellendus mollitia alias et?",
            image:`https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80`

        })
         loc.save()
    }
}

seedGen()