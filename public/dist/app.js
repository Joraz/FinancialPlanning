/// <reference path="../../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var ChartController = (function () {
        function ChartController($scope, $q, transactionSummaries, balanceSummaries, balanceForecast, incomingTotals, outgoingTotals, transactionService, loginService, toasty) {
            var _this = this;
            this.$scope = $scope;
            this.$q = $q;
            this.transactionService = transactionService;
            this.loginService = loginService;
            this.toasty = toasty;
            this.donutChartData = {};
            this.inOutSeries = [];
            this.showValidationError = false;
            $scope.vm = this;
            this.dates = [];
            this.balances = [];
            this.forecastDates = [];
            this.forecastBalances = [];
            this.inOutTotals = [];
            this.transactionsFrom = moment().subtract(30, "days").toDate();
            this.transactionsTo = moment().toDate();
            this.setChartData(transactionSummaries, balanceSummaries, balanceForecast, incomingTotals, outgoingTotals);
            this.donutChartSettings = {
                tooltipTemplate: function (label) {
                    return label.label + ": " + Math.abs(label.value).toFixed(2);
                }
            };
            this.lineChartSettings = {
                tooltipTemplate: function (label) {
                    return label.label + ": " + label.value.toFixed(2);
                }
            };
            this.fromDatepickerStatus = {
                opened: false
            };
            this.toDatepickerStatus = {
                opened: false
            };
            $scope.$watch('vm.transactionsFrom', function () {
                _this.refreshCharts();
            });
            $scope.$watch('vm.transactionsTo', function () {
                _this.refreshCharts();
            });
        }
        ChartController.prototype.setChartData = function (transactionSummaries, balanceSummaries, balanceForecast, incomingTotals, outgoingTotals) {
            this.setDonutChartData(transactionSummaries);
            this.setLineChartData(balanceSummaries, balanceForecast);
            this.setBarChartData(incomingTotals, outgoingTotals);
        };
        ChartController.prototype.setDonutChartData = function (transactionSummaries) {
            // Group by classification
            var classifications = {};
            transactionSummaries.forEach(function (summary) {
                if (!classifications[summary.classification]) {
                    classifications[summary.classification] = {
                        adjustment: summary.adjustment
                    };
                }
                else {
                    classifications[summary.classification].adjustment += summary.adjustment;
                }
            });
            this.donutChartData["classificationNames"] = [];
            this.donutChartData["classificationAdjustments"] = [];
            for (var key in classifications) {
                if (classifications.hasOwnProperty(key)) {
                    this.donutChartData["classificationNames"].push(key);
                    this.donutChartData["classificationAdjustments"].push(classifications[key].adjustment);
                }
            }
            // Group by name
            var names = {};
            transactionSummaries.forEach(function (summary) {
                if (!names[summary.name]) {
                    names[summary.name] = {
                        adjustment: summary.adjustment
                    };
                }
                else {
                    names[summary.name].adjustment += summary.adjustment;
                }
            });
            this.donutChartData["nameNames"] = [];
            this.donutChartData["nameAdjustments"] = [];
            for (var key in names) {
                if (names.hasOwnProperty(key)) {
                    this.donutChartData["nameNames"].push(key);
                    this.donutChartData["nameAdjustments"].push(names[key].adjustment);
                }
            }
        };
        ChartController.prototype.setLineChartData = function (balanceSummaries, balanceForecast) {
            var _this = this;
            this.dates = [];
            this.balances = [];
            var balances = [];
            balanceSummaries.forEach(function (summary) {
                _this.dates.push(moment(summary.date).format("YYYY-MM-DD"));
                balances.push(summary.balance);
            });
            this.balances = [balances];
            if (balanceForecast) {
                this.forecastDates = [];
                this.forecastBalances = [];
                var forecastBalances = [];
                balanceForecast.forEach(function (summary) {
                    _this.forecastDates.push(moment(summary.date).format("YYYY-MM-DD"));
                    forecastBalances.push(summary.balance);
                });
                this.forecastBalances = [forecastBalances];
            }
        };
        ChartController.prototype.setBarChartData = function (incomingTotals, outgoingTotals) {
            var iTotals = incomingTotals.map(function (x) { return x.total; });
            var oTotals = outgoingTotals.map(function (x) { return x.total; });
            this.inOutDates = incomingTotals.map(function (x) { return x.month; });
            this.inOutTotals = [iTotals, oTotals];
            this.inOutSeries = ["incoming", "outgoing"];
        };
        ChartController.prototype.refreshCharts = function () {
            var _this = this;
            var startMoment = moment(this.transactionsFrom);
            var endMoment = moment(this.transactionsTo);
            if (endMoment.isBefore(startMoment)) {
                this.showValidationError = true;
            }
            else {
                this.showValidationError = false;
                var promises = [];
                promises.push(this.transactionService.getTransactionSummaries(this.transactionsFrom, this.transactionsTo));
                this.$q.all(promises)
                    .then(function (responses) {
                    var transactionSummary = responses[0];
                    _this.setDonutChartData(transactionSummary);
                })
                    .catch(function (error) {
                    _this.toasty.error("Error getting data");
                });
            }
        };
        ChartController.$inject = ['$scope', '$q', 'transactionSummaries', 'balanceSummaries', 'balanceForecast',
            'incomingTotals', 'outgoingTotals', 'transactionService', 'loginService', 'toasty'];
        return ChartController;
    })();
    FinancialPlanning.ChartController = ChartController;
})(FinancialPlanning || (FinancialPlanning = {}));
/// <reference path="../../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var HomeController = (function () {
        function HomeController($scope, $location, loginService, toasty) {
            var _this = this;
            this.$scope = $scope;
            this.$location = $location;
            this.loginService = loginService;
            this.toasty = toasty;
            $scope.vm = this;
            this.getUserSummary();
            $scope.$on('balanceUpdateRequired', function () {
                _this.getUserSummary();
            });
        }
        HomeController.prototype.getUserSummary = function () {
            var _this = this;
            this.loginService.getUserSummary()
                .then(function (summary) {
                _this.name = summary.name;
                _this.balance = summary.balance;
                if (summary.limitWarning) {
                    if (summary.balance < summary.limitWarning) {
                        _this.toasty.warning({
                            title: "Warning",
                            msg: "Your balance has dropped below your configured warning limit"
                        });
                    }
                }
            });
        };
        HomeController.prototype.isActive = function (path) {
            return this.$location.path() === '/home' + path;
        };
        HomeController.$inject = ['$scope', '$location', 'loginService', 'toasty'];
        return HomeController;
    })();
    FinancialPlanning.HomeController = HomeController;
})(FinancialPlanning || (FinancialPlanning = {}));
/// <reference path="../../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var LoginController = (function () {
        function LoginController($scope, $state, loginService, toasty) {
            this.$scope = $scope;
            this.$state = $state;
            this.loginService = loginService;
            this.toasty = toasty;
            this.username = "";
            this.password = "";
            $scope.vm = this;
        }
        LoginController.prototype.login = function () {
            var _this = this;
            this.loginService.login(this.username, this.password)
                .then(function () {
                _this.toasty.success({
                    title: "Success",
                    msg: "Successfully logged in"
                });
                _this.$state.go("home.charts");
            })
                .catch(function (error) {
                _this.toasty.error({
                    title: "Error Logging In",
                    msg: error.data
                });
            });
        };
        LoginController.prototype.createNewUser = function () {
            this.$state.go("createUser");
        };
        LoginController.$inject = ['$scope', '$state', 'loginService', 'toasty'];
        return LoginController;
    })();
    FinancialPlanning.LoginController = LoginController;
})(FinancialPlanning || (FinancialPlanning = {}));
/// <reference path="../../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var TransactionController = (function () {
        function TransactionController($scope, transactionService, transactionTypes, transactionSummaries, toasty, recurringTransactions) {
            this.$scope = $scope;
            this.transactionService = transactionService;
            this.toasty = toasty;
            $scope.vm = this;
            this.transactionTypes = transactionTypes;
            this.recurringTransactions = [];
            this.nonRecurringTransactions = [];
            this.addingNewTransaction = false;
            this.viewingRecurringTransactions = false;
            this.newTransactionDate = new Date();
            this.recurringTransactions = recurringTransactions;
            this.transactionSummaries = transactionSummaries
                .sort(function (first, second) {
                return moment(first.transactionDate).isAfter(second.transactionDate) ? -1 : 1;
            });
            this.transactionSummaries.forEach(function (summary) {
                summary.adjustment = Math.abs(summary.adjustment);
            });
        }
        TransactionController.prototype.viewRecentTransactions = function () {
            this.addingNewTransaction = false;
            this.viewingRecurringTransactions = false;
        };
        TransactionController.prototype.addNewTransaction = function () {
            this.addingNewTransaction = true;
            this.viewingRecurringTransactions = false;
        };
        TransactionController.prototype.viewRecurringTransactions = function () {
            this.addingNewTransaction = false;
            this.viewingRecurringTransactions = true;
        };
        TransactionController.prototype.saveNewTransaction = function () {
            var _this = this;
            var transactionPromise;
            var adjustment = this.selectedTransactionType.paymentDirection === "incoming" ? this.newTransactionAdjustment : -this.newTransactionAdjustment;
            if (this.newTransactionIsRecurring) {
                transactionPromise = this.transactionService.createNewRecurringTransactionInstance(this.selectedTransactionType._id, this.newTransactionDate, adjustment);
            }
            else {
                transactionPromise = this.transactionService.createNewTransactionInstance(this.selectedTransactionType._id, this.newTransactionDate, adjustment);
            }
            transactionPromise
                .then(function (response) {
                _this.$scope.$emit('balanceUpdateRequired');
                _this.addingNewTransaction = false;
                _this.toasty.success({
                    title: "Success",
                    msg: "Successfully added transaction"
                });
                _this.selectedTransactionType = null;
                _this.newTransactionDate = new Date();
                _this.newTransactionAdjustment = null;
                _this.newTransactionIsRecurring = false;
                _this.updateTransactionSummaries();
            })
                .catch(function (error) {
                _this.toasty.error({
                    title: "Error saving transaction",
                    msg: error.data
                });
            });
        };
        TransactionController.prototype.isActive = function (id) {
            return this.selectedTransaction && this.selectedTransaction._id === id;
        };
        TransactionController.prototype.getTransactionName = function (id) {
            var transactions = this.recurringTransactions.filter(function (x) { return x._id === id; });
            var transaction = transactions[0];
            var transactionTypes = this.transactionTypes.filter(function (x) { return x._id === transaction.transactionTypeId; });
            return transactionTypes[0].name;
        };
        TransactionController.prototype.cancelRecurringTransaction = function (id) {
            var _this = this;
            this.transactionService.cancelRecurringTransaction(id)
                .then(function (response) {
                _this.toasty.success("Transaction cancelled!");
                for (var i = 0; i < _this.recurringTransactions.length; i++) {
                    if (_this.recurringTransactions[i]._id === id) {
                        _this.recurringTransactions[i] = response;
                    }
                }
            })
                .catch(function (error) {
                _this.toasty.error("Could not cancel transaction");
            });
        };
        TransactionController.prototype.updateTransactionSummaries = function () {
            var _this = this;
            this.transactionService.getTransactionSummaries(moment().subtract(30, 'day').toDate(), moment().toDate())
                .then(function (summaries) {
                _this.transactionSummaries = summaries
                    .sort(function (first, second) {
                    return moment(first.transactionDate).isAfter(second.transactionDate) ? -1 : 1;
                });
                _this.transactionSummaries.forEach(function (summary) {
                    summary.adjustment = Math.abs(summary.adjustment);
                });
            });
        };
        TransactionController.$inject = ['$scope', 'transactionService', 'transactionTypes', 'transactionSummaries', 'toasty', 'recurringTransactions'];
        return TransactionController;
    })();
    FinancialPlanning.TransactionController = TransactionController;
})(FinancialPlanning || (FinancialPlanning = {}));
/// <reference path="../../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var TransactionTypeController = (function () {
        function TransactionTypeController($scope, transactionTypes, transactionService, toasty) {
            this.$scope = $scope;
            this.transactionService = transactionService;
            this.toasty = toasty;
            this.isNewTransactionType = false;
            $scope.vm = this;
            this.transactionTypes = transactionTypes;
            this.selectedTransaction = this.transactionTypes[0] || null;
        }
        TransactionTypeController.prototype.addNewTransactionType = function () {
            var newTransaction = {
                paymentDirection: null,
                name: null,
                classification: null,
                subClassification: null,
                isDefault: false,
                isTaxable: false
            };
            this.isNewTransactionType = true;
            this.selectedTransaction = newTransaction;
        };
        TransactionTypeController.prototype.selectTransactionType = function (id) {
            this.isNewTransactionType = false;
            var transactionType = this.transactionTypes.filter(function (transactionType) {
                return transactionType._id === id;
            });
            this.selectedTransaction = transactionType[0];
        };
        TransactionTypeController.prototype.saveTransactionType = function () {
            var _this = this;
            var httpPromise;
            var transactionType = this.selectedTransaction;
            if (this.isNewTransactionType) {
                var taxable = transactionType.isTaxable && transactionType.paymentDirection === "incoming";
                httpPromise = this.transactionService.createNewTransactionType(transactionType.name, transactionType.paymentDirection, transactionType.classification, taxable, transactionType.subClassification);
            }
            else {
                httpPromise = this.transactionService.updateTransactionType(transactionType._id, transactionType.name, transactionType.classification, transactionType.subClassification);
            }
            httpPromise
                .then(function (response) {
                _this.toasty.success({
                    title: "Success!",
                    msg: "Transaction Type " + response.name + " saved"
                });
                _this.transactionTypeEdit.$setPristine();
                if (_this.isNewTransactionType) {
                    _this.transactionTypes.push(response);
                    _this.isNewTransactionType = false;
                }
            })
                .catch(function (error) {
                _this.toasty.error({
                    title: "Error saving transaction type",
                    msg: error.data
                });
            });
        };
        TransactionTypeController.prototype.isActive = function (id) {
            return this.selectedTransaction._id === id;
        };
        TransactionTypeController.$inject = ['$scope', 'transactionTypes', 'transactionService', 'toasty'];
        return TransactionTypeController;
    })();
    FinancialPlanning.TransactionTypeController = TransactionTypeController;
})(FinancialPlanning || (FinancialPlanning = {}));
/// <reference path="../../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var UserController = (function () {
        function UserController($scope, $state, loginService, toasty) {
            this.$scope = $scope;
            this.$state = $state;
            this.toasty = toasty;
            this.username = "";
            this.password = "";
            $scope.vm = this;
            this.loginService = loginService;
        }
        UserController.prototype.createUser = function () {
            var _this = this;
            this.loginService.createUser(this.username, this.password, this.balance, this.preferredName, this.lowLimitWarning)
                .then(function () {
                _this.toasty.success({
                    title: "Success",
                    msg: "Successfully created user " + _this.username
                });
                _this.$state.go("home.charts");
            })
                .catch(function (error) {
                var options = {
                    title: "Error Creating User",
                    msg: error.data
                };
                _this.toasty.error(options);
            });
        };
        UserController.$inject = ['$scope', '$state', 'loginService', 'toasty'];
        return UserController;
    })();
    FinancialPlanning.UserController = UserController;
})(FinancialPlanning || (FinancialPlanning = {}));
/// <reference path="../../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var UserEditController = (function () {
        function UserEditController($scope, $modal, userData, loginService, toasty) {
            this.$scope = $scope;
            this.$modal = $modal;
            this.loginService = loginService;
            this.toasty = toasty;
            $scope.vm = this;
            this.preferredName = userData.preferredName;
            this.lowLimitWarning = userData.lowLimitWarning;
            this.password = "";
        }
        UserEditController.prototype.saveUserDetails = function () {
            var _this = this;
            var password = this.password === "" ? null : this.password;
            this.loginService.updateUser(this.preferredName, this.lowLimitWarning, password)
                .then(function (response) {
                _this.$scope.$emit('balanceUpdateRequired');
                _this.toasty.success({
                    title: "Success!",
                    msg: "User details saved"
                });
            })
                .catch(function (error) {
                _this.toasty.error({
                    title: "Error saving user details",
                    msg: error.data
                });
            });
        };
        UserEditController.prototype.deleteUser = function () {
            this.$modal.open({
                animation: true,
                templateUrl: "templates/confirm-modal.html",
                controller: "modalController"
            });
        };
        UserEditController.$inject = ['$scope', '$modal', 'userData', 'loginService', 'toasty'];
        return UserEditController;
    })();
    FinancialPlanning.UserEditController = UserEditController;
})(FinancialPlanning || (FinancialPlanning = {}));
/// <reference path="../../../../reference.ts" />
/// <reference path="../../../../reference.ts" />
/// <reference path="../../../../reference.ts" />
/// <reference path="../../../../reference.ts" />
/// <reference path="../../../../reference.ts" />
/// <reference path="../../../../reference.ts" />
/// <reference path="../../../../reference.ts" />
/// <reference path="../../../../reference.ts" />
/// <reference path="../../../../reference.ts" />
/// <reference path="../../../../reference.ts" />
/// <reference path="../../../../reference.ts" />
/// <reference path="../../../reference.ts" />
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
/// <reference path="../../../../reference.ts" />
/// <reference path="../../../../reference.ts" />
/// <reference path="./typings/angularjs/angular.d.ts" />
/// <reference path="./typings/angular-toasty/angular-toasty.d.ts" />
/// <reference path="./typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="./typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="./typings/financial-planning/financial-planning.d.ts" />
/// <reference path="./typings/moment/moment.d.ts" />
/// <reference path="./typings/chartjs/chart.d.ts" />
//grunt-start
/// <reference path="public/javascripts/controllers/ChartController.ts" />
/// <reference path="public/javascripts/controllers/HomeController.ts" />
/// <reference path="public/javascripts/controllers/LoginController.ts" />
/// <reference path="public/javascripts/controllers/TransactionController.ts" />
/// <reference path="public/javascripts/controllers/TransactionTypeController.ts" />
/// <reference path="public/javascripts/controllers/UserController.ts" />
/// <reference path="public/javascripts/controllers/UserEditController.ts" />
/// <reference path="public/javascripts/controllers/interfaces/IChartController.ts" />
/// <reference path="public/javascripts/controllers/interfaces/IHomeController.ts" />
/// <reference path="public/javascripts/controllers/interfaces/ILoginController.ts" />
/// <reference path="public/javascripts/controllers/interfaces/ITransactionController.ts" />
/// <reference path="public/javascripts/controllers/interfaces/ITransactionTypeController.ts" />
/// <reference path="public/javascripts/controllers/interfaces/IUserController.ts" />
/// <reference path="public/javascripts/controllers/interfaces/IUserEditController.ts" />
/// <reference path="public/javascripts/controllers/scope/IChartControllerScope.ts" />
/// <reference path="public/javascripts/controllers/scope/IHomeControllerScope.ts" />
/// <reference path="public/javascripts/controllers/scope/ILoginControllerScope.ts" />
/// <reference path="public/javascripts/controllers/scope/ITransactionControllerScope.ts" />
/// <reference path="public/javascripts/controllers/scope/ITransactionTypeControllerScope.ts" />
/// <reference path="public/javascripts/controllers/scope/IUserControllerScope.ts" />
/// <reference path="public/javascripts/controllers/scope/IUserEditControllerScope.ts" />
/// <reference path="public/javascripts/interfaces/IAppRootScope.ts" />
/// <reference path="public/javascripts/services/LoginService.ts" />
/// <reference path="public/javascripts/services/TransactionService.ts" />
/// <reference path="public/javascripts/services/interfaces/ILoginService.ts" />
/// <reference path="public/javascripts/services/interfaces/ITransactionService.ts" />
//grunt-end
/// <reference path="public/javascripts/app.ts" />
/// <reference path="../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var app = angular.module('financialPlanning', ['ui.router', 'angular-toasty', 'chart.js', 'ui.bootstrap'])
        .controller('loginController', FinancialPlanning.LoginController)
        .controller('homeController', FinancialPlanning.HomeController)
        .controller('userController', FinancialPlanning.UserController)
        .controller('transactionTypeController', FinancialPlanning.TransactionTypeController)
        .controller('chartController', FinancialPlanning.ChartController)
        .controller('transactionController', FinancialPlanning.TransactionController)
        .controller('userEditController', FinancialPlanning.UserEditController)
        .controller('modalController', function ($scope, $modalInstance, $state, loginService, toasty) {
        $scope.confirm = function () {
            loginService.deleteUser()
                .then(function () {
                $modalInstance.close();
                $state.go("login");
                toasty.success("User account deleted");
            })
                .catch(function () {
                toasty.error("Could not delete user");
            });
        };
    })
        .service('loginService', FinancialPlanning.LoginService)
        .service('transactionService', FinancialPlanning.TransactionService);
    app
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state("login", {
                templateUrl: "templates/login.html",
                controller: "loginController",
                url: "/login",
                data: {
                    authenticate: false
                }
            })
                .state("createUser", {
                templateUrl: "templates/new-user.html",
                controller: "userController",
                url: "/create-user",
                data: {
                    authenticate: false
                }
            })
                .state("home", {
                templateUrl: "templates/home.html",
                controller: "homeController",
                url: "/home",
                data: {
                    authenticate: true
                }
            })
                .state("home.charts", {
                templateUrl: "templates/charts.html",
                controller: "chartController",
                url: "/charts",
                data: {
                    authenticate: true
                },
                resolve: {
                    transactionSummaries: function (transactionService) {
                        return transactionService.getTransactionSummaries(moment().subtract(30, "day").toDate(), new Date());
                    },
                    balanceSummaries: function (loginService) {
                        return loginService.getBalanceSummary(moment().subtract(30, "day").toDate(), new Date());
                    },
                    balanceForecast: function (loginService) {
                        return loginService.getBalanceForecast();
                    },
                    incomingTotals: function (transactionService) {
                        return transactionService.getIncomingTotals();
                    },
                    outgoingTotals: function (transactionService) {
                        return transactionService.getOutgoingTotals();
                    }
                }
            })
                .state("home.transactionTypes", {
                templateUrl: "templates/transaction-types.html",
                controller: "transactionTypeController",
                url: "/transaction-types",
                data: {
                    authenticate: true
                },
                resolve: {
                    transactionTypes: function (transactionService) {
                        return transactionService.getTransactionTypes();
                    }
                }
            })
                .state("home.transactions", {
                templateUrl: "templates/transactions.html",
                controller: "transactionController",
                url: "/transactions",
                data: {
                    authenticate: true
                },
                resolve: {
                    transactionTypes: function (transactionService) {
                        return transactionService.getTransactionTypes();
                    },
                    transactionSummaries: function (transactionService) {
                        return transactionService.getTransactionSummaries(moment().subtract(30, 'day').toDate(), moment().toDate());
                    },
                    recurringTransactions: function (transactionService) {
                        return transactionService.getRecurringTransactionInstances();
                    }
                }
            })
                .state("home.editUser", {
                templateUrl: "templates/edit-user.html",
                controller: "userEditController",
                url: "/edit-user",
                data: {
                    authenticate: true
                },
                resolve: {
                    userData: function (loginService) {
                        return loginService.getUserDetails();
                    }
                }
            });
            $urlRouterProvider.otherwise('/login');
        }])
        .config(['toastyConfigProvider', function (toastyConfigProvider) {
            toastyConfigProvider.setConfig({
                limit: 3,
                showClose: false,
                clickToClose: true,
                position: 'top-left',
                sound: false,
                shake: false,
                html: true,
                theme: 'bootstrap'
            });
        }])
        .config(['ChartJsProvider', function (ChartJsProvider) {
            ChartJsProvider.setOptions('Bar', {
                colours: ['#1266AA', '#EB7933']
            });
            ChartJsProvider.setOptions('Doughnut', {
                colours: ['#39AA4E', '#55BCA7', '#367AB7', '#605298', '#8C68A6', '#A974AC', '#AA3866', '#E75935',
                    '#ED7D3B', '#F7BC4E', '#F9ED5B', '#BDD44D']
            });
            ChartJsProvider.setOptions('Line', {
                colours: ['#1A663A']
            });
        }])
        .run(['$rootScope', '$state', 'loginService', 'toasty',
        function ($rootScope, $state, loginService, toasty) {
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                console.info("$stateChangeError");
                if (error && error.status && error.status === 401) {
                    event.preventDefault();
                    $state.go('login');
                }
                else {
                    console.info(error);
                    toasty.error({
                        title: "State Change Error",
                        msg: error.message
                    });
                }
            });
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
                var requiresLogin = toState.data.authenticate;
                if (requiresLogin && requiresLogin === true) {
                    event.preventDefault();
                    loginService.checkLoginStatus()
                        .then(function (isLoggedIn) {
                        if (isLoggedIn) {
                            console.log("Transitioning from state: " + fromState.name + " to state: " + toState.name);
                            $state.go(toState.name, toParams, { notify: false })
                                .then(function () {
                                $rootScope.$broadcast('$stateChangeSuccess', toState, toParams);
                            });
                        }
                        else {
                            toasty.error({
                                title: "Unauthorised",
                                msg: "You must be logged in to access that resource"
                            });
                            $state.go("login");
                        }
                    })
                        .catch(function (error) {
                        toasty.error({
                            title: "State Change Error",
                            msg: error.message
                        });
                    });
                }
                else {
                    console.log("Transitioning from state: " + fromState.name + " to state: " + toState.name);
                    $state.go(toState.name, toParams, { notify: false })
                        .then(function () {
                        $rootScope.$broadcast('$stateChangeSuccess', toState, toParams);
                    });
                }
            });
        }]);
})(FinancialPlanning || (FinancialPlanning = {}));
//# sourceMappingURL=app.js.map