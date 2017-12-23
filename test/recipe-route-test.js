'use strict';

require('dotenv').config({ path: `${__dirname}/../.test.env`});

const expect = require('chai').expect;
const superagent = require('superagent');
const server = require('../lib/server');
const clearDB = require('./lib/clear-db');
const mockRecipe = require('./lib/mock-recipe');

const Recipe = require('../model/recipe-model');

const url = `http://localhost:${process.env.PORT}`;

describe('testing /api/recipe', () =>{
  before(server.start);
  afterEach(clearDB);
  after(server.stop);

  describe('testing POST /api/recipe', () => {
    let recipe = mockRecipe.createOne();

    it('should respond with status 200 with a valid request', done => {
      superagent.post(`${url}/api/recipes`)
      // resources, favorite, dateCreated, photo
        .send({
          recipeName: `${recipe.recipeName}`, 
          notes: `${recipe.notes}`,
          resources: `${recipe.resources}`,
          favorite: `${recipe.favorite}`,
          dateCreated: `${recipe.dateCreated}`,
          photo: `${recipe.photo}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('it should create a recipe with a valid request', done => {
      superagent.post(`${url}/api/recipes`)
        .send({
          recipeName: `${recipe.recipeName}`, 
          notes: `${recipe.notes}`,
          resources: `${recipe.resources}`,
          favorite: `${recipe.favorite}`,
          dateCreated: `${recipe.dateCreated}`,
          photo: `${recipe.photo}`,
        })
        .end((err, res) => {
          expect(res.body._id).to.exist;
          expect(res.body.recipeName).to.exist;
          expect(res.body.notes).to.exist;
          expect(res.body.resources).to.exist;
          expect(res.body.favorite).to.exist;
          expect(res.body.dateCreated).to.exist;
          expect(res.body.photo).to.exist;
          expect(res.body.recipeName).to.be.a('string');
          expect(res.body.notes).to.be.a('string');
          expect(res.body.resources).to.be.a('string');
          expect(res.body.favorite).to.be.a('boolean');
          expect(res.body.dateCreated).to.be.a('string');
          expect(res.body.photo).to.be.a('string');
          done();
        });
    });

    it('it should respond with status 400 with an invalid request', done => {
      superagent.post(`${url}/api/recipes`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

  describe('testing GET /api/recipe', () => {
    it('should fetch all recipes', () => {
      
      function checkData(arr) {
        return arr.map(item => {
          expect(item._id).to.exist;
          expect(item.recipeName).to.exist;
          expect(item.notes).to.exist;
          expect(item.resources).to.exist;
          expect(item.favorite).to.exist;
          expect(item.dateCreated).to.exist;
          expect(item.photo).to.exist;
          expect(item.recipeName).to.be.a('string');
          expect(item.notes).to.be.a('string');
          expect(item.resources).to.be.a('string');
          expect(item.favorite).to.be.a('boolean');
          expect(item.dateCreated).to.be.a('string');
          expect(item.photo).to.be.a('string');
        });
      }

      return mockRecipe.createMany()
        .then(() => {
          return superagent.get(`${url}/api/recipes`);
        })
        .then(res => {
          expect(res.body).to.be.an('Array');
          expect(res.body).to.have.lengthOf(3);
          expect(res.status).to.equal(200);
          checkData(res.body);
        });
    });

    it('should respond with status 404 with an invalid request', done => {
      superagent.post(`${url}/api/recipe`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });
  });

  describe('testing GET /api/recipes/:id', () => {
    it('should respond with a list', () => {
      let tempRecipe;
      return mockRecipe.createOne()
        .save()
        .then(recipe => {
          tempRecipe = recipe;
          return superagent.get(`${url}/api/recipes/${recipe._id}`);
        })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.recipeName).to.equal(tempRecipe.recipeName);
          expect(res.body.notes).to.equal(tempRecipe.notes);
          expect(res.body.resources).to.equal(tempRecipe.resources);
          expect(res.body.favorite).to.equal(tempRecipe.favorite);
          expect(res.body.dateCreated).to.exist;
          expect(res.body._id).to.equal(tempRecipe._id.toString());
          expect(res.body.photo).to.equal(tempRecipe.photo);
        });
    });

    it('should respond with status 404 with an invalid request', () => {
      return superagent.get(`${url}/api/recipes/12345`)
      .then(null, res => {
        expect(res.status).to.equal(404); //passing, but not sure if this is handled correctly
      });
    });
  });

  describe('testing DELETE /api/recipes/:id', () => {
    it('should return delete the recipe and return status 204', done => {
      let recipe = mockRecipe.createOne();
      superagent.delete(`${url}/api/recipes/${recipe._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
    });

    it('with invalid id, it should return a 404 status', done => {
      let recipe = mockRecipe.createMany();
      superagent.delete(`${url}/api/recipes/${recipe._id}wrongId`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });
  });

  describe('testing PUT /api/recipes/:id', () => {
    it('should return the recipe with updated info', () => {
      let mockUpdate = {recipeName: 'breakfast tacos', notes: 'add avocado and hot sauce', favorite: true};
      return mockRecipe.createOne()
        .save()
        .then(recipe => {
          return superagent.put(`${url}/api/recipes/${recipe._id}`)
          .send(mockUpdate)
          .then(res => {
            expect(res.status).to.equal(200);
            expect(res.body.recipeName).to.equal(mockUpdate.recipeName);
            expect(res.body.notes).to.equal(mockUpdate.notes);
            expect(res.body.favorite).to.equal(mockUpdate.favorite);
            expect(res.body.resources).to.equal(recipe.resources);
            expect(res.body.dateCreated).to.exist;
            expect(res.body._id).to.equal(recipe._id.toString());
            expect(res.body.photo).to.equal(recipe.photo);
          });
        });
    });

    it('should return a 404 status with invalid request', () => {
      let mockReq = { recipeName: 'quesadillas'};
      return mockRecipe.createOne()
        .save()
        .then(recipe => {
          return superagent.put(`${url}/api/recipes/${recipe._id}badrequest`)
          .send(mockReq)
          .catch(err => {
            expect(err.status).to.equal(404);
          });
        });
    });
  });
});