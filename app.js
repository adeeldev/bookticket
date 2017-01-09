//====================================================================================
//							NameSpace - Section
//====================================================================================

var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	userRouter = require('./routers/userRouter'),
	eventRouter = require('./routers/eventRouter'),
	promotionRouter = require('./routers/promotionRouter'),
	presentationRouter = require('./routers/presentationRouter'),
	adminRouter = require('./routers/adminRouter'),
	uploadRouter = require('./routers/uploadRouter'),
	ticketRouter = require('./routers/ticketRouter'),
	exchangeRouter = require('./routers/ticketExhangeRouter'),
	ownerRouter = require('./routers/ownerRouter'),
	paymentRouter = require('./routers/paymentRouter')
	path 					= require('path');

var config = require('./config');

function getDbURL(dbConf) {
	dbConf.host = dbConf.name || '127.0.0.1';
	dbConf.port = dbConf.port || 27017;
	dbConf.dbName = dbConf.dbName || 'turkishApp';
	var dbUrl = 'mongodb://' + dbConf.host + ':' + dbConf.port + '/' + dbConf.dbName;
	console.log(dbUrl);
	return dbUrl;
}

function bodyLoggerMiddleWare(req, res, next) {
	console.log(req.url);
	console.log(req.body);
	next();
}

//====================================================================================
//							App Environment Setup - Section
//====================================================================================

app.use(express.static(path.join(__dirname + '/public')));

// app.use(session({secret: "Al-Tair", resave:true, saveUninitialized: true}));
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(function (request, response, next) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var dbUrl = getDbURL(config.db);
mongoose.connect(dbUrl);
var db =  mongoose.connection;

db.on('open', function(){
	console.log("Succefully Connected to database. Conf: ", config.db);
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

if (config.environment === 'development') {
	app.use(bodyLoggerMiddleWare);
	console.log('Development environment detected');
}
//app.use('/event',eventRouter);
app.use('/user', userRouter);
app.use('/event',promotionRouter);
app.use('/presentation',presentationRouter);
app.use('/admin',adminRouter);
app.use('/upload',uploadRouter);
app.use('/ticket', ticketRouter);
app.use('/exchange', exchangeRouter);
app.use('/owner', ownerRouter);
app.use('/payment', paymentRouter);

//====================================================================================
//							Server Starting - Section
//====================================================================================

var port = config.server.port || 3131;
app.listen(port, function (err,result){
	if(!err){
		console.log("Listening on port: ", port);
	}
});
