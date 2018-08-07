var express = require('express');
var app = express();
var path = require('path');
var crypto = require('crypto');
const sqlite3 = require('sqlite3');
var parser = require('body-parser'); // do not change this line
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());
var db = new sqlite3.Database(__dirname + '/public/db/testDB.db');

app.use(parser.urlencoded({'extended': false,'limit': 1024}))

// viewed at http://localhost:8080
app.get('/', function(req, res) {
	//console.log(path.join(__dirname + '/home.html'));
    res.sendFile(path.join(__dirname + '/home.html'));
});

app.post('/registration', function(req, res) { 
	res.set({
  	'Content-Type': 'text/plain'
   });
  
   var addUser = function(){

   	if(req.body.fname == undefined || req.body.fname.equals("") || req.lname == undefined || req.uname == undefined || req.email == undefined || req.passwrd == undefined
   		)
    {
   		return functionError('input missing');
   	}
   	return functionInsert();
   }
   var functionError = function(strError) {
		res.status(200);

		res.set({
			'Content-Type': 'text/plain'
		});

		res.write(strError);

		res.end();
	};
    
    var functionSuccess = function() {
		res.status(200);

		res.set({
			'Content-Type': 'text/plain'
		});

		res.write('new user inserted');

		res.end();
	};
   var functionInsert = function() {
		db.run(`
			INSERT INTO users (
				fname,
				lname, username , email, password , passwordConf
			) VALUES (
				:strfname ,
				:strlname , :strUsername ,:strEmail ,:strPassword , :strPasswordConf
			)
		`, {
			':strfname': req.body.fname,
			':strlname': req.body.lname,
			':strUsername' : req.body.uname,
			':strEmail':req.body.email,
			':strPassword':req.body.passwrd,
			':strPasswordConf':req.body.passwordConf

		}, function(objectError) {
			if (objectError !== null) {
				return functionError(String(objectError));
			}
			
			return functionSuccess();
		});
	};
 
return functionInsert();
});


function hashPassword(password, salt) {
  var hash = crypto.createHash('sha256');
  console.log(password);
   console.log(salt);
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}

passport.use(new Strategy(function(username, password, done) {
	console.log("inside passport")
  db.get('SELECT salt FROM users WHERE username = ?', username, function(err, row) {
  	console.log(username);
    if (!row) return done(null, false);
    var hash = hashPassword(password, row.salt);
    db.get('SELECT username, id FROM users WHERE username = ? AND password = ?', username, hash, function(err, row) {
      if (!row) return done(null, false);
      return done(null, row);
    });
  });
}));

passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.get('SELECT id, username FROM users WHERE id = ?', id, function(err, row) {
    if (!row) return done(null, false);
    return done(null, row);
  });
});

// ...

app.post('/login', passport.authenticate('local', { successRedirect: '/good-login',
                                                    failureRedirect: '/bad-login' }));

app.get('/good-login', function(req, res) {
	//console.log(path.join(__dirname + '/home.html'));
    res.send("good-login");
});


app.get('/bad-login', function(req, res) {
	//console.log(path.join(__dirname + '/home.html'));
    res.send("bad-login");
});

app.get('/welcome', function(req, res) {
	//console.log(path.join(__dirname + '/home.html'));
    res.sendFile(path.join(__dirname + '/public/pages/welcome.html'));
});
app.use(express.static('public'))
app.listen(3000);