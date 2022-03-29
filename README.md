# testrepo

A simple performance test example how K6 can be used to test an api

## What it does
The example simply create a number of users through an api, and adds a number of books.

It's intention is an excerice, however, the scripts are written in K6, a Performance Engineering tool.  
This approach makes these scripts siutable for Performance Test.   Thus it can be said that this project can also be used as a simple example to illustrate how to performance test a simple book shop. 

The scripts do not test the UI, there are other tools better siutes for this.  The scripts target the APIs.

## Quick setup
```
- pull the repo
- npm install
- npm run setup //will create 15 users
- npm test //will load test
```

By default, the script _createUsersCSV.js_ will create 15 users.


### Running the scripts directly
```
- pull the repo
- npm install
- cd /src
- k6 run createUsersCSV.js
- k6 run addbooksUserJourneyTestCSV.js
```

## Preset Scripts 
```
    "test": "k6 run ./src/addbooksUserJourneyTestCSV.js"
    "setup": "k6 run ./src/createUsersCSV.js"
    "load10users": "k6 run -u 10 -i 20 ./src/addbooksUserJourneyTestCSV.js"
    "load1user": "k6 run -u 1 -i 1 addbooksUserJourneyTestCSV.js"
```


## command line arguments

Command Line arguments can be passed to the script addbooksUserJourneyTestCSV.js to control the load one would like to generate.

By default, addbooksUserJourneyTestCSV.js will create 5 concurrent users, performing add and delete of books.  the script will keep running for a max time of 30 seconds, or until 20 iterations of the same test have executed.

This can be controlled by the following:
```
-u (to control the numbers of concurrent users)
-i (to set a max set of iterations performed by each user)
-duration (the time allocated to run the test)
```
```
Example: 10 simultanious users , adding 100 books (5 each twice), and deleting all books twice
k6 run -u 10 -i 20 -d 10s addbooksUserJourneyTestCSV.js
```
```
-u 10 - 10 simultanious users
-i 20 - total of 20 iterations, 2 per user
-d 10s - in a max time of 10 seconds
```

for a single user test, run:
```
k6 run -u 1 -i 1 addbooksUserJourneyTestCSV.js
```

## Default load generated

The default load generated 1 concurrent user performing 20 iterations, and is controlled by the options:

```
scenarios:
        {
            contacts: {
                executor: 'shared-iterations',
                vus: 1,
                iterations: 20,
                maxDuration: '30s',
            },
        }
```

## What has been accoplished

- [x] Create a load test script for creating 15 users
- [x] create a load script for loggin in, add at least 5 books and delete the books.
- [ ] logout users
- [x] Readme (this one :P )
- [x] Readme explaining for CI/CD integration [here](/READMECICD.md)
- [x] Readme explaining how would the results be evaluated [here](/READMEEVAL.md)

## Test Execution / Running the tests

running a script in K6 is done from the command line, cd into the directory, and execute:
```
k6 run <script.js>
```

To increase the load generated by k6, the following argument can be run through the command line prior to the script name


To create as many users as you want, you can run the scripts using the --iterations argument in the command line. 

Example:
```
k6 run addbooksUserJourneyTestCSV.js
```

## Folder Structure

Test source files are located at /src folder

The data file (users.csv) is located at /data folder

## Other documentation
- Readme explaining for CI/CD integration [here](/READMECICD.md)
- Readme explaining how would the results be evaluated [here](/READMEEVAL.md)

## Improvement

1. Add run commands to npm for easy script execution

