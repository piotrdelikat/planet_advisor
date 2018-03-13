const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = require('./routes/api');
const app = express();

mongoose.connect('mongodb://<dbuser>:<password>@ds111319.mlab.com:11319/planet_advisor');
mongoose.Promise = global.Promise;


app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/api', router)


app.listen(process.env.PORT || 4000, function() {
  console.log('App started on port 4000');
});
