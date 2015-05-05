var Roles = require('../../enums/Roles');
var Q = require('q');

/**
 * User Controller
 */
var UserController = {

  /**
   * Return a map of user roles
   *
   * GET /adminpanel/roles
   *
   * @param {Object} req
   * @param {Object} res
   */
  roles: function (req, res) {
    return res.json(Roles.map());
  },

  /**
   * Return user by id
   *
   * Optionally add CSRF-protection as outlined in the documentation:
   * http://sailsjs.org/#!/documentation/concepts/Security/CSRF.html
   *
   * * GET /adminpanel/users/<id>
   *
   * @param {Object} req
   * @param {Object} res
   */
  find: function (req, res) {
    User.findOne({ id: req.param('id') }, function (err, user) {
      if (err) {
        return res.negotiate(err);
      }
            
      if (!user) {
        return res.send(404, 'User not found.');
      }
      return res.json(user);
    });
  },

  /**
   * Return list of users
   *
   * Optionally add CSRF-protection as outlined in the documentation:
   * http://sailsjs.org/#!/documentation/concepts/Security/CSRF.html
   *
   * GET /adminpanel/users
   *
   * @param {Object} req
   * @param {Object} res
   */
  list: function(req, res) {
        
    if (!req.wantsJSON) {
      return res.view
        ({
            title: 'My App',
            //bodyAttr: 'ng-app="UserModule" ng-controller="UserListController" ng-cloak',
            bodyAttr: 'ng-app="UserModule" ng-cloak',
            layout: 'layout'
        });
    }

    var findOptions = {};
    if (req.param('filter') && req.param('filter').length > 0) {
      var findOptions = {
        or: [
          { like: { username: '%'+ req.param('filter') +'%' } },
          { like: { email: '%'+ req.param('filter') +'%' } } ]
      };
    }

    var pageOptions = {
        page: req.param('page') || 1,
        limit: req.param('limit') || 10,
        sort: 'id asc'
    };
    if (req.param('sort') && 
        (req.param('sortDir') && (req.param('sortDir').toLowerCase() === 'asc' || req.param('sortDir').toLowerCase() === 'desc'))) {
      pageOptions.sort = req.param('sort') +' '+ req.param('sortDir');
    }

    Q.all([
      User.count(findOptions),
      User.find(findOptions)
        .sort(pageOptions.sort)
        .paginate({ page: pageOptions.page, limit: pageOptions.limit })
    ]).spread(function (count, data) {
      return res.json({
        Items: data,
        Count: count
      });
    }).catch(function(err) {
      return res.negotiate(err);
    });
  },

  /**
   * Save a user
   *
   * Optionally add CSRF-protection as outlined in the documentation:
   * http://sailsjs.org/#!/documentation/concepts/Security/CSRF.html
   *
   * POST /adminpanel/users/update
   *
   * @param {Object} req
   * @param {Object} res
   */
  update: function(req, res) {
    var user = typeof req.param('user') === 'object' ? req.param('user') : null;
    if (!user || !user.id) {
      return res.send(409, 'Required user object missing');
    }

    // Ensure username and email are unique.  Note, the waterline model unique key
    // currently is not case insensitive.
    // http://real-ly-happy.com/multiple-query-model-in-sails-js-with-promises/
    Q.all([
      User.count({ id: { '!': user.id }, username: user.username }),
      User.count({ id: { '!': user.id }, email: user.email })
    ]).spread(function (countUserName, countEmail) {
      if (countUserName > 0) return res.send(409, 'User name already is taken');
      if (countEmail > 0) return res.send(409, 'Email already is taken');

      // Update user
      delete user.createdAt;
      delete user.updatedAt;
      User.update({ id: user.id}, user)
      .exec(function(err, data) {
        if (err) {
          if (err.message && (/E11000/.test(err.message) && /duplicate key/.test(err.message))) {
            if (/username/.test(err.message)) {
              return res.send(409, 'User name already is taken');
            } else if (/email/.test(err.message)) {
              return res.send(409, 'Email already is taken');
            }
          }
          return res.negotiate(err);
        }
        return res.json(data);
      });
    }).catch(function(err) {
      return res.negotiate(err);
    });
  },

  /**
   * Delete a user
   *
   * Optionally add CSRF-protection as outlined in the documentation:
   * http://sailsjs.org/#!/documentation/concepts/Security/CSRF.html
   *
   * DELETE /adminpanel/users/destroy
   *
   * @param {Object} req
   * @param {Object} res
   */
  destroy: function(req, res) {
    var userId = typeof req.param('id') === 'string' ? req.param('id') : null;
    if (!userId) {
      return res.send(409, 'id is required');
    }

    Q.all([
      User.count({ id: userId }),
      Passport.count({ user: userId, protocol: 'local' })
    ]).spread(function (userCount, passportCount) {
      if (userCount === 0 || passportCount === 0) return res.send(409, 'User not found');

      // Delete password
      Passport.destroy({ user: userId, protocol: 'local' })
      .exec(function(err, result) {
        if (err) return res.negotiate(err);

        User.destroy({ id: userId })
        .exec(function(err2, result) {
          if (err) return res.negotiate(err);
          return res.json({});
        });
      });
    }).catch(function(err) {
      return res.negotiate(err);
    });
  },

  /**
   * Update password
   *
   * Optionally add CSRF-protection as outlined in the documentation:
   * http://sailsjs.org/#!/documentation/concepts/Security/CSRF.html
   *
   * POST /adminpanel/users/password
   *
   * @param {Object} req
   * @param {Object} res
   */
  password: function(req, res) {
    var userId = typeof req.param('id') === 'string' ? req.param('id') : null;
    var password = typeof req.param('password') === 'string' ? req.param('password') : null;
    if (!userId || !password) {
      return res.send(409, 'id and password required');
    }

    Q.all([
      Passport.count({ user: userId, protocol: 'local' })
    ]).spread(function (count) {
      if (count === 0) return res.send(409, 'User not found');

      // Update password
      Passport.update({ user: userId, protocol: 'local' }, { password: password })
      .exec(function(err, data) {
        if (err) return res.negotiate(err);
        return res.json({});
      });
    }).catch(function(err) {
      return res.negotiate(err);
    });
  }
};

module.exports = UserController;
