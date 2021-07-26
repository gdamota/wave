/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
var cors = require("cors");

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/**********************
 * Example get method *
 **********************/

app.get("/pay", function(req, res) {
  // Add your code here
  res.json({success: "get call succeed!", url: req.url});
});

app.get("/pay/*", function(req, res) {
  // Add your code here
  res.json({success: "get call succeed!", url: req.url});
});

/****************************
 * Example post method *
 ****************************/
var stripe = require("stripe")(process.env.SECRET_KEY);

app.post("/pay", async function(req, res) {
  let error;
  let status;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.total,
      currency: "usd",
      payment_method_types: ["card"]
    });
    console.log(paymentIntent);
    status = "success";
  } catch (err) {
    console.log("Error:", err);
    status = "failure";
  }
  res.json({success: status, url: req.url, body: paymentIntent});
});

app.listen(3000, function() {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
