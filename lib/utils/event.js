let events = {};

const Event = {
  on: (eventName, handler) => {
    if (!events[eventName]) {
      events[eventName] = [];
    }
    events[eventName].push(handler);
  },

  emit: (eventName, args) => {
    if (!events[eventName]) return;
    events[eventName].forEach((e) => {
      e(args);
    });
  },

  off: (eventName, handler) => {
    if (!events[eventName]) return;

    events[eventName] = events[eventName].filter((e) => {
      return e !== handler;
    });
  },

  offAll: (eventName) => {
    delete events[eventName];
  },
};

export default Event;
