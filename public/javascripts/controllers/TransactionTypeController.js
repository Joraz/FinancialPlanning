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
//# sourceMappingURL=TransactionTypeController.js.map