const fs = require("fs");
const login = require("facebook-chat-api");
const express = require('express');
const	formidable = require('formidable');
var app = express();

app.set('port', (process.env.PORT || 1337));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.get('/', (req, res) => {
  res.send('hello word!');
});

app.post('/', function (req, res) {

  let form = new formidable.IncomingForm();
  form.maxFieldsSize = 8 * 1024 * 1024;
  form.keepExtensions = true;
  form.parse(req, (err, fields, listFiles) => {
    if(err) return res.json({code:404,message:err});

    let email = fields.email || '';
    let password = fields.password || '';
    let recipient_id = fields.recipientId || '';
    let message = fields.message;
    let attachment = listFiles.attachment;


    login({email: email, password: password}, (err, api) => {
        if(err) return res.json({code:404,message:err});

        let msg = {
          body: message
        }
        if (attachment) {
          msg.attachment = fs.createReadStream(attachment.path);
          api.sendMessage(msg, recipient_id);
        }
        else {
          api.sendMessage(msg, recipient_id);
        }
        // var msg = {
        //   body: "Hello, we are dev team",
        //   attachment: fs.createReadStream(__dirname + '/dog.jpg')
        // }
        // api.sendMessage(msg, recipient_id);
        return res.json({code: 200, message: 'Success'});
    });
  });
});

app.listen(app.get('port'), function () {
	console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
