var express = require('express');
let session = require("express-session");
var cookieParser = require('cookie-parser');
var app = express();
var path = require('path');
var crypto = require('crypto');
var mustache = require('mustache');
const sqlite3 = require('sqlite3');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var parser = require('body-parser'); 
var multer = require('multer');
var flash = require("connect-flash");
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var fs = require('fs');
//const upload = multer({storage: storage})
var upload = multer({ dest: __dirname + '/public/uploads/' });
var type = upload.single('imgfile');
app.use(cookieParser("secret"));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session());
var db = new sqlite3.Database(__dirname + '/public/db/testDB.db');

app.use(parser.urlencoded({'extended': true,'limit': '50mb'}))
app.use(parser.json({limit: '100mb'}));

app.post('/addexpense', type, (req, res) => {
  let formData = req.body;
  //console.log(req.body.data);
  var tmp_path = req.file.path;
  console.log(tmp_path);
 
  //var target_path = 'uploads/' + req.file.originalname;

  res.set({
  	'Content-Type': 'text/plain'
   });

  var addExpense = function(){

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

		console.log('new expense inserted');

		res.end();
	};

	var functionInsert = function() {
		var cookie = req.cookies;
		var user;
		if(cookie["user"] === undefined){
			return functionError('user not loggedin')
			 //console.log("user not loggedin");

		}
		else{
			console.log(cookie["user"] + " user loggedin");
		}
		var user = cookie["user"];
		db.run(`
			INSERT INTO expenses (
				store, item ,
				amount , purchasedate, createdate, category , notes ,receiptimg ,userid
			) VALUES (
				:strstore ,:stritem ,
				:stramount , :strpurchasedate ,:strcreatedate ,:strcategory ,:strnotes,:strreceiptimg ,(SELECT id FROM users WHERE username = :struser)
			)
		`, {
			':strstore': req.body.store,
			':stritem':req.body.item,
			':stramount': req.body.amount,
			':strpurchasedate':req.body.spenton,
			':strcreatedate':req.body.createdon,
			':strcategory': req.body.category,
			':strnotes':req.body.notes,
			':strreceiptimg': tmp_path,
			':struser' : user

		}, function(objectError) {
			if (objectError !== null) {
				return functionError(String(objectError));
			}
			
			return functionSuccess();
		});
	};
   return addExpense();
 
  res.write("new user inserted");
  res.end();
});

app.post('/viewexpense' , function(req,res){
	console.log(req.body.data);
    var obj = JSON.parse(req.body.data );
 
   res.set({
  	'Content-Type': 'text/plain'
   });

  var viewExpense = function(){

   	return functionSelect();
   }

   var functionError = function(strError) {
		res.status(200);

		res.set({
			'Content-Type': 'text/plain'
		});

		res.send(strError);

		res.end();
	};

	var functionSuccess = function(strRows) {
		res.status(200);

		res.set({
			'Content-Type': 'text/plain'
		});

		res.send(strRows);

		res.end();
	};

	var functionSelect = function() {
		var cookie = req.cookies;
		var user;
		if(cookie["user"] === undefined){
			return functionError('user not loggedin')
			 //console.log("user not loggedin");

		}
		else{
			console.log(cookie["user"] + " user loggedin in view expense");
		}
		var user = cookie["user"];
		db.all(

			` SELECT expenseid,Store, item , amount,purchasedate,createdate,category,notes,receiptimg , toreturn from expenses where userid =(SELECT id FROM users WHERE username = :struser) AND purchasedate BETWEEN :strStart AND :strEnd`
			, {
			':struser' : user,
			':strStart' :obj.start,
			':strEnd' :obj.end

		}, function(objectError , objectRows) {
			if (objectError !== null) {
				return functionError(String(objectError));
			}
			
			return functionSuccess(JSON.stringify(objectRows));
		});
	};
   return viewExpense();
 
  //res.sendStatus(200);
  res.end();
});


//update the expenses 

app.post('/updateexpense' , function(req,res){


    console.log(req.body);


	res.set({
  	'Content-Type': 'text/plain'
   });
 
  var updateExpense = function(){
   	return functionUpdate();
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

		console.log('Expense Updated');

		res.end();
	};
		var functionUpdate = function() {
		
		db.run(`
			UPDATE expenses SET 
				store = :strstore, item = :stritem ,
				amount = :stramount , purchasedate = :strpurchasedate ,category = :strcategory, notes = :strnotes ,toreturn=:strtoreturn
			   WHERE  expenseid = :strexpenseid
			
		`, {
			':strstore': req.body.store,
			':stritem':req.body.item,
			':stramount': req.body.amount,
			':strpurchasedate':req.body.purchasedate,
			':strcategory': req.body.category,
			':strnotes':req.body.notes,
			':strexpenseid' : req.body.row_id

		}, function(objectError) {
			if (objectError !== null) {
				return functionError(String(objectError));
			}
			
			return functionSuccess();
		});
	};

   return updateExpense();
	
    res.write("expense updated");

	res.end();

});
// User Registration 


app.post('/registration', function(req, res) { 
	res.set({
  	'Content-Type': 'text/plain'
   });
  
   var addUser = function(){

   	if(req.body.fname == undefined || req.body.fname ==="")
    {
    	console.log("testing for " + req.body.fname)
   		return functionError('first name missing');
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

		console.log('new user inserted');

		res.end();
	};
   var functionInsert = function() {
   	var salt = Math.random().toString(36).slice(5);
   	var hash = hashPassword(req.body.passwrd, salt);
   	var passwordConfirm = hashPassword(req.body.passwordConf,salt);
		db.run(`
			INSERT INTO users (
				fname,
				lname, username , email, passwordHash, salt
			) VALUES (
				:strfname ,
				:strlname , :strUsername ,:strEmail ,:strPasswordHash ,:strSalt
			)
		`, {
			':strfname': req.body.fname,
			':strlname': req.body.lname,
			':strUsername' : req.body.uname,
			':strEmail':req.body.email,
			':strPasswordHash':hash,
			':strSalt': salt

		}, function(objectError) {
			if (objectError !== null) {
				return functionError(String(objectError));
			}
			
			return functionSuccess();
		});
	};
 
return addUser();
});


// viewed at http://localhost:3000
app.get('/', function(req, res) {
	//console.log(path.join(__dirname + '/home.html'));
    res.sendFile(path.join(__dirname + '/public/pages/home.html'));
});

app.get('/home', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/pages/home.html'));
});


function hashPassword(password, salt) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}

passport.use(new Strategy(function(username, password, done) {
  db.get('SELECT salt FROM users WHERE username = ?', username, function(err, row) {
  
    if (!row) return done(null, false);
    var hash = hashPassword(password, row.salt);
    db.get('SELECT username, id FROM users WHERE username = ? AND passwordHash = ?', username, hash, function(err, row) {
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

app.post('/login', passport.authenticate('local', { 
                                                  failureRedirect: '/home' }),
   function(req,res){
 	req.session.Auth = req.body.username;
 	res.set('Set-Cookie' , "user="+req.body.username);
    res.sendFile(path.join(__dirname + '/public/pages/welcome.html'));
 });

app.get('/welcome', function(req, res) {
      require('connect-ensure-login').ensureLoggedIn('/')
     
     res.sendFile(path.join(__dirname + '/public/pages/welcome.html'));
     
    
     //res.send("user not logged in");
});


app.get('/logout',
  function(req, res){
  	req.logout();
  	cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }  
    res.redirect('/');
  });




// app.get('/login',
//   function(req, res){
// console.log("in login");
//     res.sendFile(path.join(__dirname + '/public/pages/home.html'));
//   });

// function isAuthenticated(req, res, next) {
//  console.log(req.session.id);
//   if (req.session.id.authenticated)
//       return next();
//   res.redirect('/');
// }
//app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));
app.listen(3000);