const mongoose = require('mongoose');
// FIXME: move this url to env variable
const MONGO_URL = 'mongodb+srv://olehlavryk:olehlavryk@nasacluster.z5gmyms.mongodb.net/nasa?retryWrites=true&w=majority'

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