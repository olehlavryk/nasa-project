const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

const keplerFilePath = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv');

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36
    && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(keplerFilePath)
      .pipe(parse({
        comment: '#',
        columns: true
      }))
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on('error', (error) => {
        console.log(error);
        reject(error);
      })
      .on('end', async () => {
        const countFoundPlanets = (await getAllPlanets()).length;
        console.log(`${countFoundPlanets} habitable planets found!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  try {
    return await planets.find({}, { __v: 0, _id: 0 });
  } catch (error) {
    console.error(`Could not get planets ${error}`);
  }
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (error) {
    console.error(`Could not save a planet ${error}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets
}
