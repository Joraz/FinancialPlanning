/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class TransactionService implements ITransactionService
    {
        public static $inject = ['$q', '$http', 'loginService'];

        constructor(private $q: ng.IQService, private $http: ng.IHttpService, private loginService: ILoginService)
        {
        }

        public getTransactionInstances(startDate?: Date, endDate?: Date): ng.IPromise<Array<FinancialPlanning.Common.Transactions.ITransactionInstance>>
        {
            var deferred = this.$q.defer();

            var params: any = {};

            if (startDate)
            {
                params.startDate = startDate;
            }

            if (endDate)
            {
                params.endDate = endDate;
            }

            var requestConfig: ng.IRequestShortcutConfig = {
                params: params,
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };

            this.$http.get("http://localhost:3000/transactions", requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<Array<FinancialPlanning.Common.Transactions.ITransactionInstance>>) =>
                {
                    deferred.resolve(response.data);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }

        public getTransactionSummaries(startDate?: Date, endDate?: Date): ng.IPromise<Array<FinancialPlanning.Common.Transactions.ITransactionSummary>>
        {
            var deferred = this.$q.defer();

            var params: any = {};

            if (startDate)
            {
                params.startDate = startDate;
            }

            if (endDate)
            {
                params.endDate = endDate;
            }

            var requestConfig: ng.IRequestShortcutConfig = {
                params: params,
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };

            this.$http.get("http://localhost:3000/transactions/summaries", requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<Array<FinancialPlanning.Common.Transactions.ITransactionSummary>>) =>
                {
                    deferred.resolve(response.data);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }

        public createNewTransactionInstance(transactionTypeId: string, date: Date, adjustment: number): ng.IPromise<FinancialPlanning.Common.Transactions.ITransactionInstance>
        {
            var deferred = this.$q.defer();

            var data: any = {
                transactionTypeId: transactionTypeId,
                date: date,
                adjustment: adjustment
            };

            var requestConfig: ng.IRequestShortcutConfig = {
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };

            this.$http.post('http://localhost:3000/transactions/', data, requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<FinancialPlanning.Common.Transactions.ITransactionInstance>) =>
                {
                    deferred.resolve(response.data);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }

        public createNewRecurringTransactionInstance(transactionTypeId: string, startDate: Date, adjustment: number): ng.IPromise<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>
        {
            var deferred = this.$q.defer();

            var data: any = {
                transactionTypeId: transactionTypeId,
                startDate: startDate,
                adjustment: adjustment
            };

            var requestConfig: ng.IRequestShortcutConfig = {
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };

            this.$http.post('http://localhost:3000/transactions/recurring', data, requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<FinancialPlanning.Common.Transactions.ITransactionInstance>) =>
                {
                    deferred.resolve(response.data);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }

        public cancelRecurringTransaction(transactionInstanceId: string)
        {
            var deferred = this.$q.defer();

            var params: any = {
                transactionId: transactionInstanceId
            };

            var requestConfig: ng.IRequestShortcutConfig = {
                params: params,
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };

            this.$http.post('http://localhost:3000/transactions/recurring/cancel', requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<boolean>) =>
                {
                    deferred.resolve(response.data);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }

        public getTransactionTypes(): ng.IPromise<Array<FinancialPlanning.Common.Transactions.ITransactionType>>
        {
            var deferred = this.$q.defer();

            var requestConfig: ng.IRequestShortcutConfig = {
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };

            this.$http.get("http://localhost:3000/transactions/types", requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<FinancialPlanning.Common.Transactions.ITransactionType>) =>
                {
                    deferred.resolve(response.data);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }

        public createNewTransactionType(name: string, paymentDirection: string, classification: string, isTaxable: boolean, subClassification?: string): ng.IPromise<FinancialPlanning.Common.Transactions.ITransactionType>
        {
            var deferred = this.$q.defer();

            var data: any = {
                name: name,
                paymentDirection: paymentDirection,
                classification: classification,
                isTaxable: isTaxable
            };

            if (subClassification)
            {
                data.subClassification = subClassification
            }

            var requestConfig: ng.IRequestShortcutConfig = {
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };

            this.$http.post("http://localhost:3000/transactions/type", data, requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<FinancialPlanning.Common.Transactions.ITransactionType>) =>
                {
                    deferred.resolve(response.data);
                })
                .catch((error) =>
                {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        public updateTransactionType(transactionTypeId: string, name?: string, classification?: string, subClassification?: string): ng.IPromise<FinancialPlanning.Common.Transactions.ITransactionType>
        {
            var deferred = this.$q.defer();

            var data: any = {
                _id: transactionTypeId
            };

            if (name)
            {
                data.name = name
            }

            if (classification)
            {
                data.classification = classification;
            }

            if (subClassification)
            {
                data.subClassification = classification;
            }

            var requestConfig: ng.IRequestShortcutConfig = {
                headers: {
                    Authorization: this.loginService.getJWT()
                }
            };

            this.$http.put("http://localhost:3000/transactions/type", data, requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<FinancialPlanning.Common.Transactions.ITransactionType>) =>
                {
                    deferred.resolve(response.data);
                })
                .catch((error) =>
                {
                    deferred.reject(error);
                });

            return deferred.promise;
        }
    }
}