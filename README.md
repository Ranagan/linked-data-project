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
  
  These will return all data in each set, depending on which URL you entered. If you wanted to return more specific data, you can search each database by id by adding /getbyid/**(replace with ID)**.
  >Example - localhost:8000/allcrime/getbyid/101
  
  If you wanted, you can search by Garda Station in the **Crimes** table, or Education type in the **Education** table.
  
  >Crimes - localhost:8000/allcrimes/get/Abbeyfeale - returns all data for Abbeyfeale Garda Station       
  >Education - localhost:8000/alleducation/get/Lower - returns data for Lower Education
  
  To add a new entry to either of the tables, add /add/**(replace with info)**. Examples below.
  >localhost:8000/alleducation/add/College/a15to19/201
  This adds a new entry to the education table with Education = College with a15to19Years = 201.
  
  >localhost:8000/allcrimes/add/Murder/Abbeyfeale/2011/3
  This adds a new entry to the crimes table with Crime = Murder, GardaStation = Abbeyfeale and the amount of people with this crime in 2011, Y2011, is equal to 3.
  
  
  
  
