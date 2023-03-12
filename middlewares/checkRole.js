const { verifyToken } = require('../helpers/createToken');
const Patient = require('../models/patient');
const Hospital = require('../models/hospital');
const Physician = require('../models/physician');

// version 1: accepts roles and idToAllow parameters
const checkRole = (roles, idToAllow) => async (req, res, next) => {
  try {
    let token = null;
    if (req.headers['x-access-token'] === undefined) {
      token = req.body.token;
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token'];
    }

    if (token) {
      const tokenVerified = await verifyToken(token);

      const patientAuthorized = await Patient.findOne({ identification: tokenVerified.id });
      const hospitalAuthorized = await Hospital.findOne({ identification: tokenVerified.id });
      const physicianAuthorized = await Physician.findOne({ identification: tokenVerified.id });

      let userAuthorized = '';
      patientAuthorized ? (userAuthorized = patientAuthorized) : hospitalAuthorized ? (userAuthorized = hospitalAuthorized) : physicianAuthorized ? (userAuthorized = physicianAuthorized) : '';

      if ([].concat(roles).includes(userAuthorized?.role)) {
        if (userAuthorized.identification === idToAllow) {
          console.log('iguales');
          next()
        } else {
          console.log('no iguales');
          res.status(401).send({ msg: 'Unauthorized user' });
        }
      } else {
        res.status(401).send({ msg: 'Unauthorized user' });
      }
    } else {
      res.status(401).send({ msg: 'Token missing' });
    }
  } catch (error) {
    console.log(error);
  }
};

// version 2: accepts roles only
const checkRoleWithoutId = (roles) => async (req, res, next) => {
  try {
    let token = null;
    if (req.headers['x-access-token'] === undefined) {
      token = req.body.token;
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token'];
    }

    if (token) {
      const tokenVerified = await verifyToken(token);

      const patientAuthorized = await Patient.findOne({ identification: tokenVerified.id });
      const hospitalAuthorized = await Hospital.findOne({ identification: tokenVerified.id });
      const physicianAuthorized = await Physician.findOne({ identification: tokenVerified.id });

      let userAuthorized = '';
      patientAuthorized ? (userAuthorized = patientAuthorized) : hospitalAuthorized ? (userAuthorized = hospitalAuthorized) : physicianAuthorized ? (userAuthorized = physicianAuthorized) : '';

      console.log("USER AUTHORIZED",userAuthorized)
      if ([].concat(roles).includes(userAuthorized?.role)) {
        next();
      } else {
        res.status(401).send({ msg: 'Unauthorized user' });
      }
    } else {
      res.status(401).send({ msg: 'Token missing' });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { checkRole, checkRoleWithoutId };
