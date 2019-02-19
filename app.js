const express = require('express');
var qr = require('qr-image'); 
var fs = require('fs');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var mongoose =require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/Newdata");

var UserdataSchema = mongoose.Schema({
  firstname:String,
  lastname:String,
  Date:String,
  image:String,
  username : String,
  password:String
})

var User = mongoose.model('Value',UserdataSchema);
module.export = User;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
  	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  	res.header('Access-Control-Allow-Headers', 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range');
    res.header('Access-Control-Max-Age', 1728000);
   	res.header('Content-Type', 'text/plain; charset=utf-8');
    res.header('Content-Length', 0);
      
    if ('OPTIONS' == req.method) {
     	res.send(200);
    }
    else {
    	next();
  	}
	};

  app.use(allowCrossDomain);  
  app.disable('etag');


//1234567890-
app.post('/qrgenerate', function(req, res, next) {
      var name = "Sumit Sharma";
      var email = "sumitdadhich310@gmail.com"; 
      var password = "12345678"; 

    var data="Name:"+name+"Email:"+email+"password:"+password;
    var imgPath='./public';
    console.log(req.body);

    var qr_svg = qr.image(data, { type: 'png' });

    var img_name = qr_svg.pipe(require('fs').createWriteStream('./public/'+name+'.png'));

});

//Register in momgodb
app.post('/register', function(req,res){
  console.log(req.body);
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var username = req.body.emailId;
  var password= req.body.password;

  var value = {"firstname":firstname, "lastname":lastname, "username":username, "password":password};
  var newvalue = JSON.stringify(value);
  //var value = "fname"+firstname+"lname"+lastname+"emailid"+username+"password"+password;
  var imgPath = './public';
  var qr_svg = qr.image(newvalue, {type: 'png'});
  var img_name = qr_svg.pipe(require('fs').createWriteStream('./public/'+firstname+'.png'));

  var user = new User({
    firstname:firstname,
    lastname:lastname,
    username:username,
    password:password,
    image: newvalue
  })
  user.save(user,function(err,isMatch){
    if(err){
      res.json({"status":false});
    'user match data :'+isMatch}
    else{
      console.log('user match data :'+isMatch);
      res.json({"status":true});
    }
  })
})
// QRCode value from react js
app.post('/qrcode', function(req,res){
    console.log('Req body in update ', req.body);
    var data = req.body.data;
    //var date = req.body.date;
    var mydata = JSON.parse(data);
    console.log(mydata);
    var myemailld = mydata.username;
    console.log('User Emailid'+myemailld);
    User.findOne({ username: myemailld}, function(err, doc){
       if(err) {
         console.log('THIS IS ERROR RESPONSE')
          res.json(err)}
        else {
             res.json(doc);
             console.log(doc);
            } 
    }); 
})

// Test API
app.post('/qrcode12',function(req,res){
    console.log('my app')
    var name = "Sumit Sharma";
    var emailid = "sumitdadhich310@gmail.com";
    var password ="12345678";

    var value = "name"+name+"emailid"+emailid+"password"+password;
    var qr_svg = qr.image(value, { type: 'png' });   
    var img_name = qr_svg.pipe(require('fs').createWriteStream('./Images'+name+'.png')); 

});



app.listen(5000, function (){
	console.log("Example app listening");
})