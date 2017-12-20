'use strict';

const Recipe = require('../model/recipe-model');

module.exports = router => {
  router.post('/recipes', (req, res, next) => {
    return new Recipe(req.body)
      .save()
      .then(recipe => res.json(recipe))
      .catch(next);
  });

  router.get('/recipes', (req, res, next) => {
    Recipe.find({})
      .then(recipe => {
        res.json(recipe);
      })
      .catch(next);
  });

  router.get('/recipes/:id', (req, res, next) => {
    Recipe.findById(req.params.id)
    .then(recipe => {
      res.json(recipe);
    })
    .catch(next);
  });

  router.delete('/recipes/:id', (req, res, next) => {
    Recipe.findByIdAndRemove(req.params.id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch(next);
  });

  return router;
};