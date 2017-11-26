'use strict';

require('dotenv').config({ path: `${__dirname}/../.test.env`});

const expect = require('chai').expect;
const superagent = require('superagent');
const server = require('../lib/server');
const clearDB = require('./lib/clear-db');
const mockRecipe = require('./lib/mock-recipe');

const url = `http://localhost:${process.env.PORT}`;

describe('testing /api/recipe', () =>{
  before(server.start);
  afterEach(clearDB);
  after(server.stop);

  describe('testing POST /api/recipe', () => {
    let recipe = mockRecipe.createOne();

    it('with a valid request, it should respond with status 200', done => {
      superagent.post(`${url}/api/recipe/create`)
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

    it('with a valid request, it should create a recipe', done => {
      superagent.post(`${url}/api/recipe/create`)
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

    it('with an invalid request, it should respond with status 400', done => {
      superagent.post(`${url}/api/recipe/create`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
  });
});