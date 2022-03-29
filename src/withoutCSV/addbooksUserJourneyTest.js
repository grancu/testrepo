import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    vu: 1,
    iterations: 1
};

export default function () {

    let userName = `testUser_${__ITER}`;
    let loginUrl = 'https://demoqa.com/Account/v1/Login';
    let addbooksUrl = 'https://demoqa.com/BookStore/v1/Books';


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
        "userName": userName,
        "password": "P@ssW0rd"
    };

    let resLogin = http.post(
        loginUrl,
        JSON.stringify(loginBody),
        params
    );

    let authorizationToken = resLogin.json("token");
    let userID = resLogin.json("userId");

    console.log(">>>>>> userName <<<<<<<" + userName);
    console.log(">>>>>> TOKEN <<<<<<<" + authorizationToken);
    console.log(">>>>>> USERID <<<<<<<" + userID);

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
        },
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
            addbooksUrl,
            JSON.stringify(addBooksBody),
            paramsWithToken
        );

        check(resAddBooks, {
            'Add Book status 201': (r) => r.status === 201,
        });
    }

    /*
    TODO: Logout
    */

    let res = http.get('https://demoqa.com/profile');
    res = res.parseHTML(res).find('submit').click;

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
