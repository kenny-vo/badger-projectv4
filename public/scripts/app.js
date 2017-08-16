angular
  .module('identifly', [
    'ui.router',
    'satellizer',
    'ngMessages'
  ])
  .controller('MainController', MainController)
  .controller('HomeController', HomeController)
  .controller('LoginController', LoginController)
  .controller('SignupController', SignupController)
  .controller('LogoutController', LogoutController)
  .controller('ProfileController', ProfileController)
  .controller('ListingsIndexController', ListingsIndexController)
  .controller('ListingShowController', ListingShowController)

  .service('Account', Account)
  .config(configRoutes)
  ;


////////////
// ROUTES //
////////////

configRoutes.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"]; // minification protection
function configRoutes($stateProvider, $urlRouterProvider, $locationProvider) {

  //this allows us to use routes without hash params!
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  // for any unmatched URL redirect to /
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeController',
      controllerAs: 'home'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'SignupController',
      controllerAs: 'sc',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController',
      controllerAs: 'lc',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })
    .state('logout', {
      url: '/logout',
      template: null,
      controller: 'LogoutController',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileController',
      controllerAs: 'profile',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('create-listing', {
      url: '/create-listing',
      templateUrl: 'templates/create-listing.html',
      controller: 'ListingsIndexController',
      controllerAs: 'listingsIndexCtrl'
    })
    .state('listing-detail', {
      url: '/listing/:listingId',
      templateUrl: 'templates/listing-show.html',
      controller: 'ListingShowController',
      controllerAs: 'listingShowCtrl'
    });

    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }

}

/////////////////
// CONTROLLERS //
/////////////////

MainController.$inject = ["Account"]; // minification protection
function MainController (Account) {
  var vm = this;

  vm.currentUser = function() {
   return Account.currentUser();
  }

}

HomeController.$inject = ["$http", '$location']; // minification protection
function HomeController ($http, $location) {
  var vm = this;
  vm.newListing = {};

  $http({
    method: 'GET',
    url: '/api/listings'
  }).then(function successCallback(response) {
    vm.listings = response.data;
  }, function errorCallback(response) {
    console.log('Error getting data', response);
  });

  vm.createListing = function (){
    $http({
      method: 'POST',
      url: '/api/listings',
      data: vm.newListing,
    }).then(function successCallback(response) {
      vm.listings.push(response.data);
      $location.path('/');
    }, function errorCallback(response) {
      console.log('Error posting data', response);
    });
  };
}

LoginController.$inject = ["$location", "Account"]; // minification protection
function LoginController ($location, Account) {
  var vm = this;
  vm.new_user = {}; // form data

  vm.login = function() {
    Account
      .login(vm.new_user)
      .then(function(){
        vm.new_user = {}; // clear sign up form
        $location.path('/profile'); // redirect to '/profile'
      })
  };
}

SignupController.$inject = ["$location", "Account"]; // minification protection
function SignupController ($location, Account) {
  var vm = this;
  vm.new_user = {}; // form data

  vm.signup = function() {
    Account
      .signup(vm.new_user)
      .then(
        function (response) {
          vm.new_user = {}; // clear sign up form
          $location.path('/profile'); // redirect to '/profile'
        }
      );
  };
}

LogoutController.$inject = ["$location", "Account"]; // minification protection
function LogoutController ($location, Account) {
  Account
    .logout()
    .then(function () {
        $location.path('/login');
    });
}


ProfileController.$inject = ["$location", "Account"]; // minification protection
function ProfileController ($location, Account) {
  var vm = this;
  vm.new_profile = {}; // form data

  vm.updateProfile = function() {
    Account
      .updateProfile(vm.new_profile)
      .then(function () {
        vm.showEditForm = false;
      });
  };
}

ListingsIndexController.$inject = ['$http', '$location'];
function ListingsIndexController ($http, $location) {
  var vm = this;
  vm.newListing = {};

  $http({
    method: 'GET',
    url: '/api/listings'
  }).then(function successCallback(response) {
    vm.listings = response.data;
  }, function errorCallback(response) {
    console.log('Error getting data', response);
  });

  vm.createListing = function (){
    $http({
      method: 'POST',
      url: '/api/listings',
      data: vm.newListing,
    }).then(function successCallback(response) {
      vm.listings.push(response.data);
      $location.path('/');
    }, function errorCallback(response) {
      console.log('Error posting data', response);
    });
  };

};

ListingShowController.$inject = ['$http', '$stateParams', '$location'];
function ListingShowController ($http, $stateParams, $location) {
  var vm = this;

  $http({
    method: 'GET',
    url: '/api/listings/'+$stateParams.listingId
  }).then(function successCallback(json) {
    vm.listing = json.data;
  }, function errorCallback(response) {
    console.log('There was an error getting the data', response);
  });

  vm.editListing = function (listing) {
    $http({
      method: 'PUT',
      url: '/api/listings/'+$stateParams.listingId,
      data: listing
    }).then(function successCallback(json) {
    }, function errorCallback(response) {
      console.log('There was an error editing the data', response);
    });
  }

  vm.deleteListing = function (listing) {
    $http({
      method: 'DELETE',
      url: '/api/listings/'+ $stateParams.listingId
    }).then(function successCallback(json) {
      $location.path('/');
      // var index = vm.listings.indexOf(listing);
      // vm.listings.splice(index,1);
    }, function errorCallback(response) {
      console.log('There was an error deleting the data', response);
    });
  }

};


//////////////
// Services //
//////////////

Account.$inject = ["$http", "$q", "$auth"]; // minification protection
function Account($http, $q, $auth) {
  var self = this;
  self.user = null;

  self.signup = signup;
  self.login = login;
  self.logout = logout;
  self.currentUser = currentUser;
  self.getProfile = getProfile;
  self.updateProfile = updateProfile;

  function signup(userData) {
    return (
      $auth
        .signup(userData) // signup (https://github.com/sahat/satellizer#authsignupuser-options)
        .then(
          function onSuccess(response) {
            $auth.setToken(response.data.token); // set token (https://github.com/sahat/satellizer#authsettokentoken)
          },

          function onError(error) {
            console.error(error);
          }
        )
    );
  }

  function login(userData) {
    return (
      $auth
        .login(userData) // login (https://github.com/sahat/satellizer#authloginuser-options)
        .then(
          function onSuccess(response) {
            $auth.setToken(response.data.token); // set token (https://github.com/sahat/satellizer#authsettokentoken)
          },

          function onError(error) {
            console.error(error);
          }
        )
    );
  }

  function logout() {
    return (
      $auth
        .logout() // delete token (https://github.com/sahat/satellizer#authlogout)
        .then(function() {
          self.user = null;
        })
    );
  }

  function currentUser() {
    if ( self.user ) { return self.user; }
    if ( !$auth.isAuthenticated() ) { return null; }

    var deferred = $q.defer();
    getProfile().then(
      function onSuccess(response) {
        self.user = response.data;
        deferred.resolve(self.user);
      },

      function onError() {
        $auth.logout();
        self.user = null;
        deferred.reject();
      }
    )
    self.user = promise = deferred.promise;
    return promise;

  }

  function getProfile() {
    return $http.get('/api/me');
  }

  function updateProfile(profileData) {
    return (
      $http
        .put('/api/me', profileData)
        .then(
          function (response) {
            self.user = response.data;
          }
        )
    );
  }


}
