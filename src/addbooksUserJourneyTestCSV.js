import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

export let options = {
    scenarios:
        {
            contacts: {
                executor: 'shared-iterations',
                vus: 1, //number of concurrent users sharing the iterations
                iterations: 20, //number of iterations that all users will perform
                maxDuration: '30s' //the max time allocated to execute the test
            },
        },
    thresholds: {
        http_req_failed: ['rate<0.10'], // http errors should be less than 10%
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    },
};

const csvData = new SharedArray('users', function () {
    return papaparse.parse(open('../data/users.csv'), { header: true }).data;
});

const loginUrl = 'https://demoqa.com/Account/v1/Login';
const generateTokenUrl = 'https://demoqa.com/Account/v1/GenerateToken';
const booksUrl = 'https://demoqa.com/BookStore/v1/Books';

export default function () {

    let params = {
        headers: {
            accept: "application/json",
            "Content-Type": "application/json"
        },
    };

    /*
    LOGIN
    */

    let loginBody = {
        "userName": csvData[`${__VU}`].userName,
        "password": csvData[`${__VU}`].passWord
    };

    //sleep(Math.random() * 5);

    let resLogin = http.post(
        loginUrl,
        JSON.stringify(loginBody),
        params
    );

    let authorizationToken = resLogin.json("token");
    let userID = resLogin.json("userId");

    if (authorizationToken == null) {
        console.log(">>>>>> Error Message Token for user " + csvData[`${__VU}`].userName + " >>>>>> " + resLogin.json("result"));
    }

    //console.log(">>>>>> userName >>>>>> " + csvData[`${__VU}`].userName + " and password " + csvData[`${__VU}`].passWord);


    check(resLogin, {
        'Login status 200': (r) => r.status === 200,
    });

    if (resLogin.status == 200){
        console.log(">>>>>> Token for user " + csvData[`${__VU}`].userName + " >>>>>> " + `${authorizationToken}`);
    }

    console.log(">>>>>> Login Res Body >>>>>> " + resLogin.body);

    sleep(1);

    /*
    ADD 5 BOOKS
    */


    let paramsWithToken = {
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authorizationToken}`,
        }
    };

    for (let i = 0; i < 5; i++) {

        let addBooksBody = {
            "userId": `${userID}`,
            "collectionOfIsbns": [
                {
                    "isbn": `${getNextBook(i)}`
                }
            ]
        };

        console.log(">>>>>> adding book  >>>>>> " + `${getNextBook(i)}` + " to User >>>> " + csvData[`${__VU}`].userName);

        let resAddBooks = http.post(
            booksUrl,
            JSON.stringify(addBooksBody),
            paramsWithToken
        );

        check(resAddBooks, {
            'Add Book status 201': (r) => r.status === 201,
        });

        if (resAddBooks.status != 201) {
            console.log(">>>>>> Error Message for user " + csvData[`${__VU}`].userName +  " >>>>>> " + resAddBooks.json("message"));
        }

        sleep(1);

    }

    sleep(1);

    /*
    Delete all books
    */

    let resDelUser = http.del(
        `${booksUrl}/?UserId=${userID}` ,null, paramsWithToken
    );

    check(resDelUser, {
        'Del Books status 204': (r) => r.status === 204,
    });

    /*
    TODO: Logout
    */

    //let res = http.get('https://demoqa.com/profile');
    //res = res.parseHTML(res).find('submit').click;

    sleep(1);


    function getRandomBooks() {
        const bookIds = ['9781449325862','9781449331818','9781449337711','9781449365035','9781491904244','9781491950296','9781593275846','9781593277574'];
        return bookIds[Math.floor(Math.random() * bookIds.length)];
    }

    function getNextBook(index) {
        const bookIds = ['9781449325862','9781449331818','9781449337711','9781449365035','9781491904244','9781491950296','9781593275846','9781593277574'];
        return bookIds[index];
    }
}
