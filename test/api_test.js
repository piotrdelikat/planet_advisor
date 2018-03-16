process.env.NODE_ENV = 'test';

//const mongoose = require("mongoose");
const Planet = require('../models/planets');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('Clear DB', () => {
    beforeEach((done) => { //Before each test we empty the database
        Planet.remove({}, (err) => {
           done();
        });
    });


  describe('GET/ api/planets', function() {
    it('it should GET all the planets', function(done) {
      let planet = new Planet({ name: "Teesting" });
      planet.save((err, planet) => {
        chai.request(app)
          .get('/api/planets')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
          done();
          });
      });
    });
  });

  describe('GET/ api/comments', () => {
    it('it should GET all existing comments', (done) => {
      let planet_one = new Planet({ name: "Teesting", comments: ["Under control of Empire!", "Too sandy, not recomend!"]});
      let planet_two = new Planet({ name: "Bamboo", comments: ["Best food in that system"]});
        planet_one.save((err, planet_one) => {
          planet_two.save((err, planet_two) => {
            chai.request(app)
              .get('/api/comments')
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('comments');
                res.body.comments.length.should.be.eql(3);
                done();
            });
        });
      });
    });
    it('it should GET comments for planet by ID', (done) => {
      let planet_one = new Planet({ name: "Teesting", comments: ["Under control of Empire!", "Too sandy, not recomend!"]});
      let planet_two = new Planet({ name: "Bamboo", comments: ["Best food in that system"]});
        planet_one.save((err, planet_one) => {
          planet_two.save((err, planet_two) => {
            chai.request(app)
              .get('/api/comments?planet=' + planet_one._id)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('comments');
                res.body.comments.length.should.be.eql(2);
                done();
            });
          });
        });
      });
  });

  describe('POST /planet', () => {
    it('should not POST a planet name if name is not a string', (done) => {
      let testPlanet = {
        name: 794
      }
      chai.request(app)
        .post('/api/planets')
        .send(testPlanet)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('errorMessage').eql("Planet name should be a string");
          done()
        });
    });
    it('should POST a planet name and return brand new object with the planet saved to DB', (done) => {
      let testPlanet = {
        name: "Teesting"
      }
      chai.request(app)
        .post('/api/planets')
        .send(testPlanet)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('name').eql(testPlanet.name);
          res.body.should.have.property('_id');
          res.body.should.have.property('comments');
          done()
      });
    });
  });
  describe('POST /comment', () => {
    it('should POST a comment for a given planet and return the comment back', (done) => {
      let planet = new Planet({ name: "Teesting" });
        planet.save((err, planet) => {
          let testComment = {
            "id": planet._id,
          	"comment": "test comment"
          };
          chai.request(app)
            .post('/api/comments')
            .send(testComment)
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property("newComment").eql("test comment");
            done();
          });
        });
    });
  });
  describe('DELETE /planets', () => {
    it('should not be able to delete planet without authorization', (done) => {
      let planet = new Planet({ name: "Teesting" });
        planet.save((err, planet) => {
          chai.request(app)
            .delete('/api/planets/' + planet._id)
            .end((err, res) => {
              res.should.have.status(403);
            done();
          });
        });
    });
    it('should be able to delete planet with authorization token in header', (done) => {
      let planet = new Planet({ name: "Teesting" });
        planet.save((err, planet) => {
          chai.request(app)
            .delete('/api/planets/' + planet._id)
            .set('Authorization', process.env.AUTH_TOKEN)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('name').eql(planet.name);
              res.body.should.have.property('_id').eql(planet._id.toString());
              res.body.should.have.property('comments').eql(planet.comments);
            done();
          });
        });
    });
  });
});
