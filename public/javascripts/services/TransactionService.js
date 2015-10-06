/// <reference path="../../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var TransactionService = (function () {
        function TransactionService($q, $http, loginService) {
            this.$q = $q;
            this.$http = $http;
            this.loginService = loginService;
        }
        TransactionService.prototype.getTransactionInstances = function (startDate, endDate) {
            var deferred = this.$q.defer();
            var params = {};
            if (startDate) {
                params.startDate = startDate;
            }
            if (endDate) {
                params.endDate = endDate;
            }
            var requestConfig = {
                params: params,
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };
            this.$http.get("http://localhost:3000/transactions", requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        TransactionService.prototype.getRecurringTransactionInstances = function (startDate, endDate) {
            var deferred = this.$q.defer();
            var params = {};
            if (startDate) {
                params.startDate = startDate;
            }
            if (endDate) {
                params.endDate = endDate;
            }
            var requestConfig = {
                params: params,
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };
            this.$http.get("http://localhost:3000/transactions/recurring", requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        TransactionService.prototype.getIncomingTotals = function () {
            var deferred = this.$q.defer();
            var requestConfig = {
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };
            this.$http.get("http://localhost:3000/transactions/incoming/totals", requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        TransactionService.prototype.getOutgoingTotals = function () {
            var deferred = this.$q.defer();
            var requestConfig = {
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };
            this.$http.get("http://localhost:3000/transactions/outgoing/totals", requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        TransactionService.prototype.getTransactionSummaries = function (startDate, endDate) {
            var deferred = this.$q.defer();
            var params = {};
            if (startDate) {
                params.startDate = startDate;
            }
            if (endDate) {
                params.endDate = endDate;
            }
            var requestConfig = {
                params: params,
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };
            this.$http.get("http://localhost:3000/transactions/summaries", requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        TransactionService.prototype.createNewTransactionInstance = function (transactionTypeId, date, adjustment) {
            var deferred = this.$q.defer();
            var data = {
                transactionTypeId: transactionTypeId,
                date: date,
                adjustment: adjustment
            };
            var requestConfig = {
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };
            this.$http.post('http://localhost:3000/transactions/', data, requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        TransactionService.prototype.createNewRecurringTransactionInstance = function (transactionTypeId, startDate, adjustment) {
            var deferred = this.$q.defer();
            var data = {
                transactionTypeId: transactionTypeId,
                startDate: startDate,
                adjustment: adjustment
            };
            var requestConfig = {
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };
            this.$http.post('http://localhost:3000/transactions/recurring', data, requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        TransactionService.prototype.cancelRecurringTransaction = function (transactionInstanceId) {
            var deferred = this.$q.defer();
            var data = {
                transactionId: transactionInstanceId
            };
            var requestConfig = {
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };
            this.$http.post('http://localhost:3000/transactions/recurring/cancel', data, requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        TransactionService.prototype.getTransactionTypes = function () {
            var deferred = this.$q.defer();
            var requestConfig = {
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };
            this.$http.get("http://localhost:3000/transactions/types", requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(deferred.reject);
            return deferred.promise;
        };
        TransactionService.prototype.createNewTransactionType = function (name, paymentDirection, classification, isTaxable, subClassification) {
            var deferred = this.$q.defer();
            var data = {
                name: name,
                paymentDirection: paymentDirection,
                classification: classification,
                isTaxable: isTaxable
            };
            if (subClassification) {
                data.subClassification = subClassification;
            }
            var requestConfig = {
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };
            this.$http.post("http://localhost:3000/transactions/type", data, requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        TransactionService.prototype.updateTransactionType = function (transactionTypeId, name, classification, subClassification) {
            var deferred = this.$q.defer();
            var data = {
                _id: transactionTypeId
            };
            if (name) {
                data.name = name;
            }
            if (classification) {
                data.classification = classification;
            }
            if (subClassification) {
                data.subClassification = classification;
            }
            var requestConfig = {
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };
            this.$http.put("http://localhost:3000/transactions/type", data, requestConfig)
                .then(function (response) {
                deferred.resolve(response.data);
            })
                .catch(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        TransactionService.$inject = ['$q', '$http', 'loginService'];
        return TransactionService;
    })();
    FinancialPlanning.TransactionService = TransactionService;
})(FinancialPlanning || (FinancialPlanning = {}));
//# sourceMappingURL=TransactionService.js.map