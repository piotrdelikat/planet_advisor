const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Planet = require('../models/planets');


router.get('/planets', function(req, res) {
  Planet.find({}, function(err, data) {
    if (err) throw err;
    res.send(data);
  });
});


router.get('/comments', function(req, res) {
  let planet_id = req.query.planet;
  let comments = [];

  if (planet_id) {
    Planet.findById(planet_id, function(err, planet) {
      if (err) throw err;
      comments = comments.concat(planet.comments);
      res.json({"planetId": planet_id, "comments": comments})
    });
  } else {
    Planet.find({}, function(err, planet) {
      if (err) throw err;
      for (i = 0; i < planet.length; i++) {
        comments = comments.concat(planet[i].comments);
      }
      res.json({"comments": comments});
    });
  };
});


router.post('/planets', function(req, res, next) {
  if (typeof req.body.name  === 'string') {
    Planet.create(req.body).then(function(planet) {
      res.status(201).send(planet);
    })
  } else {
    res.status(422).json({errorMessage: 'Planet name should be a string'})
  }
});


router.post('/comments', function(req, res) {
  if (typeof req.body.comment  === 'string') {
    Planet.findById(req.body.id, function(err, planet) {
      if (err) throw err;
      planet.comments.push(req.body.comment);
      planet.save(function(err, data) {
        if (err) throw err
        res.status(201).json({"newComment": data.comments[data.comments.length - 1]});
      });
    });
  } else {
    res.status(422).json({errorMessage: 'Comment name should be a string'})
  }
});


router.delete('/planets/:id', verifyToken, function(req, res) {
  console.log(req.params.id);
  jwt.verify(req.token, 'secretkey', function(err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      console.log(authData);
      Planet.findByIdAndRemove(req.params.id).then(function(planet) {
        res.send(planet);
      })
    }
  });
});

router.post('/login', function(req, res) {
  //mock user
  const user = {
    id: 1,
    username: 'Testing',
    email: 'test@test.co'
  }

  jwt.sign({user:user}, 'secretkey', function(err, token) {
    res.json({
      token:token
    });
  });
});

function verifyToken(req, res, next) {
  const BearerHeader = req.headers['authorization'];

  if (typeof BearerHeader !== 'undefined') {
    const Bearer = BearerHeader.split(' ');
    const bearerToken = Bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
