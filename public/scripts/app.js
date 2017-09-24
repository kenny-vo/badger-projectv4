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
  .directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });

            elem.bind('blur', function(event) {
                var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber));
            });
          }
          };
        }]);
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
    .state('profile-listings', {
      url: '/your-listings',
      templateUrl: 'templates/profile-listings.html',
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
    })
    .state('listings-response', {
      url: '/responses/:listingId',
      templateUrl: 'templates/listings-response.html',
      controller: 'ListingShowController',
      controllerAs: 'listingShowCtrl'
    })
    .state('bid-responses', {
      url: '/bid-responses/',
      templateUrl: 'templates/bid-responses.html',
      controller: 'ProfileController',
      controllerAs: 'profile'
    })

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

MainController.$inject = ["Account"];
function MainController (Account) {
  var vm = this;

  vm.currentUser = function() {
   return Account.currentUser();
  }

  vm.test = function test() {
    Account.test();
  }

}

HomeController.$inject = ["$http", '$location'];
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

LoginController.$inject = ["$location", "Account"];
function LoginController ($location, Account) {
  var vm = this;

  vm.login = function() {
    Account
      .login(vm.new_user)
      .then(function(){
        $location.path('/profile'); // redirect to '/profile'
      })
  };
}

SignupController.$inject = ["$location", "Account"];
function SignupController ($location, Account) {
  var vm = this;
  vm.new_user = {}; // form data

  vm.signup = function() {
    Account
      .signup(vm.new_user)
      .then(
        function (response) {
          $location.path('/profile');
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


ProfileController.$inject = ["Account", "$http", "$location", "$scope"]; // minification protection
function ProfileController (Account, $http, $location, $scope) {
  var vm = this;
  vm.new_profile = {}; // form data

  $scope.$on('account:updateListings',function(data) {
    console.log('hell yeah');
  });

  //get my bids.  TODO: refactor to look locally in Account
  $http({
    method: 'GET',
    url: '/api/your-responses'
  }).then(function successCallback(response) {
    vm.listings = response.data;
  }, function errorCallback(response) {
    console.log('Error getting data', response);
  });

  vm.deleteListing = function (listing) {

    console.log('hello from delete');

    $scope.$emit('hey');
    
    // $http({
    //   method: 'DELETE',
    //   url: '/api/listings/'+ $stateParams.listingId
    // }).then(function successCallback(json) {
    //   console.log(json);

    //   $location.path('/');
    // }, function errorCallback(response) {
    //   console.error('There was an error deleting the data', response);
    // });
  }

  vm.editListing = function (listing) {

    console.log('hello from edit');

    // $http({
    //   method: 'PUT',
    //   url: '/api/listings/'+$stateParams.listingId,
    //   data: listing
    // }).then(function successCallback(json) {
    // }, function errorCallback(response) {
    //   console.log('There was an error editing the data', response);
    // });
  }
    
  vm.updateProfile = function() {
    Account
      .updateProfile(vm.new_profile)
      .then(function () {
        vm.showEditForm = false;
      });
  };
}

ListingsIndexController.$inject = ['Account','$http', '$location'];
function ListingsIndexController (Account, $http, $location) {
  var vm = this;
  vm.newListing = {};

  //get all listings
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
      //add it to the local model
      Account.addListing(response.data);
      $location.path('/');
    }, function errorCallback(response) {
      console.log('Error posting data', response);
    });
  };

};

ListingShowController.$inject = ['$http', '$stateParams', '$location'];
function ListingShowController ($http, $stateParams, $location) {
  var vm = this;

  //get one listing.  TODO: refactor to look locally in Account
  $http({
    method: 'GET',
    url: '/api/listings/'+$stateParams.listingId
  }).then(function successCallback(json) {
    vm.listing = json.data;
  }, function errorCallback(response) {
    console.log('There was an error getting the data', response);
  });

  vm.createBid = function () {
    $http({
      method: 'POST',
      url: '/api/listings/'+ $stateParams.listingId + '/bids',
      data: vm.newBid
    }).then(function successCallback(json) {
      vm.listing.bids.push(json.data);
      vm.newBid = {};
    }, function errorCallback(response) {
      console.log('There was an error creating the data', response);
    });
  }

};


//////////////
// Services //
//////////////


//inject $rootScope so we can alert the controllers about data updates
Account.$inject = ["$auth", "$http", "$q", "$rootScope"]; // minification protection
function Account($auth, $http, $q, $rootScope) {
  var self = this;
  self.user = null;

  self.addListing = addListing;
  self.currentUser = currentUser;
  self.getProfile = getProfile;
  self.login = login;
  self.logout = logout;
  self.signup = signup;
  self.test = test;
  self.updateProfile = updateProfile;

  //method definitions

  function addListing(listingData) {
    self.user.listings.push(listingData);
  }

  /**
   * @description Gets the current user data.  First checks self.user, then checks for a 
   *    no valid authentication token, then asks the server for user data.  Since the 
   *    authentication token is stored in LocalStorage (by $auth.setToken), authentication 
   *    can persist if the browser is closed or refreshed.  
   * @returns {(object|null|promise)} Returns object if self.user is truthy (i.e. the user 
   *    is logged in and the browser hasn't been closed or refreshed), null if there is no 
   *    valid authentication token, and promise when there is a token but the user object 
   *    isn't truthy (e.g. after broser close and reopen [or refresh] but no logout).
  */
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
            alert("Invalid Email or Password");
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
            alert("Email is already taken");

          }
        )
    );
  }

  function test() {
    $rootScope.$broadcast('account:updateListings');
  }

  $rootScope.$on('hey',function name(params) {
    console.log('emit received');
  });

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
