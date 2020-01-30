const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//using middleware functions
app.use(bodyParser.json());                     // to support JSON bodies
app.use(bodyParser.urlencoded({                 // to support URL-encoded bodies
  extended: true
}));
app.use(cors());                                //to add cors header
app.use(cookieParser());
app.use(express.static('public'));

//defining routes
const login = require("./routes/login");
app.use('/login', login);

const comments = require("./routes/comments");
app.use('/comments', comments);

const vote = require("./routes/vote");
app.use('/vote', vote);

const post = require("./routes/post");
app.use('/post', post);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//Server listening
app.listen(4000, (a) => console.log("Listening on port 4000"));
