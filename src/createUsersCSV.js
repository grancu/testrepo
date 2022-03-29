import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

export const requests = new Counter('http_reqs');

export let options = {
    vu: '1',
    iterations: 3
};

const csvData = new SharedArray('users', function () {
    return papaparse.parse(open('../data/users.csv'), { header: true }).data;
});


export default function () {

    let url = 'https://demoqa.com/Account/v1/User';
    let body = {
        "userName": csvData[`${__ITER}`].userName,
        "password": csvData[`${__ITER}`].passWord
    };

    console.log('>>>>>>>>>>>>>>   userName <<<<<<<  : ' + csvData[`${__ITER}`].userName);
    console.log('>>>>>>>>>>>>>>   passWord <<<<<<<  : ' + csvData[`${__ITER}`].passWord);

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
