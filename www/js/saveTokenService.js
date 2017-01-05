angular.module('saveTokenService', [])
    .service('saveTokenService', function($http, $q, $ionicLoading) {

        var base_url = 'http://localhost:3000';

        function register(device_token) {

            var deferred = $q.defer();
            $ionicLoading.show();

            /* $http.post(base_url + '/register', {'device_token': device_token})
                 .success(function(response){

                     $ionicLoading.hide();
                     deferred.resolve(response);

                 })
                 .error(function(data){
                     deferred.reject();
                 });*/

            console.log("Send the token to the server");

            $ionicLoading.hide();

            //return deferred.promise;
            return;
        };


        return {
            register: register
        };
    });
