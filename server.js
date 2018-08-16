const sqlite3 = require('sqlite3').verbose();
 
var express = require('express'); // do not change this line
var parser = require('body-parser'); // do not change this line
var server = express();
var mustache = require('mustache');
var fs = require('fs');
var data =[];
var output ;
server.use(parser.urlencoded({'extended': false,'limit': 1024}))


server.get('/form', function(req, res) {  res.status(200);  res.set({ 'Content-Type': 'text/html' });  
	res.write('<!DOCTYPE html><html><body>');    
	res.write('<form action="/new" method="post">');      
	res.write('<input type="text" name="name">');  
	res.write('<input type="text" name="message">');
  res.write('<input type="submit" value="submit">');
	res.write('</form>');  
	res.write('</body></html>');  
	res.end();

});
server.post('/new', function(req, res) { 
	 data.push(req.body)  
   let db = new sqlite3.Database(__dirname + '/public/db/testDB.db');
 //INSERT INTO TRIAL (NAME,MESSAGE VALUES (data[0].name , data[0].message);
 var name1 = data[0].name;
 var message1 = data[0].message;
 console.log(name1 + " " + message1);
   let sql = `INSERT INTO TRIAL (NAME,MESSAGE) VALUES (` + "'"+ req.body.name +"'"+ ","+ "'"+req.body.message+"'" +`)`;
   //let sql2= `SELECT * FROM datetest1 where Today between '2016-10-01' and '2016-12-01';`;
   var struser = 'sneha' ;
   var strStart = '2018-08-05' ; 
   var strEnd = '2018-08-10' ;
   let sql2 = ` SELECT * from expenses where userid =(SELECT id FROM users WHERE username = `+"'"+ struser +"'" +`) AND purchasedate BETWEEN ` +"'"+ strStart +"'"+` AND ` + "'"+strEnd +"'";
   var out = "";
   var obj = [];
 
  db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
});
db.all(sql2, [], (err, rows) => {
  
  if (err) {
    throw err;
  }
 
  

  fs.readFile('./tt.html', function(err, data) {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    res.write(mustache.render(data.toString(), {
          'objectStocks': rows
        }));
    db.close();
res.end();
    
  });
 
});


// close the database connection
 
 //console.log(data);  
 
 

});

server.use(express.static('public'))
server.listen(process.env.PORT || 3030);
