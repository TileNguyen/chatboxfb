const fs = require("fs");
const login = require("facebook-chat-api");

login({email: "email", password: "password"}, (err, api) => {
    if(err) return console.error(err);


    console.log(api);
    var yourID = "100001872418376";
    var msg = {
      body: "Hello, we are dev team....",
      attachment: fs.createReadStream(__dirname + '/dog.jpg')
    }
    api.sendMessage(msg, yourID);
});
