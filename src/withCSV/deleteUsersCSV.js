import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    vu: 1,
    iterations: 1
};

export default function () {

    let userName = `testUser_${__ITER}`;
    let loginUrl = 'https://demoqa.com/Account/v1/Login';
    let deleteUserUrl = 'https://demoqa.com/Account/v1/User/';


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

    console.log(">>>>>> userName <<<<<<<   " + userName);
    console.log(">>>>>> TOKEN JSON <<<<<<<   " + resLogin.json("token"));
    console.log(">>>>>> TOKEN  <<<<<<<   " + authorizationToken);
    console.log(">>>>>> USERID JSON <<<<<<<   " + resLogin.json("userId"));
    console.log(">>>>>> USERID  <<<<<<<   " + userID);

    check(resLogin, {
        'Correct Login ': (r) => r.json("userId") === userID,
    });

    /*
    Delete User
    */

    let paramsWithToken = {
        headers: {
            Authorization: `Bearer ${authorizationToken}`,
        },
    };

    console.log(">>>>>> deleteUserUrl <<<<<<<   " + deleteUserUrl + userID);

    let resDelUser = http.del(
        `https://demoqa.com/Account/v1/User/${userID}` ,null, paramsWithToken
    );

    check(resDelUser, {
        'Del User status 201': (r) => r.status === 201,
    });

    sleep(1);
}
