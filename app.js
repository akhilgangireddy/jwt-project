const express = require("express");

const USERS = require('./users.json')

const app = express();

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
const e = require("express");

app.use(express.json());

const auth = require("./middleware/auth");

// Logic goes here

app.post("/register", async(req, res) => {
    try {
        console.log(USERS)
        const { first_name, last_name, email, password } = req.body;
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }
        const oldUser = USERS.find(function(rec){
            return rec.email === email;
        })
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }
        encryptedPassword = await bcrypt.hash(password, 10);
        console.log(encryptedPassword, USERS);
        USERS.push({first_name, last_name, email : email.toLowerCase(), password : encryptedPassword});
        var user = {first_name, last_name, email, password : encryptedPassword}
        const token = jwt.sign(
            {email },
            'baker_hughes',
            {
              expiresIn: "2h",
            }
          );
          user.token = token;
          res.status(201).json(user);
    } catch (e) {
        console.log(e);
    }
});

app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      const user =  USERS.find(function(rec){
          return rec.email === email;
      });
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          {email },
          'baker_hughes',
          {
            expiresIn: "2h",
          }
        );
        user.token = token;
        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
  });
  
  app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
  });
  

module.exports = app;