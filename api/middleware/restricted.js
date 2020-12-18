const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config/secret')

module.exports = (req, res, next) => {

  const token = req.headers.authorization
  if (!token) {
      res.status(401).json('token required')
    } else {
      // check it with jwt (async form verify)
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          res.status(401).json('token invalid')
        } else {
          // token valid and not expired,
          // tack the decoded token to req and proceed
          req.decodedToken = decoded
          next()
        }
      })
    }

  // next();
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
