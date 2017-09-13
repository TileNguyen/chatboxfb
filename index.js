const fs = require("fs");
const login = require("facebook-chat-api");
const express = require('express');
const	formidable = require('formidable');
var app = express();

app.set('port', (process.env.PORT || 1337));

app.get('/', (req, res) => {
  res.send('hello word!');
});

app.post('/', function (req, res) {

  let form = new formidable.IncomingForm();
  form.maxFieldsSize = 8 * 1024 * 1024;
  form.keepExtensions = true;
  form.parse(req, (err, fields, listFiles) => {
    if(err) return res.json({code:404,message:'Wrong username/password.'});

    let email = fields.email || '';
    let password = fields.password || '';
    let recipient_id = fields.recipientId || '';
    let message = fields.message;
    let attachment = fields.attachment;

    login({email: email, password: password}, (err, api) => {
        if(err) return res.json({code:404,message:'Wrong username/password.'});

        let msg = {
          body: message
        }
        if (attachment) {
          defaultName = fields[attachment].split('/');
          name = defaultName[defaultName.length - 1]
          fs.readFile(name, (err, data) => {
            if(err) return res.json({code:404,message:'File read error.'});
            msg.attachment = data;
            api.sendMessage(msg, recipient_id);
          });
        }
        else {
          api.sendMessage(msg, recipient_id);
        }
        // var msg = {
        //   body: "Hello, we are dev team",
        //   attachment: fs.createReadStream(__dirname + '/dog.jpg')
        // }
        // api.sendMessage(msg, recipient_id);
    });
  });
});

app.listen(app.get('port'), function () {
	console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
