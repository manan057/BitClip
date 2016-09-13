angular.module('bitclip.utilitiesFactory', [])

.factory('Utilities', ['$http', '$q', function($http, $q) {
  var InitObj = function() {
    this.currentAddress = '';
    this.currentPrivateKey = '';
    this.allAddressesAndKeys = [];
  };

  // If local storage structure has not been created (when first running app)
  // then create shell used to store addresses, keys, etc.
  var initialize = function() {
    var deferred = $q.defer();
    chrome.storage.local.get(['isMainNet', 'mainNet', 'testNet'], function(obj) {
      if (obj.isMainNet === undefined) {
        obj.isMainNet = true;
      }
      if (obj.mainNet === undefined) {
        obj.mainNet = new InitObj();
      }
      if (obj.testNet === undefined) {
        obj.testNet = new InitObj();
      }
      chrome.storage.local.set(obj, function() {
        deferred.resolve('Initialization complete.');
      });
    });
    return deferred.promise;
  };

  var httpGet = function(url, callback, options) {
    $http.get(url, options)
      .success(function(data) {
        callback(data);
      })
      .error(function(data, status, headers, config) {
        callback('HTTP GET request failed: ', data, status, headers, config);
      });
  };

  var isMainNet = function() {
    var deferred = $q.defer();
    chrome.storage.local.get('isMainNet', function(obj) {
      deferred.resolve(obj.isMainNet);
    });
    return deferred.promise;
  };

  // Abstracted function used to fetch data from local storage
  var getNetworkData = function(request) {
    var deferred = $q.defer();
    chrome.storage.local.get(['isMainNet', 'mainNet', 'testNet'], function(obj) {
      if (obj.isMainNet === true) {
        deferred.resolve(obj.mainNet[request]);
      } else if (obj.isMainNet === false) {
        deferred.resolve(obj.testNet[request]);
      } else {
        deferred.reject('Network type not defined.');
      }
    });
    return deferred.promise;
  };

  var getCurrentAddress = function() {
    return getNetworkData('currentAddress');
  };

  var getCurrentPrivateKey = function() {
    return getNetworkData('currentPrivateKey');
  };

  var getAllAddresses = function() {
    var deferred = $q.defer();
    getNetworkData('allAddressesAndKeys').then(function(arr) {
      var result = [];
      for (var i = 0, l = arr.length; i < l; i++) {
        result.push(arr[i][0]);
      }
      deferred.resolve(result);
    });
    return deferred.promise;
  };

  // Query Helloblock for balance information
  // Accepts array of addresses
  var getBalances = function(addresses) {
    var deferred = $q.defer();

    // return promise if there's no addresses
    if (addresses.length === 1) {
      if (!addresses[0]) {
        deferred.resolve([]);
        return deferred.promise;
      }
    } else if (addresses.length === 0) {
      deferred.resolve([]);
      return deferred.promise;
    }

    var balances = [];
    for (var i = 0; i < addresses.length; i++) {
      balances[i] = getBalance(addresses[i]);
    }

    $q.all(balances).then(function(result) {
      deferred.resolve(result);
    })

    return deferred.promise;
  };

  // Query Insight API for balance for a single address
  var getBalance = function(address) {
    var deferred = $q.defer();
    isMainNet().then(function(bool) {
      var baseUrl = 'https://' + (bool ? 'insight' : 'test-insight') + '.bitpay.com/api/addr/' + address;
      httpGet(baseUrl, function(obj) {
        deferred.resolve(obj);
      });
    });
    return deferred.promise;
  }

  // Tracks sockets used to fetch balance information for current address
  var openSocketsList = [];

  // Tracks incoming unconfirmed transactions for current address
  var unconfirmedTransactions = [];

  var openSocketToGetLiveBalance = function(url, currentAddress) {
    room = 'bitcoind/addresstxid';

    var socket = io(url);
    socket.on('connect', function() {
      socket.emit('subscribe', room, [currentAddress]);
    });
    socket.on(room, function(data) {
      console.log('Transaction detected, txid: %s', data.txid)
      unconfirmedTransactions.push(data);
      // data looks like { address: , txid: }
    })

    openSocketsList.push(socket)
  };


  var closeExistingSocketsPermanently = function() {
    openSocketsList.forEach(function(socket) {
      socket.disconnect();
    });
    openSocketsList.splice(0, openSocketsList.length);
  };

  var getLiveBalanceForCurrentAddress = function() {
    isMainNet().then(function(bool) {
      getCurrentAddress().then(function(currentAddress) {
        var url = 'wss://' + (bool ? 'insight' : 'test-insight') + '.bitpay.com';
        closeExistingSocketsPermanently();
        openSocketToGetLiveBalance(url, currentAddress);
      });
    });
  };

  // Add TestNet Bitcoins for given address

  var getTestNetCoins = function(address, callback) {
    $http({
      method: 'POST',
      url: 'http://api.bitclip.me/api/getcoins',
      data: {
        address: address
      }
    })
      .success(function(data, status, headers, config) {
        callback(data, status, headers, config);
      })
      .error(function(data, status, headers, config) {
        callback(data, status, headers, config);
      });
  };

  var monitorForNewTransactions = function(callback) {
    isMainNet().then(function(bool) {
      var socket = io('wss://' + (bool ? 'insight' : 'test-insight') + '.bitpay.com');
      var room = 'inv';

      socket.on('connect', function() {
        socket.emit('subscribe', room);
      });
      socket.on('block', function(data) {
        if (unconfirmedTransactions.length) {
          getBlockAndCheckForTx(data, bool).then(function(obj) {
            if (obj) {
              getCurrentAddress().then(function(currentAddress) {
                getBalance(currentAddress).then(function(obj) {
                  callback(obj);
                })
              })
            }
          })
        }
      })
    })
  }

  var getBlockAndCheckForTx = function(blockHash, isMainNet) {
    var deferred = $q.defer();
    var txInBlock;

    httpGet('https://' + (isMainNet ? 'insight' : 'test-insight') + '.bitpay.com/api/block/' + blockHash, function(obj) {
      if (obj.tx) {
        obj.tx.forEach(function(transaction) {
          for (var i = 0; i < unconfirmedTransactions.length; i++) {
            if (transaction = unconfirmedTransactions[i].txid) {
              txInBlock = true;
              unconfirmedTransactions.splice(i,1);
              break;
            }
          }
        });

        if (txInBlock) {
          deferred.resolve(true);
        } else {
          deferred.resolve(false);
        }
      }
    });

    return deferred.promise
  }

  return {
    initialize: initialize,
    isMainNet: isMainNet,
    httpGet: httpGet,
    getCurrentAddress: getCurrentAddress,
    getCurrentPrivateKey: getCurrentPrivateKey,
    getAllAddresses: getAllAddresses,
    getBalances: getBalances,
    openSocketsList: openSocketsList,
    getLiveBalanceForCurrentAddress: getLiveBalanceForCurrentAddress,
    getTestNetCoins: getTestNetCoins,
    monitorForNewTransactions: monitorForNewTransactions
  };
}]);
