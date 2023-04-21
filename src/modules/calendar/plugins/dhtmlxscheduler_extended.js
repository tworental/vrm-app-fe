(() => {
  let listeners = [];

  window.scheduler.addEventListener = function attachSchedulerEvent(eventName, handler) {
    listeners.push(window.scheduler.attachEvent(eventName, handler));
  };

  window.scheduler.removeEventListeners = function clearSchedulerEvents() {
    listeners.forEach((eventId) => {
      window.scheduler.detachEvent(eventId);
    });

    listeners = [];
  };
})();
