var Roles = {
  siteAdmin: 'SiteAdmin',
  admin:     'Admin',
  user:      'User',

  map: function() {
    return [
      { value: this.siteAdmin },
      { value: this.admin },
      { value: this.user }
    ];
  }
};

module.exports = Roles;
