// Singleton in JS
var TaskScheduler = {
  taskIndex: -1,
  tasks: [],

  add: function (task) {
    if ($.isFunction(task)) {
      this.tasks.push({
        dueDate: Date(), // run asap
        isDone: false, // mark to delete
        isRunning: false, // avoid it is called many time when it is not done yet

        run: task
      });
    } else {
      throw 'Invalid parameter, the task param must be a function pointer';
    }
  },

  run: function () {
    // remark, we need to clone tasks array to avoid concurrency access (add a new task) during loop
    var tasks = this.tasks.slice(0), now = Date();
    for (var taskIndex = tasks.length - 1; taskIndex >= 0; taskIndex--) {
      var task = tasks[taskIndex];
      if (task.dueDate < now && !task.isRunning) {
        task.isRunning = true; // mark it running
        try {
          if (!task.run(this)) {
            // remove non-recurring task from queue
            task.isDone = true;
          }
        } catch (e) {
          task.isRunning = false;
          console.log(Date(), 'Cannot perform task #' + taskIndex, e);
        }
      }
    }

    // remove done tasks from queue, here we don't need to lock the array because JS engine is a STA
    tasks = this.tasks;
    for (var taskIndex = tasks.length - 1; taskIndex >= 0; taskIndex--) {
      var task = tasks[taskIndex];
      if (task.isDone) {
        tasks.splice(taskIndex, 1);
      }
    }

    // relax to retain CPU time for UI tasks
    setTimeout($.proxy(this.run, this), 30000); // every 30s
  }
};


// Schedule background tasks
TaskScheduler.add(function () {
  var task = this;
  task.dueDate = new Date().addMinutes(30); // assume that server is unavailable for 30 minutes

  requestManager.doAjaxRequest({
    url: '',
    data: '',
    callback: function (data) {

    },
    alwaysCallback: function () {
      task.dueDate = new Date().addMilliseconds(AppSettings.Process.Interval);
      task.isRunning = false;
    }
  });
  return true; // true: recurring task, false: non-recurring task
});

TaskScheduler.run();
