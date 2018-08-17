# Expense-monitor
The web application to manage expenses and receipts. 

#Author
Harini Gowdagere Tulasidas

#Features:
1. Allows users to enter and categorize their expenses. 
2. Allows users to uploads receipts. 
3. Allows users to edit the expenses and mark them for return(if item has to be returned) and keep track of items to be returned. 

#Technologies used:
1. HTML , CSS, Bootstrap , Node.js , Express.js , Passport and SQlite. 

#Build and Install Application:

The application should be clone using the url https://github.com/harinigt/Expense-Monitor.git 

From command line Navigate to the Expense-Monitor folder and install the application using 

npm install 

After installation the application can be invoked using the command 

node index.js

On successful installation the application can viewed at the the url http://localhost:3000 
If the user doesn’t receive a message  ‘server started at port 3000’ , the dependencies need to be installed. 

The required dependencies can be installed using the command :

npm install [module-name] . 

The user must have node js , express and sqlite installed on the system. 

#Application :

The application is accessible on the browser on http://localhost:3000 . The user has to register to the application and authenticate. 
On succesful authentication the user can add their expenses  , view and edit expenses and view the returns using the respective tabs provided. 

The add expense option opens a form which allows users to enter the expense information along with the receipt for the expense entered. 

To view and edit the expense view expense option. The user can view expenses between the specified dates. The expenses are displayed as a table with option to edit the same. An expense can be edited by using the edit button at the end of an expense . The edit options allows user to update an expense , mark it for return or delete the expense. 

The expenses due for return can be viewed using the returns option. 

#License 

This project is licensed under Copyright © MIT License and Copyright (c) 2018 Harinigt. The details can be viewed at https://github.com/harinigt/Expense-Monitor/blob/master/LICENSE. 

#Resources used
The various resources used during the development are documented at :
https://github.com/harinigt/Expense-Monitor/blob/master/resources.txt . 


#Work In Progress 

Generating reports and statistics about the expenses in various categories so that user can get a clear view of how the money is spent. 

Email the expense report to the user along with the items due for return and amount due in returns. 

#Future Work

Integrating with vision api to capture the receipt information using the receipt image. 

Alert user about the item return date . 
