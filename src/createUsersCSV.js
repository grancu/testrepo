import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

export let options = {
    vu: 1,
    iterations: 15
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


    check(res, {
        'is status 201': (r) => r.status === 201,
    });

    sleep(1);

}
