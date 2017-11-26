'use strict';

const faker = require('faker');
const Recipe = require('../../model/recipe-model');

const mockRecipe = module.exports = {};

mockRecipe.createOne = () => {
  return new Recipe({
    _id: faker.random.uuid(),
    recipeName: faker.lorem.word(),
    notes: faker.lorem.words(),
    resources: faker.internet.url(),
    favorite: faker.random.boolean(),
    dateCreated: Date.now(),
    photo: faker.image.imageUrl(),
  });
};
