//Import express to create and configure the HTTP server.
var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');

var fs = require('fs');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));

var crimes = JSON.parse(fs.readFileSync('crimeRates.json', 'utf8'));
var education = JSON.parse(fs.readFileSync('educationLevel.json', 'utf8'));

//Set up a databse using SQLite3
var db = new sqlite3.Database(':memory:');

db.serialize(function() 
{
    db.run('CREATE TABLE crimeRates(GardaStation Text, Y2008 INTEGER, Y2009 INTEGER, Y2010 INTEGER, Y2011 INTEGER, Y2012 INTEGER, Y2013 INTEGER, Crime Text)');
    
    var stmt = db.prepare('INSERT INTO crimeRates VALUES (?,?,?,?,?,?,?,?)');
    crimes.forEach(function (fill) 
    {
        stmt.run(fill.GardaStation, fill.Y2008, fill.Y2009, fill.Y2010, fill.Y2011, fill.Y2012, fill.Y2013, fill.Crime); 
        
        //Uncomment this to see if the database is being filled with 
        //console.log(fill.GardaStation, fill.Y2008, fill.Y2009, fill.Y2010, fill.Y2011, fill.Y2012, fill.Y2013, fill.Crime);
    });
    
    db.run('CREATE TABLE educationLevel(Education Text, 15to19Years INTEGER, 20to24Years INTEGER, 25to29Years INTEGER, 30to34Years INTEGER, Y2012 INTEGER, Y2013 INTEGER, Crime Text)');
    
    var stmt = db.prepare('INSERT INTO educationLevel VALUES (?,?,?,?,?,?,?,?)');
    crimes.forEach(function (fill) 
    {
        stmt.run(fill.GardaStation, fill.Y2008, fill.Y2009, fill.Y2010, fill.Y2011, fill.Y2012, fill.Y2013, fill.Crime); 
        
        //Uncomment this to see if the database is being filled with 
        //console.log(fill.GardaStation, fill.Y2008, fill.Y2009, fill.Y2010, fill.Y2011, fill.Y2012, fill.Y2013, fill.Crime);
    });
    
    stmt.finalize();
});

//db.close();


//When a user goes to /, return a small help string
app.get('/', function(req, res) {
    res.send("This is the api working, apparently.");
    console.log("Port 8000: This is working!?");
});

//Start the server
var server = app.listen(8000);