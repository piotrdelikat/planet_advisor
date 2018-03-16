const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const mongoose = require('mongoose');
const app = express();
require('dotenv').load();

const router = require('./routes/api');

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const DBHost = config.DB_HOST + dbUser + ":" + dbPassword + config.DB_ADDRESS;
mongoose.connect(DBHost);
mongoose.Promise = global.Promise;

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/api', router)


app.listen(app.get('port'), function() {
  console.log('App started on port ' + app.get('port'));
});

module.exports = app;
