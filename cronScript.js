//====================================================================================
//							NameSpace - Section
//====================================================================================
	
var express = require('express'),
	app = express(),
	admin = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	userRouter = require('./routers/userRouter'),
	eventModel = require('./models/eventModel'),
	helperFunc = require('./lib/helperFunc'),
	gcm = require('node-gcm');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(function (request, response, next) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

mongoose.connect('mongodb://localhost:27017/turkeyApp');
var db =  mongoose.connection;

db.on('open', function(){
	console.log("Succefully Connected to mongodb.. ");
})
.on('error',function(err){
	console.log("An Error Has Occuured. " + err);
});

//====================================================================================
//							Routes - Section
//====================================================================================
	
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '200mb'}));
app.use(urlencodedParser);
// app.use('/user/eventNotification', userRouter);


eventModel.find({},{'__v': 0},function (err,result){
	if(err){
		return response.status(500).send({'message' : "Internal Server Error", "err" : err})
	}	
	for (var i = result.length - 1; i >= 0; i--) {
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		var todayDateYear = tomorrow.getFullYear();
		var todayDateMonth = tomorrow.getMonth();
		var todayDate = tomorrow.getDate();
		var compareDate = todayDateYear+'-'+todayDateMonth+'-'+todayDate;

		var eventDate = result[i].eventDate;
		var eventDateYear = eventDate.getFullYear();
		var eventDateMonth = eventDate.getMonth();
		var eventDate = eventDate.getDate();
		var eventDate = eventDateYear+'-'+eventDateMonth+'-'+eventDate;

		if(eventDate == compareDate){

			var message = "Come On Be Ready!!!! One Day Left for Event!!!!";
			helperFunc.sendNotification('event',message,function (error,result){
				if(error){
					console.log(error);
				}else{
					console.log("Notification is send");
				}
			})
		}
	};
	

})
