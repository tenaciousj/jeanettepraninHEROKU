var express=require('express');
var app=express();
var sendgrid  = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_PASS);

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


var port = process.env.PORT || 3000;

app.listen(port,function(){
console.log("Express Started on Port" + port);
});