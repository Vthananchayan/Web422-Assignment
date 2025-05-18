/********************************************************************************
* WEB422 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: __Vithursh Thananchayan_ Student ID: ___116751231__ Date: ___05/17/25___
*
* Published URL on Vercel: https://web422-assignment-wine.vercel.app/
*
********************************************************************************/

// Setup
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const SitesDB = require("./modules/sitesDB.js");
const db = new SitesDB()
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());

// Add support for incoming JSON entities
app.use(express.json());

// Deliver the app's home page to browser clients
app.get('/', (req, res) => {
    res.json({message: "API Listening","term": "Summer 2025", "student": "[Vithursh Thananchayan]"});
});

// Add new
// This route expects a JSON object in the body, e.g. { "firstName": "Peter", "lastName": "McIntyre" }
app.post('/api/sites', (req, res) => {
  // MUST return HTTP 201
  db.addNewSite(req.body)
    .then((data) => {
        res.status(201).json({ message: 'New site added successfully', data });
    })
    .catch(error => {
        res.status(500).json({ message: error.message });
    });
});

// Get all
app.get('/api/sites', (req, res) => {
    db.getAllSites(req.query.page, req.query.perPage, req.query.name, req.query.region, req.query.provinceOrTerritoryName)
    .then((data) => {
        res.json({ message: 'Fetched all items successfully', data });
    })
    .catch(error => {
        res.status(500).json({ message: error.message });
    });
});

// Get one
app.get('/api/sites/:id', (req, res) => {
    db.getSiteById(req.params.id)
    .then((data) => {
        if (data) {
            res.json({ message: 'Site was successfully found', data });
        } else {
            res.status(404).json({ message: `Site with id ${req.params.id} not found` });
        }
    })
    .catch(error => {
        res.status(500).json({ message: error.message });
    });
});

// Edit existing
app.put('/api/sites/:id', (req, res) => {
    db.updateSiteById(req.body, req.params.id)
    .then((data) => {
        if (data) {
            res.json({ message: 'Site was successfully updated', data });
        } else {
            res.status(404).json({ message: `Site with id ${req.params.id} not found` });
        }
    })
    .catch(error => {
        res.status(500).json({ message: error.message });
    });
});

// Delete item
app.delete('/api/sites/:id', (req, res) => {
    db.deleteSiteById(req.params.id)
    .then((data) => {
        if (data) {
            res.json({ message: 'Site was successfully deleted', data });
        } else {
            res.status(404).json({ message: `Site with id ${req.params.id} not found` });
        }
    })
    .catch(error => {
        res.status(500).json({ message: error.message });
    });
});

// Resource not found (this should be at the end)
app.use((req, res) => {
  res.status(404).send('Resource not found');
});

// Tell the app to start listening for requests
app.listen(HTTP_PORT, () => {
    db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`server listening on: ${HTTP_PORT}`);
        });
        }).catch((err) => {
            console.error("Failed to initialize database:", err);
            process.exit(1); // Exit with failure
        });
  console.log('Ready to handle requests on port ' + HTTP_PORT);
});