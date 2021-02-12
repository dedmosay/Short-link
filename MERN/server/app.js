const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const app = express();
const path = require('path');

app.use(express.json( {extended: true}))

app.use("/api/auth/", require("./routes/auth.routes"));

const PORT = 5000;

/*
if(PORT === 80) {
    app.use('/', express.static(path.join(__dirname, '../client', 'build')));

    app.get('*', function (req, res) {
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
    })
}
*/

async function start() {
    try{
        await mongoose.connect( config.get("mongoUri"), {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("result from bd - ok");
	app.listen(PORT, () => console.log(`Starting the development server... ${PORT}`)); 
    } catch(e) {
        console.log("Server error", e.message)
        process.exit(1)
    }
}

start();
