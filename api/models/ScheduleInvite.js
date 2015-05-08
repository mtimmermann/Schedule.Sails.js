
var ScheduleInvite = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    user: { model: 'User', required: true, unique: true },
    email: { type: 'string', required: true },
  }
};

module.exports = ScheduleInvite;
