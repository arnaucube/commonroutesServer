var request = require('request');

var url = "http://127.0.0.1:3000/api";
var users = [{
        username: "u1",
        password: "u1",
        email: "u1"
    },
    {
        username: "u2",
        password: "u2",
        email: "u2"
    },
    {
        username: "u3",
        password: "u3",
        email: "u3"
    }
];
//signup
function signup(user) {
    var data = {
        username: user.username,
        password: user.password,
        email: user.email
    };
    request({
        url: url + "/signup",
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: data,
        json: true
    }, function(err, httpResponse, body) {
        if (err) {
            console.log(err);
        } else {
            //console.log(body);
            login(user);
        }
    });
}
//login
function login(user) {
    var data = {
        username: user.username,
        password: user.email
    };
    request({
        url: url + "/login",
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: data,
        json: true
    }, function(err, httpResponse, body) {
        if (err) {
            console.log(err);
        } else {
            console.log(body.token);
            user.token = JSON.parse(JSON.stringify(body.token));
            console.log(user.username);
            addTravel(user);
        }
    });
}

function addTravel(user) {
    var data = {
        title: "travel",
        description: "description4",
        from: "placeA",
        to: "placeB",
        date: "2017-10-29T22:58:59.000Z",
        seats: 3,
        package: true,
        collectivized: true,
        type: "offer"
    };
    request({
        url: url + "/login",
        method: "POST",
        headers: {
            'content-type': 'application/json',
            'x-access-token': user.token
        },
        body: data,
        json: true
    }, function(err, httpResponse, body) {
        if (err) {
            console.log(err);
        } else {
            console.log(body);
        }
    });
}

for (var i = 0; i < users.length; i++) {
    console.log(i);
    console.log(users[i].username);
    setTimeout(function() {
        signup(users[i]);
    }, 2000);
}
