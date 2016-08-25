angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


.controller('TravelsCtrl', function($scope, $http) {
  /*$scope.travels = [
    { id: 1, title: 'Travel1', description: "description for travel 1", owner: "user1", icon: "car" },
    { id: 2, title: 'Travel2', description: "description for travel 2", owner: "user2", icon: "station-wagon" },
    { id: 3, title: 'Travel3', description: "description for travel 3", owner: "user3", icon: "van" },
    { id: 4, title: 'Travel4', description: "description for travel 4", owner: "user1", icon: "station-wagon" },
    { id: 5, title: 'Travel5', description: "description for travel 5", owner: "user2", icon: "minivan" },
    { id: 6, title: 'Travel6', description: "description for travel 6", owner: "user3", icon: "lorry" },
    { id: 7, title: 'Travel7', description: "description for travel 7", owner: "user1", icon: "sport-car" },
    { id: 8, title: 'Travel8', description: "description for travel 8", owner: "user2", icon: "jeep" }
];*/
    $scope.travels="";
    $http.get('http://localhost:3000/api/travels')
    .success(function(data, status, headers,config){
      console.log('data success');
      console.log(data); // for browser console
      $scope.travels = data; // for UI
    })
    .error(function(data, status, headers,config){
      console.log('data error');
    })
    .then(function(result){
      travels = result.data;
  });
})
.controller('TravelCtrl', function($scope, $stateParams) {
    //$scope.travel=travels.get($stateParams.travelId);
});
