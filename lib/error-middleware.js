'use strict';

const createError = require('http-errors');
const debug = require('debug')('recipes:error-middleware');

module.exports = (err, req, res, next) => {
  debug('#error-middleware');

  console.error('message', err.message);
  console.error('name', err.name);
  
  err.message = err.message.toLowerCase();

  if (err.message.includes('validation failed'))
    return res.sendStatus(400);

  // if duplicate key respond with 409
  if (err.message.includes('duplicate key'))
    return res.sendStatus(409);

  if (err.message.includes('objectid failed'))
    return res.sendStatus(404);

  if (err.message.includes('unauthorized'))
    return res.sendStatus(401);

  res.sendStatus(500);

};