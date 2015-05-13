/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  '*': ['passport'],

  'EventController': {
    '*': ['passport', 'sessionAuth']
  },

  'ProfileController': {
    '*': ['passport', 'sessionAuth', 'isNotGuest']
  },

  // UserController - Everthing requires SiteAdmin privledges with the
  // three exceptions, list, update, password. Role security is checked
  // within these actions.
  'admin/UserController': {
    '*': ['passport', 'isSiteAdmin'],
    'list': ['passport', 'isAdmin'],

    // Role security is peformed in these actions. A user is allowed to
    // update themself and change thier own password
    'update': ['passport', 'sessionAuth', 'isNotGuest'],
    'password': ['passport', 'sessionAuth', 'isNotGuest'],

  },

  'admin/ScheduleInviteController': {
    '*': ['passport', 'isAdmin'],
    'list': ['passport', 'isSiteAdmin'],
    'authInvite': ['passport']
  },

  'admin/LogController': {
    '*': ['passport', 'isSiteAdmin'],
  }

};
