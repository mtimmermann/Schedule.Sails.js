﻿var Event = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    user: { model: 'User', required: true },
    title: { type: 'string', required: true },
    start: { type: 'string', required: true },
    end: { type: 'string' },
    color: { type: 'string' },
    textColor: { type: 'string' },
    allDay: { type: 'boolean'}
  }
};

module.exports = Event;