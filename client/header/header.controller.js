angular.module('bitclip.headerController', [])

.controller('headerController', ['$rootScope', '$scope', '$state', 'Header', 'Utilities', function($rootScope, $scope, $state, Header, Utilities) {
  Utilities.initialize().then(function() {
    $scope.setBalance = function() {
      $scope.balanceMessage = 'Loading balance ...';
      return Header.getBalanceForCurrentAddress().then(function(balance) {
        // If fetching current balance generates an error, we render that as the balance message
        if (typeof balance === 'string') {
          $scope.balanceMessage = balance;
        } else {
          $scope.balanceMessage = 'Bal: ' + balance + ' BTC';
          // Create socket to fetch updated balance information
          // DISABLED WHILE I FIX IT
          Utilities.getLiveBalanceForCurrentAddress();
        }
      });
    };

    $scope.updateBalanceOnConfirmedTransaction = function() {
      Utilities.monitorForNewTransactions(function(data) {
        $scope.balanceMessage = 'Bal: ' + data.balance + ' BTC';
      });
    }
    $scope.updateBalanceOnConfirmedTransaction();


    // If current address is changed, we reset the balance message and generate a new socket
    $rootScope.$watch('currentAddress', $scope.setBalance);

    $scope.getNetworkStatus = function() {
      return Utilities.isMainNet().then(function(isMainNet) {
        $rootScope.isMainNet = isMainNet;
        $scope.setBalance();
      });
    };
    $scope.getNetworkStatus();

    $scope.menu = function() {
      // Closes settings menu when you click outside of the menu
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    
    $scope.toggleNetwork = function() {
      Header.setNetwork(!$rootScope.isMainNet, $scope.getNetworkStatus);
    };

  });
}]);
