const mongoose = require('mongoose');
const schemas = require('./schemas');

let models = {};
schemas.forEach((schema) => {
  const mySchema = new mongoose.Schema(schema.fields, { timestamps: true });
  models[schema.name] = mongoose.model(schema.name, mySchema);
});

mongoose.connect('mongodb://127.0.0.1:27017/e_commerce');

module.exports = models;
