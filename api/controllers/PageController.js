var Roles = require('../enums/Roles');

/**
 * PageController
 */
module.exports = {

  home: function (req, res) {

    // If not logged in, show the public view.
    if (!req.session.authenticated) {
      return res.view('home',
        {
          title: 'My App',
          bodyAttr: 'ng-app="HomeModule" ng-controller="HomeController" ng-cloak',
          layout: 'layout'
        });
    }

    // Otherwise, look up the logged in user and show the dashboard view
    User.findOne(req.session.passport.user, function (err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.error('Session refers to a non existing user id:['+ req.session.passport.user +']');
        return res.view('home',
          {
            title: 'My App',
            bodyAttr: 'ng-app="HomeModule" ng-controller="HomeController" ng-cloak',
            layout: 'layout'
          });
      }

      return res.view('dashboard', {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        isSiteAdmin: req.session.role === Roles.siteAdmin,
        isAdmin: req.session.role === Roles.admin,
        title: 'Dashboard  | Welcome, '+ user.username +'!',
        bodyAttr: 'ng-app="DashboardModule" ng-controller="DashboardController" ng-cloak',
        layout: 'layout'
      });
    });
  }

};
