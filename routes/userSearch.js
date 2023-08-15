var express = require("express");
var router = express();
var database = require("../database");

router.get("/usersearch", function(request, response){
    let username = request.query.username;

    if(username){
        database.query("select username, first_name, last_name, address from users where username = ?", [username], 
        function(error, results){
          try { 
            if(results.length > 0){
                return response.status(200).json({data: results});
            } else {
                return response.status(400).json({error: "Incorrect username"});
            }
        } catch(error){
            return response.status(500).json({error: "Internal server error"});
        }
        })
    } else {
        return response.status(401).json({error: "Enter username"});
    }
})
module.exports = router;