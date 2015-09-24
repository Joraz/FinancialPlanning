/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class TransactionController implements ITransactionController
    {
        public static $inject = ['$scope', 'transactionService', 'transactionTypes', 'transactionSummaries', 'toasty'];
        public selectedTransactionType: FinancialPlanning.Common.Transactions.ITransactionType;
        public transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>;
        public recurringTransactions: Array<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>;
        public nonRecurringTransactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>;
        public addingNewTransaction: boolean;
        public newTransactionIsRecurring: boolean;
        public newTransactionAdjustment: number;
        public newTransactionDate: Date;
        public transactionSummaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>;

        constructor(public $scope: FinancialPlanning.ITransactionControllerScope, public transactionService: ITransactionService,
                    transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>,
                    transactionSummaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>,
                    public toasty: toasty.IToastyService)
        {
            $scope.vm = this;
            this.transactionTypes = transactionTypes;
            this.recurringTransactions = [];
            this.nonRecurringTransactions = [];
            this.addingNewTransaction = false;
            //this.sortTransactions(transactions);
            this.newTransactionDate = new Date();
            this.transactionSummaries = transactionSummaries
                .sort((first: FinancialPlanning.Common.Transactions.ITransactionSummary,
                       second: FinancialPlanning.Common.Transactions.ITransactionSummary) =>
                {
                    return moment(first.transactionDate).isAfter(second.transactionDate) ? -1 : 1;
                });
            this.transactionSummaries.forEach((summary: FinancialPlanning.Common.Transactions.ITransactionSummary) =>
            {
                summary.adjustment = Math.abs(summary.adjustment);
            });
        }

        public sortTransactions(transactions: Array<FinancialPlanning.Common.Transactions.ITransaction>): void
        {
            // Have to type this as 'any' in order to ascertain whether it is a recurring or non-recurring transaction
            transactions.forEach((transaction: any) =>
            {
                if (transaction.startDate)
                {
                    this.recurringTransactions.push(transaction);
                }
                else
                {
                    this.nonRecurringTransactions.push(transaction);
                }
            });
        }

        public addNewTransaction(): void
        {
            this.addingNewTransaction = true;
        }

        public saveNewTransaction(): void
        {
            var transactionPromise: ng.IPromise<any>;
            var adjustment = this.selectedTransactionType.paymentDirection === "incoming" ? this.newTransactionAdjustment : -this.newTransactionAdjustment;

            if (this.newTransactionIsRecurring)
            {
                transactionPromise = this.transactionService.createNewRecurringTransactionInstance(this.selectedTransactionType._id, this.newTransactionDate, adjustment);
            }
            else
            {
                transactionPromise = this.transactionService.createNewTransactionInstance(this.selectedTransactionType._id, this.newTransactionDate, adjustment);
            }

            transactionPromise
                .then((response: any) =>
                {
                    this.$scope.$emit('balanceUpdateRequired');
                    //this.sortTransactions([response]);
                    this.addingNewTransaction = false;
                    this.toasty.success({
                        title: "Success",
                        msg: "Successfully added transaction"
                    })
                })
                .catch((error: any) =>
                {
                    this.toasty.error({
                        title: "Error saving transaction",
                        msg: error.data
                    });
                });
        }
    }
}