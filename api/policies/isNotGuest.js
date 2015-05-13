var Roles = require('../enums/Roles');

/**
 * isNotGuest
 *
 * @module      :: Policy
 * @description :: Policy to denies access to an authenticated user a 'Guest' role
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 *
 */
module.exports = function isNotGuest (req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  var role = req.session.role || '';

  if (req.session.role && req.session.role !== Roles.guest) {
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.forbidden('You are not permitted to perform this action.');
};