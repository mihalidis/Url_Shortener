"use strict";

require('dotenv').config();

const express = require('express');
const mongo = require("mongodb");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const url = require("url");
const cors = require('cors');
const ejs = require("ejs");
const dns = require("dns");
const sha1 = require('sha1');


const app = express();
app.use(cors());

// Basic Configuration
const port = process.env.PORT || 3000;

//mongo bağlantı
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", () => {
	console.log("MongoDB database connection established successfully");
});

//schema
const UrlSchema = new mongoose.Schema({
	original_url: String,
	short_url: String
});

//model url için
const Urlshorter = mongoose.model("Urlshorter", UrlSchema);

// parse POST bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(process.cwd() + "/public"));

app.get('/', function(req, res) {

	res.sendFile(process.cwd() + '/views/index.html');

});

app.post("/api/shorturl/new", (req, res) => {

	const newUrl = url.parse(req.body.url).hostname;
	const fullUrl = req.body.url;
	// Create a hash code for url
	const urlhashCode = sha1(fullUrl);

	// check url is valid or not ?
	dns.lookup(newUrl, (err, addresses) => {
		if (err || addresses == null) {
			res.json({ error: "invalid url" });
		}
	  	else {
			// for not to add the same link to the database
			Urlshorter.find({ original_url: newUrl }, (err, foundItem) => {
				if (err) throw err;
				// if posted url is exist show with res.json
				if (foundItem.length !== 0) {
					res.json({ original_url: fullUrl, short_url: urlhashCode });
				}
				else {
					const createUrl = new Urlshorter({ original_url: fullUrl, short_url: urlhashCode });
					createUrl.save((err, data) => {
						if (err) throw err;
						console.log("Your items saved to your database")
						res.json({ original_url: fullUrl, short_url: urlhashCode });
					});
				}
			});
		}
	});
});

// Your first API endpoint
app.get("/api/shorturl/:hashCode", function(req, res) {
	const hashCode = req.params.hashCode;

	Urlshorter.findOne({ short_url: hashCode }, (err, foundUrl) => {
		if (err) throw err;
		console.log("Ben founUrl'im:" + foundUrl);
		res.redirect(foundUrl.original_url);
	});
});

app.listen(port, function() {
	console.log(`Listening on port ${port}`);
});


