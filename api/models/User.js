var Roles = require('../enums/Roles');

var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    username  : { type: 'string', unique: true },
    email     : { type: 'email',  unique: true },
    passports : { collection: 'Passport', via: 'user' },

    // enum -> only accept these values for roles
    role      : { type: 'string', enum: [Roles.siteAdmin, Roles.admin, Roles.user] }
  },

  toJSON: function() {
    var obj = this.toObject();
    delete obj._csrf;
    return obj;
  }
};

module.exports = User;
