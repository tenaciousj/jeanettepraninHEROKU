var express=require('express');
// var nodemailer = require("nodemailer");
var app=express();
/*
Here we are configuring our SMTP Server details.
STMP is mail server which is responsible for sending and recieving email.
// */
// var smtpTransport = nodemailer.createTransport("SMTP",{
// 	service: "Gmail",
// 	auth: {
// 	user: "jeanettepranin@gmail.com",
// 	pass: "peacelove2"
// 	}
// });
var sendgrid  = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_PASS);
// var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);
// var email     = new sendgrid.Email({
//   to:       'jeanettepranin@gmail.com',
//   from:     'you@yourself.com',
//   subject:  'Subject goes here',
//   text:     'Hello world'
// });
// sendgrid.send(email, function(err, json) {
//   if (err) { return console.error(err); }
//   console.log(json);
// });
// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/


app.get('/',function(req,res){
	res.sendfile('index.html');
});
app.get('/send',function(req,res){
	var mailOptions = {
	  to:       req.query.to,
	  from:     req.query.from,
	  subject:  req.query.subject,
	  text:     req.query.text
	};
	sendgrid.send(mailOptions, function(error, response){
		if(error){
			console.log(error);
			res.status(0).send("error");
		}
		else{
			console.log("Message sent: " + response.message);
			res.status(1).send("sent");
		}
	});
});

/*--------------------Routing Over----------------------------*/
// app.use(express.static(__dirname + '/css'));
// app.use(express.static(__dirname + '/font-awesome'));
// app.use(express.static(__dirname + '/fonts'));
// app.use(express.static(__dirname + '/img'));
// app.use(express.static(__dirname + '/js'));
// app.use(express.static(__dirname + '/less'));


var port = process.env.PORT || 3000;

app.listen(port,function(){
console.log("Express Started on Port" + port);
});