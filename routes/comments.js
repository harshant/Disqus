const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { api_endpoint, hasura_key } = require('../config/config');


router.post('/', function (req, res) {

  let offset = req.body.offset;

  fetch(api_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': hasura_key
    },
    body: JSON.stringify({
      "query": `query GetComment {
                  comment(order_by: {timestamp: desc}, 
                    where: {is_reply: {_eq: false}}, 
                      limit: 5, 
                      offset: ${offset}) {
                        comment
                        comment_id
                        timestamp
                        user {
                          user_name
                          user_id
                          avatar_no
                        }
                        votes_aggregate {
                          aggregate {
                            sum {
                              value
                            }
                          }
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
        res.json({ "data": json.data.comment })
      } else {
        res.json({ "msg": json.errors[0].extensions.code })                 //error code thrown by Hasura
      }

      return json;
    })
    .catch(function (error) {
      res.json({ "msg": "Internal Server Error" });
    });
})

router.post('/replys', function (req, res) {

  let comment_id = req.body.comment_id;

  fetch(api_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': hasura_key
    },
    body: JSON.stringify({
      "query": `query GetRely {
        reply(where: {reply_on: {_eq: ${comment_id}}}) {
          commentByReply {
            comment
            comment_id
            timestamp
            user {
              avatar_no
              user_name
              user_id
            }
            votes_aggregate {
              aggregate {
                sum {
                  value
                }
              }
            }
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
        res.json({ "data": json.data.reply })
      } else {
        res.json({ "msg": json.errors[0].extensions.code })                 //error code thrown by Hasura
      }

      return json;
    })
    .catch(function (error) {
      res.json({ "msg": "Internal Server Error" });
    });

});

module.exports = router;
