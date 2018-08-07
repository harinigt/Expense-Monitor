var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./database.sqlite3');
var express = require('express'); // do not change this line
var parser = require('body-parser'); // do not change this line
var server = express();

var db = new sqlite3.Database(__dirname + './db/testDB.db');

module.exports = {

	addUser =  function(){



	}

};