var Roles = {
  siteAdmin: 'SiteAdmin',
  admin:     'Admin',
  user:      'User',
  guest:     'Guest', // Do not map this role, used only for emailed url calendar invites

  map: function() {
    return [
      { value: this.siteAdmin },
      { value: this.admin },
      { value: this.user }
    ];
  }
};

module.exports = Roles;
