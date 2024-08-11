function listenEvents(events) {
  events.map((event, eventName) => client.on(eventName, event));
}

module.exports = listenEvents;