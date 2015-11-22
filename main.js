//Import express to create and configure the HTTP server.
var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');

var fs = require('fs');

var app = express();

// Browsers can't read JSON files so this parses the JSON files so it can be read.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));

var crimes = JSON.parse(fs.readFileSync('crimeRates.json', 'utf8'));
var education = JSON.parse(fs.readFileSync('educationLevel.json', 'utf8'));

//Set up a databse using SQLite3
var db = new sqlite3.Database(':memory:');

db.serialize(function() 
{
    //Defines the database tables and automatically adds a primary key to each of the entries.
    
    db.run('CREATE TABLE crimes(id INTEGER PRIMARY KEY AUTOINCREMENT, GardaStation Text, Y2008 INTEGER, Y2009 INTEGER, Y2010 INTEGER, Y2011 INTEGER, Y2012 INTEGER, Y2013 INTEGER, Crime Text)');
    
    // The actual insert statement for the db.
    // Must define specific insert so that it doesn't look for the id in the JSON file.
    var stmt = db.prepare('INSERT INTO crimes (GardaStation, Y2008, Y2009, Y2010, Y2011, Y2012, Y2013, Crime) VALUES (?,?,?,?,?,?,?,?)');
    crimes.forEach(function (fill) 
    {
        stmt.run(fill.GardaStation, fill.Y2008, fill.Y2009, fill.Y2010, fill.Y2011, fill.Y2012, fill.Y2013, fill.Crime); 
        
        //Uncomment this to see if the database is being filled with the data
        //console.log(fill.GardaStation, fill.Y2008, fill.Y2009, fill.Y2010, fill.Y2011, fill.Y2012, fill.Y2013, fill.Crime);
    });
    
    
    db.run('CREATE TABLE educationLevel(id INTEGER PRIMARY KEY AUTOINCREMENT,Education Text, a15to19Years INTEGER, a20to24Years INTEGER, a25to29Years INTEGER, a30to34Years INTEGER, a35to39Years INTEGER, a40to44Years INTEGER, a45to49Years INTEGER, a50to54Years INTEGER, a55to59Years INTEGER, a60to64Years INTEGER, a65to69Years INTEGER, a70to74Years INTEGER, a75to79Years INTEGER, a80to84Years INTEGER, a85andOver INTEGER, AllAges INTEGER)');
    
    var stmt = db.prepare('INSERT INTO educationLevel (Education, a15to19Years, a20to24Years, a25to29Years, a30to34Years, a35to39Years, a40to44Years, a45to49Years, a50to54Years, a55to59Years, a60to64Years, a65to69Years, a70to74Years, a75to79Years, a80to84Years, a85andOver, AllAges) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    education.forEach(function (fill) 
    {
        stmt.run(fill.Education, fill.a15to19Years, fill.a20to24Years, fill.a25to29Years, fill.a30to34Years, fill.a35to39Years, fill.a40to44Years, fill.a45to49Years, fill.a50to54Years, fill.a55to59Years, fill.a60to64Years, fill.a65to69Years, fill.a70to74Years, fill.a75to79Years, fill.a80to84Years, fill.a85andOver, fill.AllAges); 
        
        //Uncomment this to see if the database is being filled with the data
        //console.log(fill.Education, fill.a15to19Years, fill.a20to24Years, fill.a25to29Years, fill.a30to34Years, fill.a35to39Years, fill.a40to44Years, fill.a45to49Years, fill.a50to54Years, fill.a55to59Years, fill.a60to64Years, fill.a65to69Years, fill.a70to74Years, fill.a75to79Years, fill.a80to84Years, fill.a85andOver, fill.AllAges);
        
    });
    
    stmt.finalize();
});


//When a user goes to /, return a small help string
app.get('/', function(req, res) {
    res.send("Use /allcrimes to retreive all crime records. \n Use /alleducation to retreive all education records from 2011.");
    console.log("Port 8000: This is working!?");
});

// --------------GET ALL METHODS--------------
// Get method to get all crimes when /allcrimes is put at the end of the URL
app.get('/allcrimes', function(req, res){
  db.all("SELECT * FROM crimes", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

// Get method to get all education data when /alleducation is put at the end of the URL
app.get('/alleducation', function(req, res){
  db.all("SELECT * FROM educationLevel", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});


// --------------REFINED SEARCH METHODS--------------
app.get('/allcrimes/get/:gs', function (req, res)
{
    // :crimeArea is a variable, whatever the user enters there in the URL will be that variable.
    // therefore, the select statement looks for the entry where the garda station is what they entered.
    db.all("SELECT * FROM crimes WHERE GardaStation LIKE \""+req.params.gs+"%\"", function(err,row)
    {
        var rowString = JSON.stringify(row, null, '\t');
        res.sendStatus(rowString);
        console.log(req.params.gs);
    });
});

app.get('/alleducation/get/:educ', function (req, res)
{
    db.all("SELECT * FROM educationLevel WHERE Education LIKE \"%"+req.params.educ+"%\"", function(err,row)
    {
        var rowString = JSON.stringify(row, null, '\t');
        res.sendStatus(rowString);
        console.log(req.params.educ);
    });
});

// --------------SEARCH BY ID METHODS--------------

app.get('/allcrimes/getbyid/id/:crimeSearchID', function (req, res)
{

    db.all("SELECT * FROM crimes WHERE id="+req.params.crimeSearchID, function(err,row)
    {
        var rowString = JSON.stringify(row, null, '\t');
        res.sendStatus(rowString);
        console.log(req.params.crimeSearchID);
    });
});

app.get('/alleducation/getbyid/id/:eduSearchID', function (req, res)
{

    db.all("SELECT * FROM educationLevel WHERE id="+req.params.eduSearchID, function(err,row)
    {
        var rowString = JSON.stringify(row, null, '\t');
        res.sendStatus(rowString);
    });
});

// --------------DELETE BY ID METHODS--------------

// Realised using app.get was wrong here so I switched it to app.delete.
// We assigned each table entry a primary key earlier because it is the easiest way to delete an entry.
/*app.get('/allcrimes/delete/:crimeID', function (req, res)
{
    db.all("DELETE FROM crimes WHERE id="+req.params.crimeID, function(err,row)
    {
        res.sendStatus("The crime records for the Garda Station with ID: " +req.params.crimeID+ " has been deleted.");
    });
});

app.get('/alleducation/delete/:eduID', function (req, res)
{
    db.all("DELETE FROM educationLevel WHERE id="+req.params.eduID, function(err,row)
    {
        res.sendStatus("The education records for the Education category with ID: " +req.params.eduID+ " has been deleted.");
    });
});*/


app.delete('/allcrimes/delete/:crimeDelId', function (req, res)
{
    db.all("DELETE FROM crimes WHERE id="+req.params.delId+"", function(err,row)
    {
        res.sendStatus("Crime records with ID:" + req.params.delId + " have been deleted.");
    });
});

app.delete('/alleducation/delete/:eduDelId', function (req, res)
{
    db.all("DELETE FROM educationLevel WHERE id="+req.params.eduDelId+"", function(err,row)
    {
        res.sendStatus("Education records with ID:" + req.params.eduDelId + " have been deleted.");
    });
});


// --------------POST METHODS--------------
app.post('/allcrimes/add/:crime/:gardastation/:year/:amt', function (req, res)
{
    // Inserts a new crime record into the database with the values supplied by the user.
    // Each catagory is fairly self explanatory, so it's easy for the user to understand what to do.
    db.all("INSERT INTO crimes(Crime , GardaStation , Y"+req.params.year+") VALUES (\""+req.params.crime+"\" , \""+req.params.gardastation+"\" , "+req.params.amt+")", function(err,row)
    {
        res.sendStatus("New crime entry has been added to the crimes table.");
    });
});

// Not working properly yet.
app.post('/alleducation/add/:educationCat/:age/:eduAmt', function (req, res)
{
    db.all("INSERT INTO educationLevel(Education, "+req.params.age+"Years) VALUES (\""+req.params.educationCat+"\", "+req.params.amt+")", function(err,row)
    {
        res.sendStatus("New education entry has been added to the education table.");
    });
});


//Start the server
var server = app.listen(8000);