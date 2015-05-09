/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /': 'PageController.home',

  /**
   * Auth Controller
   */
  'GET  /signup':              'AuthController.signup',
  'GET  /logout':              'AuthController.logout',
  'GET  /forgotpassword':      'AuthController.forgotpassword',
  'POST /auth/forgotpassword': 'AuthController.postForgotPassword',
  'GET  /resetpassword':       'AuthController.resetPassword',
  'POST /auth/resetpassword':  'AuthController.postResetPassword',

  'POST /auth/local':         'AuthController.callback',
  'POST /auth/local/:action': 'AuthController.callback',

  'GET /auth/:provider':          'AuthController.provider',
  'GET /auth/:provider/callback': 'AuthController.callback',


  /**
   * User Controller - Admin
   */
  'GET    /adminpanel/users':          'admin/UserController.list',
  'GET    /adminpanel/users/:id':      'admin/UserController.find',
  'PUT    /adminpanel/users':          'admin/UserController.update',
  'DELETE /adminpanel/users/:id':      'admin/UserController.destroy',
  'PUT    /adminpanel/users/password': 'admin/UserController.password',
  'GET    /adminpanel/roles':          'admin/UserController.roles',

  /**
   * Event Controller
   */
  'GET    /api/events':     'EventController.list',
  'POST   /api/events':     'EventController.create',
  'PUT    /api/events':     'EventController.update',
  'DELETE /api/events/:id': 'EventController.destroy',
  'GET    /schedule':       'EventController.list',

  /**
   * ScheduleInvite Controller
   */
  'GET /schedule/invite/find': 'admin/ScheduleInviteController.find',
  'GET /schedule/invite':      'admin/ScheduleInviteController.invite',
  'GET /schedule/show':        'admin/ScheduleInviteController.authInvite'

};
