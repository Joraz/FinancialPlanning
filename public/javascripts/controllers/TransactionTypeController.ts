/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class TransactionTypeController implements ITransactionTypeController
    {
        public transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>;
        public selectedTransaction: FinancialPlanning.Common.Transactions.ITransactionType;
        public transactionTypeEdit: ng.IFormController;
        public isNewTransactionType: boolean = false;

        public static $inject = ['$scope', 'transactionTypes', 'transactionService', 'toasty'];

        constructor(public $scope: ITransactionTypeControllerScope, transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>,
                    public transactionService: ITransactionService, public toasty: toasty.IToastyService)
        {
            $scope.vm = this;
            this.transactionTypes = transactionTypes;
            this.selectedTransaction = this.transactionTypes[0] || null;
        }

        public addNewTransactionType(): void
        {
            var newTransaction: FinancialPlanning.Common.Transactions.ITransactionType = {
                paymentDirection: null,
                name: null,
                classification: null,
                subClassification: null,
                isDefault: false,
                isTaxable: false
            };

            this.isNewTransactionType = true;
            this.selectedTransaction = newTransaction;
        }

        public selectTransactionType(id: string): void
        {
            this.isNewTransactionType = false;
            var transactionType = this.transactionTypes.filter((transactionType: FinancialPlanning.Common.Transactions.ITransactionType) =>
            {
                return transactionType._id === id;
            });

            this.selectedTransaction = transactionType[0];
        }

        public saveTransactionType(): void
        {
            var httpPromise: ng.IPromise<any>;
            var transactionType = this.selectedTransaction;

            if (this.isNewTransactionType)
            {
                var taxable = transactionType.isTaxable && transactionType.paymentDirection === "incoming";

                httpPromise = this.transactionService.createNewTransactionType(transactionType.name, transactionType.paymentDirection,
                    transactionType.classification, taxable, transactionType.subClassification);

            }
            else
            {
                httpPromise = this.transactionService.updateTransactionType(transactionType._id, transactionType.name,
                    transactionType.classification, transactionType.subClassification);
            }

            httpPromise
                .then((response: FinancialPlanning.Common.Transactions.ITransactionType) =>
                {
                    this.toasty.success({
                        title: "Success!",
                        msg: "Transaction Type " + response.name + " saved"
                    });

                    this.transactionTypeEdit.$setPristine();

                    if (this.isNewTransactionType)
                    {
                        this.transactionTypes.push(response);
                        this.isNewTransactionType = false;
                    }
                })
                .catch((error: any) =>
                {
                    this.toasty.error({
                        title: "Error saving transaction type",
                        msg: error.data
                    });
                });
        }

        public isActive(id: string): boolean
        {
            return this.selectedTransaction._id === id;
        }
    }
}