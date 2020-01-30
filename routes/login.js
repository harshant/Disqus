const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const { api_endpoint, jwt_secret, hasura_key } = require('../config/config');


router.post('/', function (req, res) {

  /**
  *If user name is present in record assign a JWT
  *Else if the user in new user, create a user record
  *and then assing a JWT
  */

  let user_name = req.body.user_name;
  let user_pass = req.body.user_pass;

  // Checking if user exist in users table
  fetch(api_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': hasura_key
    },
    body: JSON.stringify({
      "query": `query GetUser {
                  users(where: {
                  user_name: {_eq: "${user_name}"}}) {
                    user_name
                    user_pass
                    user_id
                    avatar_no
                  }
                }
              `,
      "variables": null
    }),
  })
    .then(response => response.json())
    .then(json => {

      if (json.data) {

        if (json.data.users.length > 0 && user_pass.toString() !== json.data.users[0].user_pass.toString()) {
          res.json({ "msg": "Wrong Password" });
          return;
        }

        if (json.data.users.length > 0) {
          //user exists
          //Signing JWT token with validity of one year
          let token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30 * 12),
            iat: Math.floor(Date.now() / 1000),
            "https://hasura.io/jwt/claims": {
              "x-hasura-allowed-roles": ["user"],
              "x-hasura-default-role": "user",
              "x-hasura-user_id": json.data.users[0].user_id.toString(),
              "x-hasura-avatar_no": json.data.users[0].avatar_no.toString(),
              "x-hasura-user_name": json.data.users[0].user_name
            }
          }, jwt_secret);

          res.json({
            "token": token,
            "new": false,
            "user_id": json.data.users[0].user_id,
            "success": true
          });

        } else {
          //Creating a new user and then assigning a JWT
          const avatar_no = parseInt(Math.random() * (+10 - +1) + +1) //Generating avatar no between 1 and 10
          fetch(api_endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-hasura-admin-secret': hasura_key
            },
            body: JSON.stringify({
              "query": `mutation CreateUser {
                  insert_users(objects: 
                    {user_name: "${user_name}", 
                    user_pass: "${user_pass}",
                    avatar_no: ${avatar_no}}) {
                    returning {
                      user_id
                      user_name
                      avatar_no
                    }
                  }
                }
              `,
              "variables": null
            }),
          })
            .then(response1 => response1.json())
            .then(json1 => {

              if (json1.data && json1.data.insert_users.returning.length > 0) {
                //Signing JWT token with validity of one year
                let token = jwt.sign({
                  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30 * 12),
                  iat: Math.floor(Date.now() / 1000),
                  "https://hasura.io/jwt/claims": {
                    "x-hasura-allowed-roles": ["user"],
                    "x-hasura-default-role": "user",
                    "x-hasura-user_id": json1.data.insert_users.returning[0].user_id.toString(),
                    "x-hasura-avatar_no": json1.data.insert_users.returning[0].avatar_no.toString(),
                    "x-hasura-user_name": json1.data.insert_users.returning[0].user_name
                  }
                }, jwt_secret);

                res.json({
                  "token": token,
                  "new": true,
                  "user_id": json1.data.insert_users.returning[0].user_id,
                  "success": true
                });

              } else {
                res.json({ "msg": json1.errors[0].extensions.code })        //error code thrown by Hasura
              }

              return json1;
            })
            .catch(function (error) {
              res.json({ "msg": "Internal Server Error" });
            });
        }

      } else {
        res.json({ "msg": json.errors[0].extensions.code })
      }

      return json;
    })
    .catch(function (error) {
      res.json({ "msg": "Internal Server Error" });
    });
})

module.exports = router;
