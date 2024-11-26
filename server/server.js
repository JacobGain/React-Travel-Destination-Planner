const fs = require("fs");
const csvParser = require("csv-parser");
const express = require("express");
const path = require("path");
const app = express();

app.use(express.json({ limit: '10kb' })); // limit JSON payloads to 1 kilobyte
app.use('/', express.static("../client"));

// PORT environment variable, part of enviro where process runs
const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))

const destinationsJSON = []; // stores the csv data in JSON format
fs.createReadStream("data/europe-destinations.csv")
    .pipe(csvParser())
    .on("data", (data) => {
        const cleanData = Object.keys(data).reduce((acc, key) => {
            const cleaningKey = key.replace(/[^\x00-\x7F]/g, '').trim();
            acc[cleaningKey] = data[key];
            return acc;
        }, {});
        destinationsJSON.push(cleanData);
    })
    .on("end", () => {
        //console.log(destinationsJSON);
    });

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// ----- HTTP requests for both authorized and unauthorized users -----

// get all information from given destination ID
app.get('/api/open/destinations/:id', (req,res) => {
    const destination = destinationsJSON[req.params.id - 1];
    const destinationInfo = {
        Destination: destination["Destination"],
        Region: destination["Region"],
        Country: destination["Country"],
        Category: destination["Category"],
        Latitude: destination["Latitude"],
        Longitude: destination["Longitude"],
        ApproxAnnualTourists: destination["Approximate Annual Tourists"],
        Currency: destination["Currency"],
        MajorityReligion: destination["Majority Religion"],
        FamousFoods: destination["Famous Foods"],
        Language: destination["Language"],
        BestTimeToVisit: destination["Best Time to Visit"],
        CostOfLiving: destination["Cost of Living"],
        Safety: destination["Safety"],
        CulturalSignificance: destination["Cultural Significance"],
        Description: destination["Description"]
    };

    res.json(destinationInfo);
});

// get geographical coordinates of a given destination ID
app.get('/api/open/destinations/geocoordinates/:id', (req, res) => {
    const destination = destinationsJSON[req.params.id - 1];
    const coordinates = {
        Latitude: destination["Latitude"],
        Longitude: destination["Longitude"]
    };

    res.json(coordinates);
});

// get all available country names
app.get('/api/open/destinations/countries', (req, res) => {
    const countryNames = [];
    for (let i = 0; i < destinationsJSON.length; i++) {
        const countryName = destinationsJSON[i]["Country"];
        if (!countryNames.some(c => c.name === countryName))
            countryNames.push({ name: countryName });
    };

    res.json(countryNames);
});

// match(field, pattern, n)
/* Find first n number of matching IDs for pattern matching a given field.
    If n is not given or the number of matches is less than n, return all matches */
app.get('/api/open/destinations/search/:field/:pattern/:n?', (req, res) => {
    const { field, pattern, n } = req.params; // get local variables for each parameter
    const resultLimit = n ? parseInt(n, 10) : undefined; // convert 'n' to integer if provided

    try { // try block to catch a 500 error
        // create a case-insensitive regular expression
        const regex = new RegExp(pattern, 'i');

        // filter data based on the pattern and field
        const matches = destinationsJSON
            // create an array of objects with index and destination
            .map((destination, index) => ({ index, destination }))
            // filter the matches based on the regular expression
            .filter(({ destination }) => destination[field] && regex.test(destination[field]))
            // use map to return only the indices
            .map(({ index }) => index);

        // limit matches if n is specified
        const result = resultLimit ? matches.slice(0, resultLimit) : matches;

        res.json(result);
    } catch (error) { res.status(500).send(`Error processing request: ${error.message}`); }
});

// ----- HTTP requests for only authorized users -----

// create new list with given name, return error if name exists
app.post('/api/secure/lists/newlist/:listname', (req, res) => {
    const listname = req.params.listname; // get the name of the (probably) new list from the parameters
    const listsPath = "data/lists.json"
    
    // read the lists.json file
    fs.readFile(listsPath, "utf8", (err, data) => {
        let lists; // create an object for storing the lists

        if (err) {
            if (err.code === 'ENOENT') {
                // if the file does not exist, initialize with an empty object
                lists = {};
            } else {
                // handle any other reading errors
                return res.status(500).send(`Error reading lists.json: ${err.message}`);
            }
        } else {
            // parse the existing data if the file was read successfully
            lists = data.trim() ? JSON.parse(data) : {};
        }

        // check if the list name already exists
        if (lists[listname])
            return res.status(400).send(`List "${listname}" already exists.`);


        // add the new list with an empty array of destination IDs
        lists[listname] = [];

        // write the updated lists back to the file
        fs.writeFile(listsPath, JSON.stringify(lists, null, 2), (err) => {
            if (err)
                return res.status(500).send(`Error writing to lists.json: ${err.message}`);

            // Respond with success message
            res.send(`List "${listname}" created successfully!`);
        }); // end of writefile
    }); // end of readfile
});

// save list of IDs to a given list name, return error if name does not exist
app.put('/api/secure/lists/updatelist/:listname', (req, res) => {
    const listname = req.params.listname; // get the listname from the parameters
    const listsPath = "data/lists.json"; // hardcoded path to lists.json
    const { destinationIDs } = req.body; // get the destination IDs from the request body

    // read the lists.json file
    fs.readFile(listsPath, "utf-8", (err, data) => {
        let lists; // create an object to store the lists

        if (err) // cannot read lists.json
            return res.status(500).send(`Error reading lists.json: ${err.message}`);

        // parse the data in the file if read successfully
        lists = data.trim() ? JSON.parse(data) : {};

        // check if the list exists
        if (!lists[listname])
            return res.status(404).send(`List "${listname}" does not exist`);

        // replace existing destination IDs with new values
        lists[listname] = destinationIDs

        // write the updated lists back to the file
        fs.writeFile(listsPath, JSON.stringify(lists, null, 2), (err) => {
            if (err) // error writing to lists.json
                return res.status(500).send(`Error writing to lists.json: ${err.message}`);

            // display success message
            res.send(`Destination IDs updated successfully for list: "${listname}".`);
        }); // end of writefile
    }); // end of readfile
});

// get the list of destination IDs for a given list name
app.get('/api/secure/lists/getIDs/:listname', (req, res) => {
    const listname = req.params.listname; // get the listname from the parameters
    const listsPath = "data/lists.json"; // hardcoded path to lists.json

    // read the lists.json file
    fs.readFile(listsPath, "utf-8", (err, data) => {
        let lists; // create an object to store the lists

        if (err) // cannot read lists.json
            return res.status(500).send(`Error reading lists.json: ${err.message}`);

        // parse the data in the file if read successfully
        lists = data.trim() ? JSON.parse(data) : {};

        // check if the list exists
        if (!lists[listname])
            return res.status(404).send(`List "${listname}" does not exist`);

        const destinationIDs = lists[listname];
        res.json(destinationIDs);
    }); // end of readfile
});

// delete a list of desination IDs for a given list name
app.delete('/api/secure/lists/delete/:listname', (req, res) => {
    const listname = req.params.listname; // get the listname from the parameters
    const listsPath = "data/lists.json"; // hardcoded path to lists.json

    // read the lists.json file
    fs.readFile(listsPath, "utf-8", (err, data) => {
        let lists; // create an object to store the lists

        if (err) // cannot read lists.json
            return res.status(500).send(`Error reading lists.json: ${err.message}`);

        // parse the data in the file if read successfully
        lists = data.trim() ? JSON.parse(data) : {};

        // check if the list exists
        if (!lists[listname])
            return res.status(404).send(`List "${listname}" does not exist`);

        // delete the list
        delete lists[listname];

         // write the updated lists back to the file
         fs.writeFile(listsPath, JSON.stringify(lists, null, 2), (err) => {
            if (err) // error writing to lists.json
                return res.status(500).send(`Error writing to lists.json: ${err.message}`);

            // display success message
            res.send(`Successfully deleted list:  "${listname}".`);
        }); // end of writefile
    }); // end of readfile
});

// get a list of destination names, countries, coordinates, currency, and language of all destinations from list
app.get('/api/lists/getinfo/:listname', (req, res) => {
    const listname = req.params.listname;
    const listsPath = "data/lists.json"; // hardcoded path to lists.json

    fs.readFile(listsPath, "utf8", (err, data) => {
        let lists; // create an object to store the lists

        if (err) // cannot read lists.json
            return res.status(500).send(`Error reading lists.json: ${err.message}`);

        // parse the data in the file if read successfully
        lists = data.trim() ? JSON.parse(data) : {};

        // check if the list exists
        if (!lists[listname])
            return res.status(404).send(`List "${listname}" does not exist`);

        // store the destination IDs of given list in an object
        const destinationIDs = lists[listname];

        // store info of destination
        const destinationInfo = destinationIDs.map(id => {
            const destination = destinationsJSON[id-1];
            return {
                    Destination: destination["Destination"],
                    Region: destination["Region"],
                    Country: destination["Country"],
                    Latitude: destination["Latitude"],
                    Longitude: destination["Longitude"],
                    Currency: destination["Currency"],
                    Language: destination["Language"]
            }; // return the object with appropriate info
        }); // end of map

        res.json(destinationInfo);
    }); // end of readfile
});
