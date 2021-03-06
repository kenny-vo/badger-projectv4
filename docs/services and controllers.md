## Keeping data up to date throughout the app: MainController and the Account service

The Account service communicates with the application with $rootScope.$broadcast.   This is less computationally expensive than  many calls to $scope.$watch.  

Typically, a controller will tell the Account service to update the database with `$scope.$emit`, and the Account service will tell controllers that new data is available with `$rootScope.$broadcast`.

### General guidelines for naming events  
Generally events are named &lt;source&gt;:&lt;verbNoun&gt;.  E.g. 'account:updateUsername' or 'listingsIndexCtrl:addListing'.

### Controller to Account service communication example  

In the controller:
``` javascript
$scope.$emit('profile:updateListing');
```
In the Account service:
``` javascript
$rootScope.$on('profile:updateListing', doSomethingCallback);
``` 
### Account service to controller communication example  
In the controller:
``` javascript
$scope.$on('account:updateListing', doSomethingCallback);
```
In the Account service:
``` javascript
$rootScope.$broadcast('account:updateListing');
``` 


## When to use MainController and when to call the Account service directly

*Why?* Eliminates the need to inject Account into a controller if you only need to call a method on it.  

If there is a UI component to what you’re doing (for example, if the user is clicking a button or you need to ng-repeat over the user's listings) and the **only** thing it does is call the Account service) then use MainController.  

If what you’re doing does a number of things including call the Account service, then call the Account service directly.  

 ``` javascript
/* 
  Avoid this in controllers other than MainController.  Instead,  
  make the method on MainController and call that in the HTML.
*/
vm.foo = function() {
  Account.bar();
}
```

 ``` javascript
//Do this in any controller.
vm.foo = function() {
  //some code here
  //another step here
  Account.bar();
}
```

