const express = require('express');
const router = express();
const jwt = require('jsonwebtoken');
const status = require('http-status');

const secretKey = '10101010129299393939848';

function verifyToken(request, response, next){
    const token = request.headers['Authorization'];
    console.log(token)
    if(!token){
        console.log("l")
        return response.status(status.UNAUTHORIZED).json({error: "No token provided"});
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if(err){
            console.log("k")
            return response.status(status.UNAUTHORIZED).json({error: "Failed to authenticate"});
        }

        request.decoded = decoded;
        console.log(request.decoded);
        next();
    })
}

module.exports = verifyToken;