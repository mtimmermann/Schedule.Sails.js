/**
 * Profile Controller
 */
var ProfileController = {

  /**
   * Return a rendered profile view, or a json object
   * of the authorized requesting user
   *
   * GET /profile
   *
   * @param {Object} req
   * @param {Object} res
   */
  profile: function(req, res) {
    if (!req.wantsJSON) {
      return res.view('profile/index', {
            title: 'Edit Profile',
            bodyAttr: 'ng-app="ProfileModule" ng-cloak',
            layout: 'layout'
      });
    }

    User.findOne({ id: req.user.id }, function (err, user) {
      if (err) {
        sails.log.error('ProfileController.profile User.findOne failed. user['+ req.user.id +']', err);
        return res.negotiate(err);
      }
            
      if (!user) {
        return res.send(404, 'User not found.');
      }
      return res.json(user);
    });
  }

};

module.exports = ProfileController;