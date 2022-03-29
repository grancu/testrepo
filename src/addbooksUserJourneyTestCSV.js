import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

export let options = {
    scenarios:
        {
            contacts: {
                executor: 'shared-iterations',
                vus: 1,
                iterations: 20,
                maxDuration: '30s',
            },
        }
};

const csvData = new SharedArray('users', function () {
    return papaparse.parse(open('../data/users.csv'), { header: true }).data;
});

const loginUrl = 'https://demoqa.com/Account/v1/Login';
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

    let resLogin = http.post(
        loginUrl,
        JSON.stringify(loginBody),
        params
    );

    let authorizationToken = resLogin.json("token");
    let userID = resLogin.json("userId");

    console.log(">>>>>> userName <<<<<<<" + csvData[`${__VU}`].userName);


    check(resLogin, {
        'Login status 200': (r) => r.status === 200,
    });

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

        let resAddBooks = http.post(
            booksUrl,
            JSON.stringify(addBooksBody),
            paramsWithToken
        );

        check(resAddBooks, {
            'Add Book status 201': (r) => r.status === 201,
        });
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

    function login() {

    }
}
