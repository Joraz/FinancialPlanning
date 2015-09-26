/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class TransactionController implements ITransactionController
    {
        public static $inject = ['$scope', 'transactionService', 'transactionTypes', 'transactionSummaries', 'toasty', 'recurringTransactions'];
        public selectedTransactionType: FinancialPlanning.Common.Transactions.ITransactionType;
        public selectedTransaction: FinancialPlanning.Common.Transactions.IRecurringTransactionInstance;
        public transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>;
        public recurringTransactions: Array<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>;
        public nonRecurringTransactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>;
        public addingNewTransaction: boolean;
        public viewingRecurringTransactions: boolean;
        public newTransactionIsRecurring: boolean;
        public newTransactionAdjustment: number;
        public newTransactionDate: Date;
        public transactionSummaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>;
        public transactionEdit: ng.IFormController;

        constructor(public $scope: FinancialPlanning.ITransactionControllerScope, public transactionService: ITransactionService,
                    transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>,
                    transactionSummaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>,
                    public toasty: toasty.IToastyService,
                    recurringTransactions: Array<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>)
        {
            $scope.vm = this;
            this.transactionTypes = transactionTypes;
            this.recurringTransactions = [];
            this.nonRecurringTransactions = [];
            this.addingNewTransaction = false;
            this.viewingRecurringTransactions = false;
            this.newTransactionDate = new Date();
            this.recurringTransactions = recurringTransactions;
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

        public viewRecentTransactions(): void
        {
            this.addingNewTransaction = false;
            this.viewingRecurringTransactions = false;
        }

        public addNewTransaction(): void
        {
            this.addingNewTransaction = true;
            this.viewingRecurringTransactions = false;

        }

        public viewRecurringTransactions(): void
        {
            this.addingNewTransaction = false;
            this.viewingRecurringTransactions = true;
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
                    this.addingNewTransaction = false;
                    this.toasty.success({
                        title: "Success",
                        msg: "Successfully added transaction"
                    });
                    this.selectedTransactionType = null;
                    this.newTransactionDate = new Date();
                    this.newTransactionAdjustment = null;
                    this.newTransactionIsRecurring = false;
                    this.updateTransactionSummaries();
                })
                .catch((error: any) =>
                {
                    this.toasty.error({
                        title: "Error saving transaction",
                        msg: error.data
                    });
                });
        }

        public isActive(id: string): boolean
        {
            return this.selectedTransaction && this.selectedTransaction._id === id;
        }

        public getTransactionName(id: string): string
        {
            var transactions = this.recurringTransactions.filter(x => x._id === id);
            var transaction = transactions[0];
            var transactionTypes = this.transactionTypes.filter(x => x._id === transaction.transactionTypeId);
            return transactionTypes[0].name;
        }

        public cancelRecurringTransaction(id: string): void
        {
            this.transactionService.cancelRecurringTransaction(id)
                .then((response: FinancialPlanning.Common.Transactions.IRecurringTransactionInstance) =>
                {
                    this.toasty.success("Transaction cancelled!");
                    for (var i = 0; i < this.recurringTransactions.length; i++)
                    {
                        if (this.recurringTransactions[i]._id === id)
                        {
                            this.recurringTransactions[i] = response;
                        }
                    }
                })
                .catch((error: any) =>
                {
                    this.toasty.error("Could not cancel transaction");
                })
        }

        public updateTransactionSummaries(): void
        {
            this.transactionService.getTransactionSummaries(moment().subtract(30, 'day').toDate(), moment().toDate())
                .then((summaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>) =>
                {
                    this.transactionSummaries = summaries
                        .sort((first: FinancialPlanning.Common.Transactions.ITransactionSummary,
                               second: FinancialPlanning.Common.Transactions.ITransactionSummary) =>
                        {
                            return moment(first.transactionDate).isAfter(second.transactionDate) ? -1 : 1;
                        });
                    this.transactionSummaries.forEach((summary: FinancialPlanning.Common.Transactions.ITransactionSummary) =>
                    {
                        summary.adjustment = Math.abs(summary.adjustment);
                    });
                })
        }
    }
}