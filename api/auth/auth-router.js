const router = require('express').Router();
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/secret')

const { isValid } = require("../users/users-service");
const Users = require("../users/users-model");

router.post('/register',validateUser,validateUserName, (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;

    // hash the password
    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    // save the user to the database
    Users.add(credentials)
      .then(user => {
        // console.log(user)
        res.status(201).json(user);
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  }
  
});

router.post('/login',validateUser, (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = makeToken(user);
          res.status(200).json({
            message: "Welcome to my API, " + user.username,
            token,
          });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
  // res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});
function makeToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const options = {
    expiresIn: '900s',
  }
  return jwt.sign(payload, jwtSecret, options)
}

function validateUser(req, res, next) {
  if(!req.body.username || !req.body.password){
    res.status(400).json("username and password required")
  } else{
    next()
  }
}
function validateUserName(req, res, next){
    Users.findUsername(req.body.username)
      .then(username=>{
        // console.log(username.length)
        if(username.length === 1){
          res.status(400).json("username taken")
        } else {
          next();
        }
      })
      .catch(error=>{
        res.status(500).json({ message: error.message });
      })
}

module.exports = router;
