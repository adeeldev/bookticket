var express = require('express');
var router = express.Router();
var moment = require('moment');
var eventModel = require('../models/promotionModel');
var ticketModel = require('../models/ticketModel');
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
  var nonce = req.body.nonce; //'fake-valid-nonce';//''
  // Use payment method nonce here
  gateway.transaction.sale({
    amount: req.body.price,
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true
      }
    }, function (err, result) {
    if(err){
      res.json(err);
    }
        // console.log(result.transaction);
  if(result.success == true){
    var newOrder = {
      "category_name" : req.body.category_name,
      "qty": req.body.qty,
      "delivery_method": req.body.delivery_method,
      "owner_id": req.body.owner_id,
      "user_id": req.body.user_id,
      "user_address": req.body.user_address,
      "user_phone_no": req.body.user_phone_no,
      "user_name": req.body.user_name,
      "payment_type": req.body.payment_type,
      "order_id": req.body.order_id,
      "event_id": req.body.event_id,
      "event_name": req.body.event_name,
      "status": 'pending',
      "trans_id": result.transaction.id,
      "trans_type": result.transaction.type,
      "trans_curr": result.transaction.currencyIsoCode,
      "amount": result.transaction.amount,
      "trans_acc_id": result.transaction.merchantAccountId,
      "trans_cretatedat": result.transaction.createdAt,
      "trans_updatedat": result.transaction.updatedAt,
      "trans_card_type": result.transaction.creditCard.cardType
    };
    ticketModel.addOrder(newOrder)
    .then(function (event){
      if(event == null){
        response.status(400).send({"code":"NE-Dup","message" : "Duplicate Order"}).end();
      }else{
        eventModel.findOne({ _id : req.body.event_id},function (err, ticket){
          if(err){
            return res.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
          }
          if(ticket == null){
            return res.status(400).send({"message" : "Invalid Event"}).end();
          }
          var total_tickets = ticket.remaining_tickets;
          var order = 1;
          var remaining_ticket = total_tickets - order;
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
      }
    })
    .catch(function (err){
      console.log("Server error : " + err);
  response.status(500).send({"code": "NE-Se","message" : "Server Error. Please try agin later.", "err" : err}).end();
  })
  }
  });
});

module.exports = router;
