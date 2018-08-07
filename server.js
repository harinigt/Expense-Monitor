const sqlite3 = require('sqlite3').verbose();
 
var express = require('express'); // do not change this line
var parser = require('body-parser'); // do not change this line
var server = express();
var data =[];

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
	res.set({
  	'Content-Type': 'text/plain'
   });
   data.push(req.body)  
   let db = new sqlite3.Database('./db/testDB.db');
 //INSERT INTO TRIAL (NAME,MESSAGE VALUES (data[0].name , data[0].message);
 var name1 = data[0].name;
 var message1 = data[0].message;
 console.log(name1 + " " + message1);
   let sql = `INSERT INTO TRIAL (NAME,MESSAGE) VALUES (` + "'"+ name1 +"'"+ ","+ "'"+message1+"'" +`)`;
   let sql2= `SELECT * FROM TRIAL`;
   var out = "";
 
  db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    //out = "\n"+ out +row.name +" and message is  " + row.message;
  });
 
});
db.all(sql2, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    out = row.NAME +" and message is  " + row.MESSAGE;
   //out = row;
  
   console.log("from db : " + row.NAME);
  });
 
});
console.log(out);
 res.send(out) ;
// close the database connection
 db.close();
 //console.log(data);  
 
 res.end();

});
server.listen(process.env.PORT || 3000);
