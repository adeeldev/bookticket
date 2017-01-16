var express = require('express');
var router = express.Router();
var moment = require('moment');
var eventModel = require('../models/promotionModel');
var ticketModel = require('../models/ticketModel');
var userModel = require('../models/userModel');
var helperFunc = require('../lib/helperFunc');
var gcm = require('node-gcm'),
nodemailer = require('nodemailer'),
moment = require('moment');

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

console.log(req.body.payment_type);
  if(req.body.payment_type == "cash"){
    var newOrder = {
      "category_name" : req.body.category_name,
      "qty": req.body.qty,
      "delivery_method": req.body.delivery_method,
      "owner_id": req.body.owner_id,
      "user_id": req.body.user_id,
      "user_address": req.body.user_address,
      "user_phone_no": req.body.user_phone_no,
      "user_name": req.body.user_name,
      "payment_type": 'cash on delivery',
      "trans_type": 'cash on delivery',
      "order_id": req.body.order_id,
      "event_id": req.body.event_id,
      "event_name": req.body.event_name,
      "status": 'pending'
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

    res.status(500).send({"code": "NE-Se","message" : "Server Error. Please try agin later.", "err" : err}).end();
    })
  }
  if(req.body.payment_type == 'self'){
    var newOrder = {
      "category_name" : req.body.category_name,
      "qty": req.body.qty,
      "delivery_method": req.body.delivery_method,
      "owner_id": req.body.owner_id,
      "user_id": req.body.user_id,
      "user_address": req.body.user_address,
      "user_phone_no": req.body.user_phone_no,
      "user_name": req.body.user_name,
      "payment_type": 'self and courier service',
      "trans_type": 'self and courier service',
      "order_id": req.body.order_id,
      "event_id": req.body.event_id,
      "event_name": req.body.event_name,
      "status": 'pending'
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
      return response.status(500).send({"code": "NE-Se","message" : "Server Error. Please try agin later.", "err" : err}).end();
    })
  }else{

    var nonce = req.body.nonce; //'fake-valid-nonce';//''
    var amount = parseFloat(req.body.price);
    var sharing_price = parseFloat(req.body.sharing_price);
    var totalAmount = amount + sharing_price;
    gateway.transaction.sale({
      amount: totalAmount,
      paymentMethodNonce: nonce,
      // submitForSettlement: true,
      customFields: {
        sharedamount: sharing_price
      }
    }, function (err, result) {
      if(err){
        return res.send(err);
      }
      console.log(result);
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
            "trans_card_type": result.transaction.creditCard.cardType,
            "sharedamount": result.transaction.customFields.sharedamount
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
                var date_created = moment(moment.created).format('MMMM Do YYYY , h:mm:ss a');
                var start_date = moment(moment.event_start_time).format('MMMM Do YYYY , h:mm:ss a');
                var end_date   = moment(moment.event_end_time).format('MMMM Do YYYY , h:mm:ss a');
                  var msg = '<table border="0" cellpadding="0" cellspacing="0" style="width:600px;padding:0px 30px 0px 30px;background-color:#e2e2e2">'+
              '    <tbody><tr>'+
              '        <td>'+
              '            <table border="0" cellpadding="0" cellspacing="0" style="width:600px;padding-bottom:30px;background-color:#ffffff">'+
              '                <tbody><tr>'+
              '                    <td style="line-height:10px">'+
              '                        <img src="http://178.238.227.46:3131/images/imgpsh_fullsize.png" class="CToWUd">'+
              '                    </td>'+
              '                </tr>'+
              '            </tbody></table>'+
              '            <table border="0" cellpadding="0" cellspacing="0" style="width:600px;padding:0px 30px 0px 30px;background-color:#ffffff">'+
              '                <tbody><tr>'+
              '                    <td>'+
              '                        <p style="font-weight:bold">Hi <span style="color:#f04d1c"></span>,</p>    '+req.body.user_name+
              '                        <p style="font-weight:bold">Thanks for using our service.</p>'+
              '                        <p style="font-weight:bold">Please reference the following details for booking # <span style="color:#f04d1c">'+result._id+'</span> with <span style="color:#f04d1c">Book Ticket</span>:</p>'+
              '                        <table style="width:100%">'+
              '                            <tbody><tr>'+
              '                                <td style="width:50%;vertical-align:top" align="top">'+
              '                                    <table cellpadding="5" cellspacing="0" style="width:95%">'+
              '                                        <tbody><tr>'+
              '                                            <td style="border-bottom:1px solid #d5d0bf">BOOKING DETAILS</td>'+
              '                                        </tr>'+
              '                                        <tr>'+
              '                                            <td style="border-bottom:1px solid #d5d0bf">'+
              '                                                <table cellpadding="0" cellspacing="0">'+
              '                                                    <tbody><tr>'+
              '                                                        <td>'+
              '                                                            <img src="https://ci3.googleusercontent.com/proxy/vonQhBxs9YgpgFVZbrwpbFhQpYz_kK2O8AQTIttCPrCJMUpSE8VKvyfq2xjeKaH22vTurNpmq555GSam6ZnjSBTVnF-YivtI3LtM=s0-d-e1-ft#https://qup.s3.amazonaws.com/qupworld/pickup-icon.png" class="CToWUd">'+
              '                                                        </td>'+
              '                                                        <td style="padding-left:8px;color:#969696">'+
              '                                                            Pickup'+
              '                                                        </td>'+
              '                                                    </tr>'+
              '                                                </tbody></table>'+
              '                                                <p>  '+  result.event_address+
              '                                                </p>'+
              '                                            </td>'+
              '                                        </tr>'+
              '                                        <tr>'+
              '                                            <td style="border-bottom:1px solid #d5d0bf">'+
              '                                                <p>'+
              '                                                    <span style="color:#969696">Event Name:</span>             '+   result.event_name+
              '                                                </p>'+
              '                                                <p>'+
              '                                                    <span style="color:#969696">Event Description:</span>              '+    result.event_description+
              '                                                </p>'+
              '                                                <p>'+
              '                                                    <span style="color:#969696">Event Category:</span>             '+   result.event_category+
              '                                                </p>'+
              '                                                <p>'+
              '                                                    <span style="color:#969696">Start Date:</span>             '+   start_date+
              '                                                </p>'+
              '                                                <p>'+
              '                                                    <span style="color:#969696">End Date:</span>             '+   end_date+
              '                                                </p>'+
              '                                                <p>'+
              '                                                    <span style="color:#969696">Price:</span>              '+    result.price+
              '                                                </p>'+
              '                                            </td>'+
              '                                        </tr>'+
              '                                        <tr>'+
              '                                            <td>'+
              '                                                <p>'+
              '                                                </p>'+
              '                                            </td>'+
              '                                        </tr>'+
              '                                    </tbody></table>'+
              '                                </td>'+
              '                            </tr>'+
              '                        </tbody></table>'+
              '                        <p style="font-weight:bold">Please feel free to <a style="color:#f04d1c" href="mailto:support@tappcar.com" target="_blank">contact us</a> if you have any questions.</p>'+
              '                        <p style="font-weight:bold">We appreciate your business.</p>'+
              '                        <p style="font-weight:bold">The <span style="color:#f04d1c">BookTicket</span> Team</p>'+
              '                    </td>'+
              '                </tr>'+
              '                <tr>'+
              '                    <td style="text-align:center;padding-top:30px;padding-bottom:20px">'+
              '                        <div style="font-weight:bold">DOWNLOAD THE APP AND INSTANTLY BOOK A Ticket</div>'+
              '                        <table cellpadding="5" cellspacing="0" align="center" style="padding-bottom:15px;padding-top:15px">'+
              '                            <tbody><tr>'+
              '                                <td>'+
              '                                    <a href="" target="_blank"><img src="https://ci4.googleusercontent.com/proxy/7eFN12ub2_LG63h9SEvWHhIvWEJARNrm21OResCyZXU8Fc8rnuEwO-uIe2b0fB1VKiULB5zcty1vi7IQbcFHLTcrYe3hQZzS=s0-d-e1-ft#https://qup.s3.amazonaws.com/qupworld/appstore.png" class="CToWUd"></a>'+
              '                                </td>'+
              '                                <td>'+
              '                                    <a href="" target="_blank"><img src="https://ci6.googleusercontent.com/proxy/e9C552HbimCpcts1BEtRyNEdm0Ojq3ARFp7AOwvPXOBS_LIoTDXkHT3U2i5DdDmM9prIJ65MEQmR1JKeVBUA7hZpVQvFSQ=s0-d-e1-ft#https://qup.s3.amazonaws.com/qupworld/ggplay.png" class="CToWUd"></a>'+
              '                                </td>'+
              '                            </tr>'+
              '                        </tbody></table>'+
              '                    </td>'+
              '                </tr>'+
              '            </tbody></table>'+
              '            <span class="HOEnZb"><font color="#888888">'+
              '            </font></span><table border="0" cellpadding="0" cellspacing="0" style="width:600px;background-color:#ffffff">'+
              '                <tbody><tr><td style="line-height:20px;text-align:center">'+
              '                    <table align="center" cellpadding="0" cellspacing="0" style="width:100%;text-align:center;padding-bottom:5px;background-color:#f04d1c;color:#ffffff">'+
              '                        <tbody><tr>'+
              '                            <td style="padding-top:25px;padding-bottom:5px">'+
              '                                <img src="" class="CToWUd">'+
              '                            </td>'+
              '                        </tr>'+
              '                        <tr>'+
              '                            <td style="line-height:25px;font-size:16px">'+
              '                                                                <div><a href="http://178.238.227.46:3131" style="text-decoration:none;color:#ffffff" target="_blank" >Website: http://178.238.227.46:3131</a></div>'+
              '                                                                                                <div><a href="mailto:support@bookticket.com" style="text-decoration:none;color:#ffffff" target="_blank">Email: support@bookticket.com</a></div>'+
              '                                                            </td>'+
              '                        </tr>'+
              '                    </tbody></table>'+
              '                    <span class="HOEnZb"><font color="#888888">'+
              '                        </font></span><span class="HOEnZb"><font color="#888888">'+
              '                    </font></span><table cellpadding="0" cellspacing="0" style="width:100%;text-align:center;background-color:#f04d1c;color:#ffffff">'+
              '                        <tbody><tr>'+
              '                            <td style="padding-top:5px">'+
              '                                <table align="center" cellpadding="0" cellspacing="0" style="text-align:center;background-color:#f04d1c;color:#ffffff">'+
              '                                    <tbody><tr>'+
              '                                                                                <td style="padding:5px">'+
              '                                            <a href="https://www.facebook.com/tappcar/" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=https://www.facebook.com/tappcar/&amp;source=gmail&amp;ust=1484589623820000&amp;usg=AFQjCNHqSZuuEYVzBX4mMJ1IuzzQXMgAyA"><img style="max-height:30px;height:30px" src="https://ci5.googleusercontent.com/proxy/9WfgUnHyC9zFShKDRuS-wFOP1kX8H7S2nwxezs7p9dztHt3vQFeiKqXUSECLun85Ybq89-MiB6PAd3vKkgXnIpdsilR7rkAedG-v2_61Jg2Ov410NIvlwTn-NfCLfP_cgd1sCyKJVwM=s0-d-e1-ft#https://qup.s3.amazonaws.com/images/tappcar/setting/facebookIcon_1456374134850.png" class="CToWUd"></a>'+
              '                                        </td>'+
              '                                                                                                                        <td style="padding:5px">'+
              '                                            <a href="https://twitter.com/tapp_car" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=https://twitter.com/tapp_car&amp;source=gmail&amp;ust=1484589623820000&amp;usg=AFQjCNHcmY8QLEah67eMZTp8R4W41aNSxA"><img style="max-height:30px;height:30px" src="https://ci3.googleusercontent.com/proxy/qGdkXkSy-j-gCunDufTrX9fFziJ5V8I7mbXe63fNf3wsuxIcRpOU1LA2B4_VkgQVI3DyOvVzIZGn37SpdfSLGdcDMDUsEery85sOXWQqPmuI-E-r8BhAewNI1Rh9GKCgXFruTR99Rg=s0-d-e1-ft#https://qup.s3.amazonaws.com/images/tappcar/setting/twitterIcon_1456374135066.png" class="CToWUd"></a>'+
              '                                        </td>'+
              '                                                                                                                        <td style="padding:5px">'+
              '                                            <a href="https://plus.google.com/b/112149378229973834979/112149378229973834979" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=https://plus.google.com/b/112149378229973834979/112149378229973834979&amp;source=gmail&amp;ust=1484589623820000&amp;usg=AFQjCNGwy9g8kXzCCk_9hvQBfKvi_3PluQ"><img style="max-height:30px;height:30px" src="https://ci6.googleusercontent.com/proxy/S_DPduTckEnLyRa-2dIhiwlT3xTVyqmDHqvxVDQe6NAsNhNsYpeere-KqvZ7xH1vZfiDcCBMKsPPeWiB5vBprOqWfNqToKjUo1FHwRBGYFmYySdSTVmLXeyckxLT7At3UI3vdFms21tvfQ=s0-d-e1-ft#https://qup.s3.amazonaws.com/images/tappcar/setting/googlePlusIcon_1456374135254.png" class="CToWUd"></a>'+
              '                                        </td>'+
              '                                                                                                                    </tr>'+
              '                                </tbody></table>'+
              '                            </td>'+
              '                        </tr>'+
              '                        <tr>'+
              '                            <td style="display:flex">'+
              '                                <img src="" style="width:100%" class="CToWUd"><span class="HOEnZb"><font color="#888888">'+
              '                            </font></span></td></tr></tbody></table><span class="HOEnZb"><font color="#888888">'+
              '                </font></span></td></tr></tbody></table><span class="HOEnZb"><font color="#888888">'+
              '        </font></span></td></tr></tbody></table>';
            userModel.findOne({ _id : req.body.user_id},function (err, user){
              if(err){
                res.send(err).end();
              }
              console.log(user);
              var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                      user: 'ticketplus.greece@gmail.com',
                      pass: 'TicketplusiOS'
                  }
              }, {
                  // default values for sendMail method
                  from: 'Ticket Plus Greece',
                  headers: {
                      'My-Awesome-Header': '123'
                  }
              });
              transporter.sendMail({
                  to:     user.email,
                  subject: 'subject',
                  // text: message,
                  html: msg
              });
              res.send({'msg': 'success'}).end();
            })
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
  }



});

module.exports = router;
