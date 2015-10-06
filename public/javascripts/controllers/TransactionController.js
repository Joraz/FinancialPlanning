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
//# sourceMappingURL=TransactionController.js.map