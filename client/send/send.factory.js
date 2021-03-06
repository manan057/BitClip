angular.module('bitclip.sendFactory', [])

.factory('TxBuilder', ['$q', '$rootScope', '$http', 'Utilities', function($q, $rootScope, $http, Utilities) {
  //Sends transaction data through helloblock
  // Values must be in satoshis.
  var sendTransaction = function(privateKeyWIF, transactionObj, isMainNet) {
    var deferred = $q.defer();
    var networkVar = {
      network: isMainNet ? 'mainnet' : 'testnet'
    };
    var ecKey = bitcoin.ECKey.fromWIF(privateKeyWIF);
    var network = isMainNet ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
    var ecKeyAddress = ecKey.pub.getAddress(network).toString();
    var toAddress = transactionObj.destination;
    var txFee = isMainNet ? 10000 : 10;
    var txTargetValue = parseInt(Math.round(transactionObj.amount * 100000000));

    //Sets transaction bitcoin value (send value + transaction fee)

    getUnspents(ecKeyAddress, isMainNet).then(function(unspents) {
      //sets change amount for transaction
      var tx = new bitcoin.TransactionBuilder();
      var totalUnspentsValue = 0;
      unspents.forEach(function(unspent) {
        tx.addInput(unspent.txid, unspent.vout);
        totalUnspentsValue += unspent.satoshis;
      });
      tx.addOutput(toAddress, txTargetValue);

      var txChangeValue = totalUnspentsValue - txTargetValue - txFee;

      if (txChangeValue < 0) {
        deferred.reject({message: "Wallet balance not high enough"});
      } else {
        if (txChangeValue > 546) {
          // Only add the change address if the changeValue is greater than the dust threshold,
          // otherwise the transaction will be rejected as dust. If the change is less than the 
          // change threshold, the change will just be added to the fee.
          tx.addOutput(ecKeyAddress, txChangeValue);
        }
        tx.tx.ins.forEach(function(input, index) {
          tx.sign(index, ecKey);
        });

        //Sends off transaction
        var rawTxHex = tx.build().toHex();

        propagateTx(rawTxHex, isMainNet).then(function(data) {
          if (data.txid) {
            deferred.resolve('Transaction successfully propagated.');
          } else {
            console.log('Transaction propagation failed, txid in return: %s', data);
            deferred.reject({message: data})
          }
        }, function(error) {
            console.log('Propagration failed: ', error)
            deferred.reject({message: error});
        });
        
      }

    }, function(error) {
      deferred.reject(error)
      $rootScope.$apply();
      return deferred.promise;
    });


    return deferred.promise;
  };

  var propagateTx = function(rawTxHex, isMainNet) {
    var deferred = $q.defer();

    var url = 'https://' + (isMainNet ? 'insight' : 'test-insight') + '.bitpay.com/api/tx/send';
    $http.post(url, {rawtx: rawTxHex})
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function(err) {
        deferred.reject(err);
      })

    return deferred.promise;
  }

  var getUnspents = function(address, isMainNet) {
    var deferred = $q.defer();

    var url = 'https://' + (isMainNet ? 'insight' : 'test-insight') + '.bitpay.com/api/addr/' + address + '/utxo';
    $http.get(url)
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function(data, status, headers, config) {
        deferred.reject('Couldn\'t get unspents: ', data, status, headers, config);
      });

    return deferred.promise;
  }

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

  //Varifies if address is valid
  var isValidAddress = function(address) {
    function check(address) {
      var decoded = base58_decode(address);     
      if (decoded.length !== 25) return false;

      var cksum = decoded.substr(decoded.length - 4); 
      var rest = decoded.substr(0, decoded.length - 4);  
      var good_cksum = hex2a(sha256_digest(hex2a(sha256_digest(rest)))).substr(0, 4);
      if (cksum !== good_cksum) return false;
      return true;
    };

    //Transaction data encryption
    function base58_decode(string) {
      var table = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      var table_rev = new Array();

      for (var i = 0; i < 58; i++) {
        table_rev[table[i]] = int2bigInt(i, 8, 0);
      }

      var l = string.length;
      var long_value = int2bigInt(0, 1, 0);  
      var num_58 = int2bigInt(58, 8, 0);
      var c;

      for (var i = 0; i < l; i++) {
        c = string[l - i - 1];
        long_value = add(long_value, mult(table_rev[c], pow(num_58, i)));
      }

      var hex = bigInt2str(long_value, 16);  
      var str = hex2a(hex);  
      var nPad;

      for (nPad = 0; string[nPad] === table[0]; nPad++);  
      var output = str;
      if (nPad > 0) output = repeat('\0', nPad) + str;
      return output;
    };

    function hex2a(hex) {
      var str = '';
      for (var i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return str;
    };

    function a2hex(str) {
      var aHex = '0123456789abcdef';
      var l = str.length;
      var nBuf;
      var strBuf;
      var strOut = '';
      for (var i = 0; i < l; i++) {
        nBuf = str.charCodeAt(i);
        strBuf = aHex[Math.floor(nBuf / 16)];
        strBuf += aHex[nBuf % 16];
        strOut += strBuf;
      }
      return strOut;
    };

    function pow(big, exp) {
      if (exp === 0) return int2bigInt(1, 1, 0);
      var newbig = big;
      for (var i = 1; i < exp; i++) {
        newbig = mult(newbig, big);
      }
      return newbig;
    };

    function repeat(s, n) {
      var a = [];
      while (a.length < n) {
        a.push(s);
      }
      return a.join('');
    };
    
    var regex = /[^a-zA-Z0-9]/;
    if (regex.test(address) || address === undefined) {
      return false;
    }
    return check(address);
  };

  return {
    sendTransaction: sendTransaction,
    isValidAddress: isValidAddress
  };
}]);
