import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('http_reqs');

export let options = {
    vu: '1',
    iterations: 1
};

export default function () {

    //TODO: Add CSV Support
    let userName = `testUser_${__ITER}`;
    let url = 'https://demoqa.com/Account/v1/User';
    let body = {
        "userName": userName,
        "password": "P@ssW0rd"
    };

    console.log('>>>>>>>>>>>>>>   userName <<<<<<<  : ' + userName);

    let params = {
        headers: {
            accept: "application/json",
            "Content-Type": "application/json"
        },
    };

    let res = http.post(
        url,
        JSON.stringify(body),
        params
    );

    console.log('>>>>>>>>>>>>>>   status <<<<<<<  : ' + res.status);

    check(res, {
        'is status 201': (r) => r.status === 201,
    });

    sleep(1);

}
