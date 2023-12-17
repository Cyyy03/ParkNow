

class EventBus {
  constructor() {
    this.events = this.events || new Object();
  }
}


EventBus.prototype.emit = function (type, ...args) {
  let e;
  e = this.events[type];
  if (Array.isArray(e)) {
    for (let i = 0; i < e.length; i++) {
      e[i].apply(this, args);
    }
  } else {
    e.apply(this, args);
  }
};

EventBus.prototype.addListener = function (type, fun) {
  const e = this.events[type];
  let currentIndex = -1
  if (!e) {
    this.events[type] = [fun];
    currentIndex = 0
  } else {
    e.push(fun);

    currentIndex = this.events[type].length - 1
  }
  return { type, index: currentIndex }
};


EventBus.prototype.remove = function (subscribe) {
  let { type, index } = subscribe
  let e;
  e = this.events[type];

  if (Array.isArray(e)) {

    if (e.length === 0) {
      return
    } else if (e.length === 1) {

      e.splice(0, 1)
    } else {

      for (let i = 0; i < e.length; i++) {
        if (index > 0 && i === index) {
          e.splice(index, 1)
        }
      }
    }
  } else {
    e = []
  }
};


EventBus.prototype.removeAll = function () {

  if (this.events.length > 0) {
    this.events.length = 0;
  }
};

const eventBus = new EventBus();
export default eventBus;