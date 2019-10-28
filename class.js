function requestList(callback) {
  // эмуляция запроса на сервер
  setTimeout(() => {
    callback.apply(null, [null, [1, 3, 83, 2, 1]]);
  }, 500);
}
function get(ix) {
  return function innerGet(list, callback) {
    // эмуляция запроса на сервер
    setTimeout(() => {
      callback.apply(null, [null, list[ix]]);
    }, 500);
  };
}
function multiply(n) {
  return function innerMultiply(value, callback) {
    // эмуляция запроса на сервер
    setTimeout(() => {
      callback.apply(null, [null, value * n]);
    });
  };
}
function toString(value, callback) {
  // эмуляция запроса на сервер
  setTimeout(() => {
    callback.apply(null, [null, String(value)]);
  });
}
function repeat(n) {
  return function innerRepeat(string, callback) {
    // эмуляция запроса на сервер
    setTimeout(() => {
      callback.apply(null, [null, string.repeat(n)]);
    }, 1000);
  };
}
function onError(error) {
  // eslint-disable-next-line no-console
  console.error(error);
}

function promisify(func) {
  return (arg) => new Promise((resolve, reject) => func(arg, (error, result) => {
    if (error) {
      reject(error);
    }

    resolve(result);
  }));
}

function callbackHell() {
  requestList((error, list) => {
    if (error) {
      onError(error);
    } else {
      // eslint-disable-next-line no-shadow
      get(2)(list, (error, value) => {
        if (error) {
          onError(error);
        } else {
          // eslint-disable-next-line no-shadow
          multiply(10)(value, (error, value) => {
            if (error) {
              onError(error);
            } else {
              // eslint-disable-next-line no-shadow
              toString(value, (error, string) => {
                if (error) {
                  onError(error);
                } else {
                  // eslint-disable-next-line no-shadow
                  repeat(3)(string, (error, string) => {
                    if (error) {
                      onError(error);
                    } else {
                      // eslint-disable-next-line no-console
                      console.log(`callbackHell(): ${string} (${typeof string})`);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}

function promise() {
  const [
    getPromisified,
    multiplyPromisified,
    toStringPromisified,
    repeatPromisified
  ] = [
    get(2),
    multiply(10),
    toString,
    repeat(3)
  ]
    .map(promisify);

  new Promise((resolve, reject) => {
    requestList((error, list) => {
      if (error) {
        reject(error);
      }

      resolve(list);
    });
  })
    .then(getPromisified)
    .then(multiplyPromisified)
    .then(toStringPromisified)
    .then(repeatPromisified)
    .then((value) => {
      // eslint-disable-next-line no-console
      console.log(`promise(): ${value} (${typeof value})`);
    })
    .catch(onError);
}

callbackHell();
promise();
