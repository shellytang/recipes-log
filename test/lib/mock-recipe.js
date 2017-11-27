'use strict';

const faker = require('faker');
const Recipe = require('../../model/recipe-model');

const mockRecipe = module.exports = {};

mockRecipe.createOne = () => {
  return new Recipe({
    // _id: faker.random.uuid(),
    recipeName: faker.lorem.word(),
    notes: faker.lorem.words(),
    resources: faker.internet.url(),
    favorite: faker.random.boolean(),
    dateCreated: Date.now(),
    photo: faker.image.imageUrl(),
  });
};

mockRecipe.createMany = () => {
  // let create1 = await mockRecipe.createOne();
  // let create2 = await mockRecipe.createOne();
  // let create3 = await mockRecipe.createOne();

  // let allRecipes = [];
  // await allRecipes.push(create1, create2, create3);
  // allRecipes.map(item => {
  //   item.save();
  // });
  
  let promises = [
    new Promise(resolve => resolve(mockRecipe.createOne())),
    new Promise(resolve => resolve(mockRecipe.createOne())),
    new Promise(resolve => resolve(mockRecipe.createOne())),
  ];

  return Promise.all(promises)
    .then(data => 
      data.map(item => {
        item.save();
        // return data;
      }));
};