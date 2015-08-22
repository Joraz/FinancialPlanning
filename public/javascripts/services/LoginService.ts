/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class LoginService implements ILoginService
    {
        private q: ng.IQService;
        private http: ng.IHttpService;

        private jwt: any;

        public static $inject = ['$q', '$http'];

        constructor($q: ng.IQService, $http: ng.IHttpService)
        {
            this.q = $q;
            this.http = $http;
        }

        public login(username: string, password: string): ng.IPromise<any>
        {
            var deferred = this.q.defer();

            var requestBody = {
                "username": username,
                "password": password
            };

            this.http.post("http://localhost:3000/login", requestBody)
                .then((response: any) =>
                {
                    this.jwt = response;
                    deferred.resolve(response);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }

        public getJWT(): any
        {
            return this.jwt;
        }
    }
}