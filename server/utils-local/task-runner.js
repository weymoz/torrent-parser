const util = require('util');

function taskRunner(task, args, threadsLimit) {

  return new Promise(resolve => {

    const total = args.length;
    let progress = 0;

    const promises = new Array(threadsLimit).fill(Promise.resolve());
    const results = [];
    let c = 0;
    let callCount = 1;

    function scheduleNextTask(p) {

      p.then(result => {

        if (result !== undefined) {
          results.push(result);
        }

        if (args.length) {

          let arg = args.shift();
          callCount++;

          let np = task(arg);
          scheduleNextTask(np);
        } else {
          if (++c === threadsLimit) {
            resolve(results);
          }
        }
      });
    }
    promises.map(scheduleNextTask);
  });
}

module.exports = taskRunner;
