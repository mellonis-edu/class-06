function requestList(callback) {
  // эмуляция запроса на сервер
  setTimeout(() => {
    callback.apply(null, [null, [1, 3, 83, 2, 1]]);
  }, 500);
}
function get(list, n, callback) {
  // эмуляция запроса на сервер
  setTimeout(() => {
    callback.apply(null, [null, list[n]]);
  }, 500);
}
function multiply(value, n, callback) {
  // эмуляция запроса на сервер
  setTimeout(() => {
    callback.apply(null, [null, value * n]);
  });
}
function toString(value, callback) {
  // эмуляция запроса на сервер
  setTimeout(() => {
    callback.apply(null, [null, String(value)]);
  });
}
function repeat(string, n, callback) {
  // эмуляция запроса на сервер
  setTimeout(() => {
    callback.apply(null, [null, string.repeat(n)]);
  }, 1000);
}
function onError(error) {
  // eslint-disable-next-line no-console
  console.error(error);
}

function callbackHell() {
  requestList((error, list) => {
    if (error) {
      onError(error);
    } else {
      // eslint-disable-next-line no-shadow
      get(list, 2, (error, value) => {
        if (error) {
          onError(error);
        } else {
          // eslint-disable-next-line no-shadow
          multiply(value, 10, (error, value) => {
            if (error) {
              onError(error);
            } else {
              // eslint-disable-next-line no-shadow
              toString(value, (error, string) => {
                if (error) {
                  onError(error);
                } else {
                  // eslint-disable-next-line no-shadow
                  repeat(string, 3, (error, string) => {
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
  const requestListPromise = new Promise((resolve, reject) => {
    requestList((error, list) => {
      if (error) {
        reject(error);
      }

      resolve(list);
    });
  });

  requestListPromise
    .then((list) => {
      const getPromise = new Promise((resolve, reject) => {
        get(list, 2, (error, value) => {
          if (error) {
            reject(error);
          }

          resolve(value);
        });
      });

      return getPromise;
    })
    .then((value) => {
      const multiplyPromise = new Promise((resolve, reject) => {
        // eslint-disable-next-line no-shadow
        multiply(value, 10, (error, value) => {
          if (error) {
            reject(error);
          }

          resolve(value);
        });
      });

      return multiplyPromise;
    })
    .then((value) => {
      // eslint-disable-next-line no-console
      console.log(`promise(): ${value} (${typeof value})`);
    })
    .catch(onError);
}

callbackHell();
promise();
