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

var fs = require('fs');
//const upload = multer({storage: storage})
var upload = multer({ dest: __dirname + '/public/uploads/' });
var type = upload.single('imgfile');
var MemoryStore =session.MemoryStore;

app.use(cookieParser());
app.use(session({'store': new session.MemoryStore(),
	                'secret': 'a secret to sign the cookie',
	                'resave': false,
	                'saveUninitialized': false,
	                'cookie': { 'maxAge': 86400000 }}));

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
		res.redirect("/welcome");

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
			INSERT INTO expenses_table (
				storename, item ,
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

			` SELECT expenseid,storename, item , amount,purchasedate,createdate,category,notes,receiptimg , toreturn from expenses_table where userid =(SELECT id FROM users WHERE username = :struser) AND purchasedate BETWEEN :strStart AND :strEnd`
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


    console.log("update expense request data" + req.body);


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
			UPDATE expenses_table SET 
				storename = :strstore, item = :stritem ,
				amount = :stramount , purchasedate = :strpurchasedate ,category = :strcategory, notes = :strnotes ,toreturn=:strtoreturn
			   WHERE  expenseid = :strexpenseid
			
		`, {
			':strstore': req.body.store,
			':stritem':req.body.item,
			':stramount': req.body.amount,
			':strpurchasedate':req.body.purchasedate,
			':strcategory': req.body.category,
			':strnotes':req.body.notes,
			':strtoreturn':req.body.toreturn,
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


app.get('/returns', function(req, res) {
	res.set({
  	'Content-Type': 'text/plain'
     });
	var cookie = req.cookies;
		var user;
		if(cookie["user"] === undefined){
			 console.log("user not loggedin");

		}
		else{
			console.log(cookie["user"] + " user loggedin in returns expense");
		}
		var user = cookie["user"];
		console.log(user)

      db.all(

			` SELECT storename, item , amount,purchasedate from expenses_table where userid =(SELECT id FROM users WHERE username = :struser) and toreturn=:strreturn`
			, {
			':struser' : user,
			':strreturn' :1
			

		}, function(objectError , objectRows) {
			if (objectError !== null) {
				res.send(String(objectError));
			}
			
			res.send(JSON.stringify(objectRows));
		});


  //     db.all('SELECT storename, item , receiptimg , amount FROM expenses_table WHERE toreturn = ? and userid = (select id from users where username = ?)','yes', user, function(err, rows) {
  //     if (!rows) {
  //   	  console.log(err);
  //   	  res.send("error while fetching returns") ;
  //       }
  //   	else
  //   	{  
  //   		console.log(rows);
  //   		//res.sendStatus(200);
  //   		res.send(rows);

  //   	}
    	   
  // });

});

app.post('/delete', function(req, res) {
	res.set({
  	'Content-Type': 'text/plain'
     });
	var cookie = req.cookies;
		var user;
		if(cookie["user"] === undefined){
			//return functionError('user not loggedin')
			 console.log("user not loggedin");

		}
		else{
			console.log(cookie["user"] + " user loggedin in delete expense");
		}
		
      console.log(req.body);
      db.all('DELETE FROM expenses_table WHERE expenseid = ?',parseInt(req.body.row_id), function(err, rows) {
      if (!rows) {
    	  console.log(err);
    	  res.send("error while deleting returns") ;
        }
    	else
    	{   console.log(rows);
    		//res.sendStatus(200);
    		res.send(rows);

    	}
    	   
  });

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

app.post('/welcome', passport.authenticate('local', { 
                                                  failureRedirect: '/home' }),
   function(req,res){

 	req.session.Auth = req.body.username;
 	res.set('Set-Cookie' , "user="+req.body.username);
    res.sendFile(path.join(__dirname + '/public/pages/welcome.html'));
 });

app.get('/welcome', function(req, res) {
var i = 0;
res.status(200);  
	console.log("from /welcome :" + req.isAuthenticated());
	if(req.isAuthenticated()){

		 res.sendFile(path.join(__dirname + '/public/pages/welcome.html'));
     
	}
	else {
		res.redirect("/");
	}

});

app.get('/about', function(req, res) {
      //require('connect-ensure-login').ensureLoggedIn('/')
     
     res.sendFile(path.join(__dirname + '/public/pages/about.html'));
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
    res.sendFile(path.join(__dirname + '/public/pages/thankyou.html'));
  });


app.use('/public', express.static(__dirname + '/public'));
app.listen(3000);
console.log("server started at port 3000")