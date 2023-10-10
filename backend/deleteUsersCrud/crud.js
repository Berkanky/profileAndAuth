const express = require('express');
const app = express.Router();
const User = require('../auth/schema')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const MyNotifies = require('../notify/schema')
const Deleteduser = require('./schema')







module.exports = app