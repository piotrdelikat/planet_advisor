const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for the database
// const CommentsSchema = new Schema({
//   text: String
// });

const PlanetsSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Planet name is required field']
  },
  comments: {
    type: [String]
  }
});

//Model for the data
const Planet = mongoose.model('planet', PlanetsSchema);

module.exports = Planet;
