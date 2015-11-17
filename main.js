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
    db.run('CREATE TABLE crimes(GardaStation Text, Y2008 INTEGER, Y2009 INTEGER, Y2010 INTEGER, Y2011 INTEGER, Y2012 INTEGER, Y2013 INTEGER, Crime Text)');
    
    var stmt = db.prepare('INSERT INTO crimes VALUES (?,?,?,?,?,?,?,?)');
    crimes.forEach(function (fill) 
    {
        stmt.run(fill.GardaStation, fill.Y2008, fill.Y2009, fill.Y2010, fill.Y2011, fill.Y2012, fill.Y2013, fill.Crime); 
        
        //Uncomment this to see if the database is being filled with the data
        //console.log(fill.GardaStation, fill.Y2008, fill.Y2009, fill.Y2010, fill.Y2011, fill.Y2012, fill.Y2013, fill.Crime);
    });
    
    db.run('CREATE TABLE educationLevel(Education Text, a15to19Years INTEGER, a20to24Years INTEGER, a25to29Years INTEGER, a30to34Years INTEGER, a35to39Years INTEGER, a40to44Years INTEGER, a45to49Years INTEGER, a50to54 INTEGER, a55to59 INTEGER, a60to64Years INTEGER, a65to69Years INTEGER, a70to74Years INTEGER, a75to79Years INTEGER, a80to84Years INTEGER, a85andOver INTEGER, AllAges INTEGER)');
    
    var stmt = db.prepare('INSERT INTO educationLevel VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    education.forEach(function (fill) 
    {
        stmt.run(fill.Education, fill.a15to19Years, fill.a20to24Years, fill.a25to29Years, fill.a30to34Years, fill.a35to39Years, fill.a40to44Years, fill.a45to49Years, fill.a50to54Years, fill.a55to59Years, fill.a60to64Years, fill.a65to69Years, fill.a70to74Years, fill.a75to79Years, fill.a80to84Years, fill.a85andOver, fill.AllAges); 
        
        //Uncomment this to see if the database is being filled with the data
        //console.log(fill.Education, fill.a15to19Years, fill.a20to24Years, fill.a25to29Years, fill.a30to34Years, fill.a35to39Years, fill.a40to44Years, fill.a45to49Years, fill.a50to54Years, fill.a55to59Years, fill.a60to64Years, fill.a65to69Years, fill.a70to74Years, fill.a75to79Years, fill.a80to84Years, fill.a85andOver, fill.AllAges);
        
    });
    
    stmt.finalize();
});

//db.close();


//When a user goes to /, return a small help string
app.get('/', function(req, res) {
    res.send("This is the api working, apparently.");
    console.log("Port 8000: This is working!?");
});

// Get method to get all crimes when /allcrimes is put at end of url
app.get('/allcrimes', function(req, res){
  db.all("SELECT * FROM crimes", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

app.get('/allcrimes/:crimeArea', function (req, res)
{
    db.all("SELECT GardaStation, Crime, Y2008, Y2009, Y2010, Y2011, Y2012, Y2013 FROM crimes WHERE GardaStation LIKE \""+req.params.crimeArea+"%\"", function(err,row)
    {
        var rowString = JSON.stringify(row, null, '\t');
        res.sendStatus(rowString);
        console.log(req.params.crimeArea);
    });
});

// Get method to get all education data when /alleducation is put at end of url
app.get('/alleducation', function(req, res){
  db.all("SELECT * FROM educationLevel", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

//Start the server
var server = app.listen(8000);