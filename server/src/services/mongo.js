const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open', () => {
  console.log('Mongo DB connection ready!');
});

mongoose.connection.once('error', (error) => {
  console.log(`An error occurred ${error}`);
})

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect
};