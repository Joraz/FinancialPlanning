/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class LoginService implements ILoginService
    {
        /**
         * Since all Angular services are singletons, we can store the token here safely
         */
        private jwt: any;

        public static $inject = ['$q', '$http'];

        constructor(private $q: ng.IQService, private $http: ng.IHttpService)
        {
        }

        /**
         *
         * @param username
         * @param password
         * @returns {IPromise<T>}
         */
        public login(username: string, password: string): ng.IPromise<any>
        {
            var deferred = this.$q.defer();

            var requestBody = {
                username: username,
                password: password
            };

            this.$http.post("http://localhost:3000/users/login", requestBody)
                .then((response: ng.IHttpPromiseCallbackArg<any>) =>
                {
                    this.jwt = response.data;
                    deferred.resolve(response);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }

        /**
         *
         * @returns {string}
         */
        public getJWT(): any
        {
            return "JWT " + this.jwt;
        }

        /**
         *
         * @returns {IPromise<T>}
         */
        public checkLoginStatus(): ng.IPromise<boolean>
        {
            var deferred = this.$q.defer();

            var requestConfig: ng.IRequestShortcutConfig = {
                headers: {
                    Authorization: this.getJWT()
                }
            };

            this.$http.get("http://localhost:3000/users/status", requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<any>) =>
                {
                    if (response && response.status && response.status === 200)
                    {
                        return deferred.resolve(true);
                    }
                })
                .catch((error: any) =>
                {
                    if (error && error.status && error.status === 401)
                    {
                        return deferred.resolve(false);
                    }

                    return deferred.reject(error);
                });

            return deferred.promise;
        }

        /**
         *
         * @returns {IPromise<T>}
         */
        public getUserSummary(): ng.IPromise<FinancialPlanning.Common.Users.IUserSummary>
        {
            var deferred = this.$q.defer();

            var requestConfig: ng.IRequestShortcutConfig = {
                headers: {
                    Authorization: this.getJWT()
                }
            };

            this.$http.get("http://localhost:3000/users/summary", requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<FinancialPlanning.Common.Users.IUserSummary>) =>
                {
                    deferred.resolve(response.data);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }

        /**
         *
         * @param username
         * @param password
         * @param balance
         * @param preferredName
         * @param lowLimitWarning
         * @returns {IPromise<T>}
         */
        public createUser(username: string, password: string, balance?: number, preferredName?: string, lowLimitWarning?: number): ng.IPromise<any>
        {
            var deferred = this.$q.defer();

            var requestBody: any = {
                username: username,
                password: password
            };

            if (!isNaN(balance))
            {
                requestBody.balance = balance;
            }

            if (preferredName)
            {
                requestBody.preferredName = preferredName;
            }

            if (!isNaN(lowLimitWarning))
            {
                requestBody.lowLimitWarning = lowLimitWarning;
            }

            this.$http.post("http://localhost:3000/users", requestBody)
                .then((response: ng.IHttpPromiseCallbackArg<any>) =>
                {
                    this.jwt = response.data;
                    deferred.resolve(response);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }

        /**
         *
         * @param preferredName
         * @param lowLimitWarning
         * @param password
         * @returns {IPromise<T>}
         */
        public updateUser(preferredName?: string, lowLimitWarning?: number, password?: string): ng.IPromise<any>
        {
            var deferred = this.$q.defer();

            var data: any = {};

            if (preferredName)
            {
                data.preferredName = preferredName;
            }

            if (!isNaN(lowLimitWarning))
            {
                data.lowLimitWarning = lowLimitWarning;
            }

            if (password)
            {
                data.password = password;
            }

            var requestConfig: ng.IRequestShortcutConfig = {
                headers: {
                    Authorization: this.getJWT()
                }
            };

            this.$http.put("http://localhost:3000/users", data, requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<any>) =>
                {
                    deferred.resolve(response.data);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }

        /**
         *
         * @returns {IPromise<T>}
         */
        public getUserDetails(): ng.IPromise<FinancialPlanning.Common.Users.IUserDetails>
        {
            var deferred = this.$q.defer();

            var requestConfig: ng.IRequestShortcutConfig = {
                headers: {
                    Authorization: this.getJWT()
                }
            };

            this.$http.get("http://localhost:3000/users/details", requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<FinancialPlanning.Common.Users.IUserDetails>) =>
                {
                    deferred.resolve(response.data);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }

        /**
         *
         * @param startDate
         * @param endDate
         */
        public getBalanceSummary(startDate: Date, endDate: Date): ng.IPromise<Array<FinancialPlanning.Common.Users.IBalanceSummary>>
        {
            var deferred = this.$q.defer();

            var params: any = {
                startDate: startDate,
                endDate: endDate
            };

            var requestConfig: ng.IRequestShortcutConfig = {
                params: params,
                headers: {
                    Authorization: this.getJWT()
                }
            };

            this.$http.get("http://localhost:3000/users/summary/balance", requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<FinancialPlanning.Common.Users.IBalanceSummary>) =>
                {
                    deferred.resolve(response.data);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }

        public getBalanceForecast(): ng.IPromise<Array<FinancialPlanning.Common.Users.IBalanceSummary>>
        {
            var deferred = this.$q.defer();

            var requestConfig: ng.IRequestShortcutConfig = {
                headers: {
                    Authorization: this.getJWT()
                }
            };

            this.$http.get("http://localhost:3000/users/forecast", requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<FinancialPlanning.Common.Users.IBalanceSummary>) =>
                {
                    deferred.resolve(response.data);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }

        public deleteUser(): ng.IPromise<any>
        {
            var deferred = this.$q.defer();

            var requestConfig: ng.IRequestShortcutConfig = {
                headers: {
                    Authorization: this.getJWT()
                }
            };

            this.$http.delete("http://localhost:3000/users/", requestConfig)
                .then((response: ng.IHttpPromiseCallbackArg<any>) =>
                {
                    this.jwt = null;
                    deferred.resolve(response.data);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }
    }
}