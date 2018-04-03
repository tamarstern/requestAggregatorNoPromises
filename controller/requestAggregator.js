const Promise = require('bluebird');
const request = require('request');
const config = require('config');
const async = require('async');

const numOfRequests = 3;

exports.getAggregator = async function(req, res) {

    let aggregatedRes = 0;

    var executeRequest = function(cb) {
        request(config.RequestServer, function (error, response, body) {          
            if(error) {
                console.log(error);
                return cb(error);
            } else if (response.statusCode == 500) {
                return cb(new Error("received 500 while executing http request"));
            } else {
                let bodyJson = JSON.parse(body);
                let num = bodyJson.randomNumber;
                aggregatedRes += num;        
                return cb(null, num);
            }          
        });
    }

    let tasks = [];
    for(var i =0 ; i < numOfRequests; i++) {
        tasks.push(executeRequest);
    }
    async.parallel(tasks, function(err) {
        var returnedValue = (aggregatedRes/numOfRequests);
        res.send({message : "request average returned", data : returnedValue});
    });
    
  };
