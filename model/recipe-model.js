'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  recipeName: { type: String, required: true },
  notes: {type: String},
  resources: { type: String },
  favorite: { type: Boolean },
  dateCreated: { type: Date, default: Date.now },
  photo: { type: String },
});

module.exports = mongoose.model('recipe', recipeSchema);
