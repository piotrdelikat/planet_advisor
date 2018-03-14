const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const router = require('./routes/api');

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
mongoose.connect('mongodb://'+ dbUser +':' + dbPassword + '@ds111319.mlab.com:11319/planet_advisor');
mongoose.Promise = global.Promise;

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/api', router)


app.listen(app.get('port'), function() {
  console.log('App started on port ' + app.get('port'));
});
