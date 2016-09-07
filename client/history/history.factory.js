angular.module('bitclip.historyFactory', [])

.factory('History', ['$http', 'Utilities', '$q', function($http, Utilities, $q) {
  //Retrieves the transaction history from helloblock given current address
  var getTransactionHist = function(currentAddress) {
    var deferred = $q.defer();

    //determine what network is running (test or main)
    //then retrieve transaction data
    Utilities.isMainNet().then(function(bool) {
      var baseUrl = 'https://' + (bool ? 'insight' : 'test-insight') + '.bitpay.com/api/txs/?address=';
      var requestString = currentAddress;
      baseUrl += requestString;
      Utilities.httpGet(baseUrl, function(obj) {
        deferred.resolve(obj.txs);
      });
    });
    return deferred.promise;
  };

  //determines if the current address is in an array and returns its values if true
  var isContainedInArrayMatrix = function(inputOrOutputMatrix, current) {
    var returnedTx = [];
    for (var i = 0, l = inputOrOutputMatrix.length; i < l; i++) {
      var returnedAddress = inputOrOutputMatrix[i][0];
      var returnedValue = inputOrOutputMatrix[i][1];
      var txTime = inputOrOutputMatrix[i][2];
      if (current === returnedAddress) {
        if (!returnedTx[0]) {
          returnedTx = [returnedAddress, returnedValue, txTime];
        } else {
          returnedTx[1] += returnedValue;
        }
      }
    }

    if (returnedTx[0]) {
      return returnedTx
    } else {
      return false;
    }
  };  

  //determines if transaction was inbound or outbound
  var getUsableTransData = function(transObj, current) {
    var direction, amount, time, address;
    var addressObj = {
      inputs: [],
      outputs: []
    };

    transObj.vin.forEach(function(tx) {
      addressObj.inputs.push([tx.addr, tx.valueSat, transObj.time]);
    });

    transObj.vout.forEach(function(tx) {
      addressObj.outputs.push([tx.scriptPubKey.addresses[0], tx.value*100000000, transObj.time]);
    });
    
    //sets values of transaction relative to user.
    if (isContainedInArrayMatrix(addressObj.inputs, current) && isContainedInArrayMatrix(addressObj.outputs, current)) {
      var matchedInputs = isContainedInArrayMatrix(addressObj.inputs, current);
      var matchedOutputs = isContainedInArrayMatrix(addressObj.outputs, current);
      var inputAmount = matchedInputs[1];
      var outputAmount = matchedOutputs[1];

      if (outputAmount < inputAmount) {
        if (addressObj.outputs[0][0] === current) {
          address = addressObj.outputs[1][0];
        } else {
          address = addressObj.outputs[0][0];
        }
        direction = 'outbound';
        amount = addressObj.outputs[0][1];
        time = matchedInputs[2];
      }
    } else if (isContainedInArrayMatrix(addressObj.inputs, current) && !isContainedInArrayMatrix(addressObj.outputs, current)) {
      var matchedInputs = isContainedInArrayMatrix(addressObj.inputs, current);
      if (addressObj.outputs[0][0] === current) {
        address = addressObj.outputs[1].address;
      } else {
        address = addressObj.outputs[0][0];
      }
      direction = 'outbound';
      amount = matchedInputs[1];
      time = matchedInputs[2];
    } else if (!isContainedInArrayMatrix(addressObj.inputs, current) && isContainedInArrayMatrix(addressObj.outputs, current)) {
      var matchedOutputs = isContainedInArrayMatrix(addressObj.outputs, current);
      address = addressObj.inputs[0][0];
      direction = 'inbound';
      amount = matchedOutputs[1];
      time = matchedOutputs[2];
    }
    return [direction, amount / 100000000, time * 1000, address];
  };

  return {
    getTransactionHist: getTransactionHist,
    getUsableTransData: getUsableTransData
  };
}]);
