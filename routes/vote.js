const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { api_endpoint, hasura_key } = require('../config/config');

router.post('/', function (req, res) {

  let comment_id = req.body.comment_id;
  let vote = req.body.vote;
  let jwt_token = req.header('Authorization');

  // Checking if user exist in users table
  fetch(api_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt_token
    },
    body: JSON.stringify({
      "query": `mutation Vote {
                insert_vote(objects: 
                  {user_id: ${JSON.parse(Buffer.from(jwt_token.split(".")[1], 'base64').toString('binary'))["https://hasura.io/jwt/claims"]["x-hasura-user_id"]}, 
                  comment_id: ${comment_id}, 
                  value: ${vote}}, on_conflict: {constraint: vote_pkey, update_columns: value}) {
                  returning {
                    value
                  }
                }
              }
              `,
      "variables": null
    }),
  })
    .then(response => response.json())
    .then(json => {
      if (json.data) {
        res.json({ "success": true })
      } else {
        res.json({ "msg": json.errors[0].extensions.code })                 //error code thrown by Hasura
      }

      return json;
    })
    .catch(function (error) {
      res.json({ "msg": "Internal Server Error" });
    });

})

module.exports = router;