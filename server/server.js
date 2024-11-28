const fs = require("fs");
const csvParser = require("csv-parser");
const express = require("express");
const jwt = require('jsonwebtoken');

const app = express();
const openRouter = express.Router();
const secureRouter = express.Router();


app.use(express.json({ limit: '10kb' })); // limit JSON payloads to 1 kilobyte
app.use('/', express.static("../client"));

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));

// PORT environment variable, part of enviro where process runs
const port = process.env.PORT || 5000
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


// request logger
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// ----- HTTP requests for both authorized and unauthorized users (open) -----

// get all information from given destination ID
openRouter.get('/:id', (req, res) => {
    const destination = destinationsJSON[req.params.id ];
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
openRouter.get('geocoordinates/:id', (req, res) => {
    const destination = destinationsJSON[req.params.id ];
    const coordinates = {
        Latitude: destination["Latitude"],
        Longitude: destination["Longitude"]
    };

    res.json(coordinates);
});

// get all available country names
openRouter.get('/countries', (req, res) => {
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
openRouter.get('/search/:field/:pattern/:n?', (req, res) => {
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

const JWT_SECRET = 'testingkey123';

// POST request for creating the JWT in the backend
app.post('/api/open/JWTlogin', (req, res) => {
    const { email, isEmailVerified } = req.body;

    if (isEmailVerified) {
        // Create a JWT token
        const token = jwt.sign({ username: email }, JWT_SECRET, { expiresIn: '1h' });

        // Send the token to the frontend
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// JWT token validation
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token

    if (!token) return res.status(401).send('Access denied. No token provided.');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = user; // Attach decoded payload to the request
        next();
    });
};

// ----- HTTP requests for only authorized users -----

// create new list with given name, return error if name exists
secureRouter.post('/newlist/:listname', authenticateToken, (req, res) => {
    const listname = req.params.listname; // get the name of the (probably) new list from the parameters
    const listsPath = "data/lists.json"
    const { listDescription, listVisibility, lastEditedDateTime, ownerEmail } = req.body;

    // read the lists.json file
    fs.readFile(listsPath, "utf8", (err, data) => {
        let lists; // create an object for storing the lists

        if (err) {
            if (err.code === 'ENOENT') {
                // if the file does not exist, initialize with an empty object
                lists = [];
            } else {
                // handle any other reading errors
                return res.status(500).send(`Error reading lists.json: ${err.message}`);
            }
        } else {
            console.log("Raw data from file:", data); // Log the raw data
            // parse the existing data if the file was read successfully
            lists = data.trim() ? JSON.parse(data) : [];
        }

        // check if the list name already exists
        if (lists.some(list => list.listName === listname))
            return res.status(400).send(`List "${listname}" already exists.`);


        // add the new list with an empty array of destination IDs
        const newList = {
            ownerEmail: ownerEmail,
            listName: listname,
            listDescription: listDescription,
            listVisibility: listVisibility,
            listIDs: [],
            dateEdited: lastEditedDateTime
        }

        lists.push(newList);

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
secureRouter.put('/updatelist/:listname',authenticateToken, (req, res) => {
    const listname = req.params.listname; // get the listname from the parameters
    const listsPath = "data/lists.json"; // hardcoded path to lists.json
    const { destinationIDs, lastEditedDateTime } = req.body; // get the destination IDs from the request body

    // read the lists.json file
    fs.readFile(listsPath, "utf-8", (err, data) => {
        let lists; // create an object to store the lists

        if (err) // cannot read lists.json
            return res.status(500).send(`Error reading lists.json: ${err.message}`);

        // parse the data in the file if read successfully
        lists = data.trim() ? JSON.parse(data) : {};
        let listindex = -1;
        for(let i = 0; i < lists.length; i++) {
            if(lists[i].listName === listname)
                listindex = i;
        }
        // check if the list exists
        if (listindex === -1)
            return res.status(404).send(`List "${listname}" does not exist`);

        // replace existing destination IDs with new values
        lists[listindex].listIDs = destinationIDs
        lists[listindex].dateEdited = lastEditedDateTime
        console.log(lists);

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
secureRouter.get('/getIDs/:listname', authenticateToken, (req, res) => {
    const listname = req.params.listname; // get the listname from the parameters
    const listsPath = "data/lists.json"; // hardcoded path to lists.json

    // read the lists.json file
    fs.readFile(listsPath, "utf-8", (err, data) => {
        let lists; // create an object to store the lists

        if (err) // cannot read lists.json
            return res.status(500).send(`Error reading lists.json: ${err.message}`);

        // parse the data in the file if read successfully
        lists = data.trim() ? JSON.parse(data) : [];
        let listindex = -1;
        for(let i = 0; i < lists.length; i++) {
            if(lists[i].listName === listname)
                listindex = i;
        }
        // check if the list exists
        if (listindex === -1)
            return res.status(404).send(`List "${listname}" does not exist`);

        const ids = lists[listindex].listIDs;
        console.log(ids);
        res.json({ ids });
    }); // end of readfile
});

// delete a list of desination IDs for a given list name
secureRouter.delete('/delete/:listname', authenticateToken, (req, res) => {
    const listname = req.params.listname; // get the listname from the parameters
    const listsPath = "data/lists.json"; // hardcoded path to lists.json

    // read the lists.json file
    fs.readFile(listsPath, "utf-8", (err, data) => {
        let lists; // create an object to store the lists

        if (err) // cannot read lists.json
            return res.status(500).send(`Error reading lists.json: ${err.message}`);

        // parse the data in the file if read successfully
        lists = data.trim() ? JSON.parse(data) : [];
        let listindex = -1;
        for(let i = 0; i < lists.length; i++) {
            if(lists[i].listName === listname)
                listindex = i;
        }
        // check if the list exists
        if (listindex === -1)
            return res.status(404).send(`List "${listname}" does not exist`);

        // delete the list
        lists.splice(listindex, 1)

        // write the updated lists back to the file
        fs.writeFile(listsPath, JSON.stringify(lists, null, 2), (err) => {
            if (err) // error writing to lists.json
                return res.status(500).send(`Error writing to lists.json: ${err.message}`);

            // display success message
            res.send(`Successfully deleted list:  "${listname}".`);
        }); // end of writefile
    }); // end of readfile
});

// Get detailed list info including description and destinations
secureRouter.get('/getinfo/:listname', authenticateToken, (req, res) => {
    const listname = req.params.listname;
    const listsPath = "data/lists.json"; // Hardcoded path to lists.json

    fs.readFile(listsPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send(`Error reading lists.json: ${err.message}`);
        }

        const lists = data.trim() ? JSON.parse(data) : [];
        const list = lists.find(l => l.listName === listname);

        if (!list) {
            return res.status(404).send(`List "${listname}" does not exist`);
        }

        const destinationIDs = list.listIDs;

        // Get destination information
        const destinations = destinationIDs.map(id => {
            const destination = destinationsJSON[id];
            return {
                Destination: destination["Destination"],
                Country: destination["Country"],
            };
        });

        res.json({
            description: list.listDescription,
            destinations,
        });
    });
});


// Get all lists associated with a user
secureRouter.get('/getlists/:email', authenticateToken, (req, res) => {
    const email = req.params.email;
    const listsPath = "data/lists.json"; // Hardcoded path to lists.json

    fs.readFile(listsPath, "utf8", (err, data) => {
        if (err)
            return res.status(500).send(`Error reading lists.json: ${err.message}`);

        const lists = data.trim() ? JSON.parse(data) : [];

        // Filter lists associated with the user's email
        const userLists = lists.filter(list => list.ownerEmail === email);

        // Return array of list names
        res.json(userLists.map(list => list.listName));
    });
});

app.use('/api/open/destinations', openRouter);
app.use('/api/secure/lists', secureRouter);