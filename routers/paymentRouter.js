var express = require('express');
var router = express.Router();
var moment = require('moment');
var eventModel = require('../models/promotionModel');
var helperFunc = require('../lib/helperFunc');
var gcm = require('node-gcm');

var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "wvykywnjh65c7sm2",
  publicKey: "8m3jj7bwfkb6kfrf",
  privateKey: "750ae11c3d42264d9016c5e4af0ad3b1"
});

router.get('/client_token', function (request, response){
  gateway.clientToken.generate({}, function (err, res) {
    return response.send(res.clientToken);
  });
});


router.post("/checkout", function (req, res) {
  var nonce = 'fake-valid-nonce';//''eq.body.payment_method_nonce;
      // Use payment method nonce here
      	gateway.transaction.sale({
    	  amount: '10.00',
    	  paymentMethodNonce: nonce,
    	  options: {
    	    submitForSettlement: true
    	  }
    	}, function (err, result) {
        if(err){
          console.log(err);  
        }
        console.log(result.transaction.success);
        eventModel.findOne({"_id" : '573ac70a266ab0251af8d585'},function (err, ticket){
          if(err){
            return res.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
          }
          console.log(ticket);
          if(ticket == null){
            return res.status(400).send({"message" : "Invalid Email OR Code"}).end();
          }
          console.log(ticket);
          var total_tickets = ticket.total_tickets;
          var order = 1;
          var remaining_ticket = total_tickets - order;
          console.log(remaining_ticket);
          ticket.remaining_tickets = remaining_ticket;
          ticket.save(function (error,result){
            if(error){
              return res.status(500).send({"message" : "Internal Server Error", "err" : error}).end();
            }
            var subject = "Order Updated";
            delete result.__v;
            res.status(200).send(result).end();  
          })
      })
    	});
});

module.exports = router;