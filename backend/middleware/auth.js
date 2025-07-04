const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ msg: "No token, access denied" });

  try {
    const verified = jwt.verify(token, "yourSecretKey");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
}

module.exports = auth;
