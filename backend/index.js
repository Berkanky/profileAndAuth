const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();


const uri = 'mongodb://localhost:27017/projectvolone'
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose.connect(uri, options)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

  app.use(cors({
    origin:'*',
  })); 
  app.use(express.json({ limit: '350mb' }));
  app.use(express.urlencoded({ limit: '350mb', extended: true }));

const testCrud = require('./test/crud')
const authCrud = require('./auth/crud')
const notifiesCrud = require('./notify/crud')
const updateProfileCrud = require('./updateProfile/crud')
const otherCrud = require('./otherMethods/crud')
const deleteAccCrud = require('./deleteAccCrud/crud')
const deleteUserCrud = require('./deleteUsersCrud/crud')
const uploadProfileStepperCrud = require('./uploadProfileStepper/crud')
const advertiseCrud = require('./jobAdvertise/crud')
app.use('/app',
    testCrud,
    authCrud,
    notifiesCrud,
    updateProfileCrud,
    otherCrud,
    deleteAccCrud,
    deleteUserCrud,
    uploadProfileStepperCrud,
    advertiseCrud
)

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});