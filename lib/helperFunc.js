// my key = key-6704911661baf7b9441d6be158196d32
// my domian = sandbox4f4dbb04845c49dd816f7a2e9055c16f.mailgun.org
var _ = require ('lodash'),
	mailer = require('nodemailer'),
	fs = require('fs'),
	Q = require('q'),
	path = require('path'),
	users = require('../models/userModel'),
	gcm = require('node-gcm'),
	mg = require('nodemailer-mailgun-transport'),
	apn = require('apn'),
	nodemailer = require('nodemailer');

var helperFunctions = {
	randomCode : function (codeLength) {
		codeLength = codeLength || 5;
		var min = Math.pow(10,codeLength - 1);
		var max = (Math.pow(10,codeLength - 1) * 9) + (min - 1);
		var	num = Math.floor((Math.random() * max) + 1);
		console.log(max);
		var leng = num.toString().length;

		if(leng < codeLength){
			for(var i = 1; i <= codeLength - leng; i++){
				num = "0" + num;
			}
		}
		if(leng > codeLength){
			num = Math.floor(parseInt(num) / 10);
		}
		return num;
	},
	getDateFunction : function(input){
		var d = new Date(input);
			year = d.getFullYear(),
			month = d.getMonth(),
			date = d.getDate(),
			h = d.getHours(),
			min = d.getMinutes(),
			utc = Date.UTC(year,month,date,h,min);
		console.log(utc);
		return utc;
	},
	emailSender : function(userEmail,message,subject){
		// var userEmail = 'testonebyte2@gmail.com';
		console.log(userEmail);
		var defered = Q.defer();
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
		    to: userEmail,
		    subject: subject,
		    text: message,
				// html: '<b>Hello world 🐴</b>'
		});
		return defered.promise;
	},
	serverBaseURL : function() {
		if (process.env.NODE_ENV == 'development') {
			return 'http://127.0.0.1:5000/';
		} else {
			return 'http://159.203.70.181:5000/';
		}
	},
	getFileProp : function(ObjectId, type, file){
		var fileData = {
				destPath : "",
				filename : "",
				dbPath 	: ""
			}
			fileID = ObjectId;
		if(type == "video"){
			fileData.destPath = path.resolve(path.join(__dirname,'../public/videos'));
			fileData.filename = fileID.toString()  + file.name.substring(file.name.lastIndexOf('.') , file.name.length);
			fileData.dbPath = 'videos/' + fileData.filename;
		}else if(type == "promotions"){
			fileData.destPath = path.resolve(path.join(__dirname,'../public/images/promotion'));
			fileData.filename = fileID.toString() + file.name.substring(file.name.lastIndexOf('.') , file.name.length);
			fileData.dbPath = 'images/promotion/' + fileData.filename;
		}else if(type == 'sliderImage'){
			fileData.destPath = path.resolve(path.join(__dirname,'../public/images/homeImages'));
			fileData.filename = fileID.toString() + file.name.substring(file.name.lastIndexOf('.') , file.name.length);
			fileData.dbPath = 'images/homeImages/' + fileData.filename;
		}else if(type === "thumbnail-video"){
			fileData.destPath = path.resolve(path.join(__dirname,'../public/videos'));
			fileData.filename = fileID.toString() + "_thumbnail"  + file.name.substring(file.name.lastIndexOf('.') , file.name.length);
			fileData.dbPath = 'videos/' + fileData.filename;
		}else if(type == "thumbnail-ppt"){
			fileData.destPath = path.resolve(path.join(__dirname,'../public/presentation'));
			fileData.filename = fileID.toString() + "_thumbnail"  + file.name.substring(file.name.lastIndexOf('.') , file.name.length);
			fileData.dbPath = 'presentation/' + fileData.filename;
		}else{
			fileData.destPath = path.resolve(path.join(__dirname,'../public/presentation'));
			fileData.filename = fileID.toString() + file.name.substring(file.name.lastIndexOf('.') , file.name.length);
			fileData.dbPath = 'presentation/' + fileData.filename;
		}
		return fileData;
	}
}


module.exports = helperFunctions;
