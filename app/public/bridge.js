// Generated by CoffeeScript 1.6.3
var Queue, Tasks, client;

client = new Dropbox.Client({
  key: '1n83me2ms50l6az'
});

client.authenticate(function(error, client) {
  if (error) {
    return console.log(error);
  }
});

Queue = {
  _: [],
  skip: false,
  add: function(fn) {
    if (Queue.skip) {
      return Queue._.push(fn);
    } else {
      return fn();
    }
  },
  execute: function() {
    var action, _i, _len, _ref, _results;
    _ref = Queue._;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      action = _ref[_i];
      _results.push(action());
    }
    return _results;
  },
  disable: function() {
    return Queue.skip = true;
  }
};

Tasks = {
  _: [],
  file: 'tasks.json',
  set: function(tasks) {
    return Tasks._ = tasks;
  },
  get: function() {
    return Tasks._;
  },
  save: function() {
    return client.writeFile(Tasks.file, JSON.stringify(Tasks._));
  },
  add: function(id, value) {
    Tasks._.push({
      id: id,
      value: value
    });
    return Tasks.save();
  },
  edit: function(id, value) {
    var task, _i, _len, _ref;
    _ref = Tasks._;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      task = _ref[_i];
      if (task.id === id) {
        task.value = value;
      }
    }
    return Tasks.save();
  },
  "delete": function(id) {
    var i, task, _i, _len, _ref;
    _ref = Tasks._;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      task = _ref[i];
      if (task.id === id) {
        Tasks._.splice(i, 1);
      }
    }
    return Tasks.save();
  }
};

client.readFile(Tasks.file, function(error, data) {
  if (error && error.status === Dropbox.ApiError.NOT_FOUND) {
    Tasks.save();
  } else {
    Tasks.set(JSON.parse(data));
  }
  Queue.execute();
  return Queue.disable();
});

Queue.add(function() {
  return Tasks.add('I0E3', 'This is a test');
});

Queue.add(function() {
  return Tasks.add('A3C6', 'This is a test 2');
});

Queue.add(function() {
  return Tasks.add('NC94', 'This is a test 3');
});

Queue.add(function() {
  return Tasks["delete"]('NC94');
});

Queue.add(function() {
  return console.log(Tasks.get());
});
