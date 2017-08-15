angular
  .module('identifly', [
    'ui.router',
    'satellizer'
  ])
  .controller('ListingShowController', ListingShowController);

ListingShowController.$inject = ['$http', '$stateProvider'];
function ListingShowController ($http, $stateProvider) {
  var vm = this;

  $http({
    method: 'GET',
    url: '/api/listings/'+$stateProvider.listingId
  }).then(function successCallback(json) {
    vm.listing = json.data;
  }, function errorCallback(response) {
    console.log('There was an error getting the data', response);
  });

};
