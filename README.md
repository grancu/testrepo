# testrepo

A simple performance test example how K6 can be used to test an api

## What it does
The example simply create a number of users through an api, and adds a number of books.

TODO The script can be modified to accept the number of users through the command line argument when run.  Otherwise, it will ready through a csv file.

The example uses 2 scripts.  One script is used to generate the users through the api. 
The second script is used to add books to each user created.

Not to generate a lot of load, the scripts only use 1 VU.  To increase the load, simple increase the virtual users running concurrently.

## Test Execution / Running the tests

The tests are running using the command 
```
k6 run script.js
```

/src/createUsers.js

To create as many users as you want, you can run the scripts using the --iterations argument in the command line. 

Example:
```
k6 run createUsers.js --iterations=2
```

## Folder Structure
The source files are located into the /src folder 

