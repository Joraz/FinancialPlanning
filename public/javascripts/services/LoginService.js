/// <reference path="../../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var LoginService = (function () {
        function LoginService($q, $http) {
            this.$q = $q;
            this.$http = $http;
        }
        /**
         *
         * @param username
         * @param password
         * @returns {IPromise<T>}
         */
        LoginService.prototype.login = function (username, password) {
            var _this = this;
            var deferred = this.$q.defer();
            var requestBody = {
                username: username,
                password: password
            };
            this.$http.post("http://localhost:3000/users/login", requestBody)
                .then(function (response) {
                _this.jwt = response.data;
                deferred.resolve(response);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        /**
         *
         * @returns {string}
         */
        LoginService.prototype.getJWT = function () {
            return "JWT " + this.jwt;
        };
        /**
         *
         * @returns {IPromise<T>}
         */
        LoginService.prototype.checkLoginStatus = function () {
            var deferred = this.$q.defer();
            var requestConfig = {
                headers: {
                    Authorization: this.getJWT()
                }
            };
            this.$http.get("http://localhost:3000/users/status", requestConfig)
                .then(function (response) {
                if (response && response.status && response.status === 200) {
                    return deferred.resolve(true);
                }
            })
                .catch(function (error) {
                if (error && error.status && error.status === 401) {
                    return deferred.resolve(false);
                }
                return deferred.reject(error);
            });
            return deferred.promise;
        };
        /**
         *
         * @returns {IPromise<T>}
         */
        LoginService.prototype.getUserSummary = function () {
            var deferred = this.$q.defer();
            var requestConfig = {
                headers: {
                    Authorization: this.getJWT()
                }
            };
            this.$http.get("http://localhost:3000/users/summary", requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        /**
         *
         * @param username
         * @param password
         * @param balance
         * @param preferredName
         * @param lowLimitWarning
         * @returns {IPromise<T>}
         */
        LoginService.prototype.createUser = function (username, password, balance, preferredName, lowLimitWarning) {
            var _this = this;
            var deferred = this.$q.defer();
            var requestBody = {
                username: username,
                password: password
            };
            if (!isNaN(balance)) {
                requestBody.balance = balance;
            }
            if (preferredName) {
                requestBody.preferredName = preferredName;
            }
            if (!isNaN(lowLimitWarning)) {
                requestBody.lowLimitWarning = lowLimitWarning;
            }
            this.$http.post("http://localhost:3000/users", requestBody)
                .then(function (response) {
                _this.jwt = response.data;
                deferred.resolve(response);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        /**
         *
         * @param preferredName
         * @param lowLimitWarning
         * @param password
         * @returns {IPromise<T>}
         */
        LoginService.prototype.updateUser = function (preferredName, lowLimitWarning, password) {
            var deferred = this.$q.defer();
            var data = {};
            if (preferredName) {
                data.preferredName = preferredName;
            }
            if (!isNaN(lowLimitWarning)) {
                data.lowLimitWarning = lowLimitWarning;
            }
            if (password) {
                data.password = password;
            }
            var requestConfig = {
                headers: {
                    Authorization: this.getJWT()
                }
            };
            this.$http.put("http://localhost:3000/users", data, requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        /**
         *
         * @returns {IPromise<T>}
         */
        LoginService.prototype.getUserDetails = function () {
            var deferred = this.$q.defer();
            var requestConfig = {
                headers: {
                    Authorization: this.getJWT()
                }
            };
            this.$http.get("http://localhost:3000/users/details", requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        /**
         *
         * @param startDate
         * @param endDate
         */
        LoginService.prototype.getBalanceSummary = function (startDate, endDate) {
            var deferred = this.$q.defer();
            var params = {
                startDate: startDate,
                endDate: endDate
            };
            var requestConfig = {
                params: params,
                headers: {
                    Authorization: this.getJWT()
                }
            };
            this.$http.get("http://localhost:3000/users/summary/balance", requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        LoginService.prototype.getBalanceForecast = function () {
            var deferred = this.$q.defer();
            var requestConfig = {
                headers: {
                    Authorization: this.getJWT()
                }
            };
            this.$http.get("http://localhost:3000/users/forecast", requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        LoginService.prototype.deleteUser = function () {
            var _this = this;
            var deferred = this.$q.defer();
            var requestConfig = {
                headers: {
                    Authorization: this.getJWT()
                }
            };
            this.$http.delete("http://localhost:3000/users/", requestConfig)
                .then(function (response) {
                _this.jwt = null;
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        LoginService.$inject = ['$q', '$http'];
        return LoginService;
    })();
    FinancialPlanning.LoginService = LoginService;
})(FinancialPlanning || (FinancialPlanning = {}));
//# sourceMappingURL=LoginService.js.map