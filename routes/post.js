const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { api_endpoint, hasura_key } = require('../config/config');

router.post('/', function (req, res) {

  let post = req.body.post;
  let jwt_token = req.header('Authorization');

  // Creating post(comment) on behalf of the user
  fetch(api_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt_token
    },
    body: JSON.stringify({
      "query": `mutation CreateComment {
                    insert_comment(objects: 
                      {is_reply: false, 
                        comment: "${post}", 
                        timestamp: "${Math.round(new Date().getTime() / 1000)}", 
                        user_id: ${JSON.parse(Buffer.from(jwt_token.split(".")[1], 'base64').toString('binary'))["https://hasura.io/jwt/claims"]["x-hasura-user_id"]}}) {
                      returning {
                        comment_id
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


router.post('/reply', function (req, res) {

  let reply = req.body.reply;
  let reply_on = req.body.reply_on;
  let jwt_token = req.header('Authorization');

  // making reply on comment with id reply_on
  fetch(api_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt_token
    },
    body: JSON.stringify({
      "query": `mutation PostReply {
        insert_reply(objects: 
          {reply_on: ${reply_on}, 
            commentByReply: {data: 
              {comment: "${reply}", 
              is_reply: true, 
              timestamp: "${Math.round(new Date().getTime() / 1000)}", 
              user_id: ${JSON.parse(Buffer.from(jwt_token.split(".")[1], 'base64').toString('binary'))["https://hasura.io/jwt/claims"]["x-hasura-user_id"]}}}}) {
          returning {
            reply_id
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