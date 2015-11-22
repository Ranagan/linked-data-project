#Ryan Flanagan
**Final year Semantic Web and Linked Data project**

## Datasets used

**Dataset 1**: **Recorded Crime Offences** (Number) by Type of Offence, Garda Station and
Year - Converted into JSON by Eoghan Moylan

**Dataset 2**: **Population Aged 15 Years and Over** (Number) by Sex, Highest Level of
Education Completed, Age Group and Census Year - Converted into JSON by myself.

## General Information

  This API uses **Express** with **Node.js** to query an **SQLite3** database consisting of two different datasets. The code currently contains methods for **searching** each database table, by ID or otherwise (shown below), **adding** new entries, **updating** existing entries and **deleting** an entry in the database. The datasets are linked by year. The idea was to compare the crime years and see whether or not crime rose or depleted before and after 2011, the year of the census where the education dataset is derived.
  
## How to Use
  I used [HttpRequester](https://addons.mozilla.org/en-us/firefox/addon/httprequester/) for firefox to test my API. It's an extremely useful tool for testing REST development.
  
  In the URL, there are two basic urls:
  
  >Crimes - localhost:8000/allcrimes
  >Education - localhost:8000/alleducation
  
**GET**
  These will return all data in each set, depending on which URL you entered. If you wanted to return more specific data, you can search each database by id by adding /getbyid/**(replace with ID)**.
  
  >Example - localhost:8000/allcrime/getbyid/101
  
  If you wanted, you can search by Garda Station in the **Crimes** table, or Education type in the **Education** table.
  
  >Crimes - localhost:8000/allcrimes/get/Abbeyfeale - returns all data for Abbeyfeale Garda Station       
  >Education - localhost:8000/alleducation/get/Lower - returns data for Lower Education
  
**POST**
  To add a new entry to either of the tables, add /add/**(replace with info)**. Examples below.
  >localhost:8000/alleducation/add/College/a15to19/201
  
  This adds a new entry to the education table with Education = College with a15to19Years = 201.
  
  >localhost:8000/allcrimes/add/Murder/Abbeyfeale/2011/3
  
  This adds a new entry to the crimes table with Crime = Murder, GardaStation = Abbeyfeale and the amount of people with this crime in 2011, Y2011, is equal to 3.
  
**UPDATE**
  In order to do an update, you add /update to the end of the url followed by the information you wish to update. localhost:8000/allcrimes/update/**id**/**Crime Year**/**New amount for that year*
  
  >localhost:8000/allcrimes/update/1/2009/201
  
  This updates the set in the crimes table with the id 1, with Y2009=201.
  
  >localhost:8000/alleducation/update/1/a20to24/15
  
  This updates the set in the education table with the id 1, with the age group a20to24Years=15.
  
  
## Code Examples

  ```javascript
  // GET METHOD
  app.get('/alleducation/get/:educ', function (req, res)
{
    db.all("SELECT * FROM educationLevel WHERE Education LIKE \"%"+req.params.educ+"%\"", function(err,row)
    {
        var rowString = JSON.stringify(row, null, '\t');
        res.sendStatus(rowString);
        console.log(req.params.educ);
    });
});

  //POST METHOD
  app.post('/allcrimes/add/:crime/:gardastation/:year/:amt', function (req, res)
{
    // Inserts a new crime record into the database with the values supplied by the user.
    // Each catagory is fairly self explanatory, so it's easy for the user to understand what to do.
    db.all("INSERT INTO crimes(Crime , GardaStation , Y"+req.params.year+") VALUES (\""+req.params.crime+"\", \""+req.params.gardastation+"\", "+req.params.amt+")", function(err,row)
    {
        res.sendStatus("New crime entry has been added to the crimes table.");
    });
});

  //DELETE METHOD
  app.delete('/allcrimes/delete/:crimeDelId', function (req, res)
{
    db.all("DELETE FROM crimes WHERE id="+req.params.delId+"", function(err,row)
    {
        res.sendStatus("Crime records with ID:" + req.params.delId + " have been deleted.");
    });
});

  //PUT METHOD
  // Update URL should be self explanatory, for help using it, check the README.md
app.put('/allcrimes/update/:id/:crimeYear/:crimeAmount', function (req, res)
{
    db.all("UPDATE crimes SET Y"+req.params.crimeYear+" = "+req.params.crimeAmount+"  WHERE id="+req.params.id+"", function(err,row)
    {
        res.sendStatus("Crime record with ID " + req.params.id + " has been updated with new values.");
    });
});

```

## References
- Datasets from [CSO Statbank](http://www.cso.ie/px/pxeirestat/statire/SelectTable/Omrade0.asp?Planguage=0)
- Used to test REST [HttpRequester](https://addons.mozilla.org/en-us/firefox/addon/httprequester/)
- Help with Express [NPM](https://www.npmjs.com/package/express)
- Great SQL Tutorials on [Tutorials Point](http://www.tutorialspoint.com/sql/)


  
  
  
  
