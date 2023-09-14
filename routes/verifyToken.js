const express = require("express");
const router = express();
const jwt = require("jsonwebtoken");
const status = require("http-status");

const secretKey = "10101010129299393939848";

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Bearer Token not provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }

    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
