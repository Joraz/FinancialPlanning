/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angular-toasty/angular-toasty.d.ts" />
/// <reference path="../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../typings/financial-planning/financial-planning.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/chartjs/chart.d.ts" />
declare module FinancialPlanning {
    class ChartController implements IChartController {
        $scope: IChartControllerScope;
        $q: ng.IQService;
        transactionService: ITransactionService;
        loginService: ILoginService;
        toasty: toasty.IToastyService;
        donutChartSettings: any;
        lineChartSettings: any;
        donutChartData: {};
        transactionsFrom: Date;
        transactionsTo: Date;
        dates: Array<string>;
        balances: Array<Array<number>>;
        forecastDates: Array<string>;
        forecastBalances: Array<Array<number>>;
        inOutDates: Array<string>;
        inOutTotals: Array<Array<number>>;
        inOutSeries: any[];
        fromDatepickerStatus: any;
        toDatepickerStatus: any;
        showValidationError: boolean;
        static $inject: string[];
        constructor($scope: IChartControllerScope, $q: ng.IQService, transactionSummaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>, balanceSummaries: Array<FinancialPlanning.Common.Users.IBalanceSummary>, balanceForecast: Array<FinancialPlanning.Common.Users.IBalanceSummary>, incomingTotals: Array<FinancialPlanning.Common.Transactions.IMonthTotal>, outgoingTotals: Array<FinancialPlanning.Common.Transactions.IMonthTotal>, transactionService: ITransactionService, loginService: ILoginService, toasty: toasty.IToastyService);
        private setChartData(transactionSummaries, balanceSummaries, balanceForecast, incomingTotals, outgoingTotals);
        private setDonutChartData(transactionSummaries);
        private setLineChartData(balanceSummaries, balanceForecast?);
        private setBarChartData(incomingTotals, outgoingTotals);
        private refreshCharts();
    }
}
declare module FinancialPlanning {
    class HomeController implements IHomeController {
        $scope: IHomeControllerScope;
        $location: ng.ILocationService;
        private loginService;
        toasty: toasty.IToastyService;
        name: string;
        balance: number;
        static $inject: string[];
        constructor($scope: IHomeControllerScope, $location: ng.ILocationService, loginService: ILoginService, toasty: toasty.IToastyService);
        getUserSummary(): void;
        isActive(path: string): boolean;
    }
}
declare module FinancialPlanning {
    class LoginController implements ILoginController {
        $scope: ILoginControllerScope;
        $state: ng.ui.IStateService;
        loginService: ILoginService;
        toasty: toasty.IToastyService;
        static $inject: string[];
        username: string;
        password: string;
        constructor($scope: ILoginControllerScope, $state: ng.ui.IStateService, loginService: ILoginService, toasty: toasty.IToastyService);
        login(): void;
        createNewUser(): void;
    }
}
declare module FinancialPlanning {
    class TransactionController implements ITransactionController {
        $scope: FinancialPlanning.ITransactionControllerScope;
        transactionService: ITransactionService;
        toasty: toasty.IToastyService;
        static $inject: string[];
        selectedTransactionType: FinancialPlanning.Common.Transactions.ITransactionType;
        selectedTransaction: FinancialPlanning.Common.Transactions.IRecurringTransactionInstance;
        transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>;
        recurringTransactions: Array<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>;
        nonRecurringTransactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>;
        addingNewTransaction: boolean;
        viewingRecurringTransactions: boolean;
        newTransactionIsRecurring: boolean;
        newTransactionAdjustment: number;
        newTransactionDate: Date;
        transactionSummaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>;
        transactionEdit: ng.IFormController;
        constructor($scope: FinancialPlanning.ITransactionControllerScope, transactionService: ITransactionService, transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>, transactionSummaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>, toasty: toasty.IToastyService, recurringTransactions: Array<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>);
        viewRecentTransactions(): void;
        addNewTransaction(): void;
        viewRecurringTransactions(): void;
        saveNewTransaction(): void;
        isActive(id: string): boolean;
        getTransactionName(id: string): string;
        cancelRecurringTransaction(id: string): void;
        updateTransactionSummaries(): void;
    }
}
declare module FinancialPlanning {
    class TransactionTypeController implements ITransactionTypeController {
        $scope: ITransactionTypeControllerScope;
        transactionService: ITransactionService;
        toasty: toasty.IToastyService;
        transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>;
        selectedTransaction: FinancialPlanning.Common.Transactions.ITransactionType;
        transactionTypeEdit: ng.IFormController;
        isNewTransactionType: boolean;
        static $inject: string[];
        constructor($scope: ITransactionTypeControllerScope, transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>, transactionService: ITransactionService, toasty: toasty.IToastyService);
        addNewTransactionType(): void;
        selectTransactionType(id: string): void;
        saveTransactionType(): void;
        isActive(id: string): boolean;
    }
}
declare module FinancialPlanning {
    class UserController implements IUserController {
        $scope: IUserControllerScope;
        $state: ng.ui.IStateService;
        toasty: toasty.IToastyService;
        private loginService;
        username: string;
        password: string;
        balance: any;
        preferredName: any;
        lowLimitWarning: any;
        static $inject: string[];
        constructor($scope: IUserControllerScope, $state: ng.ui.IStateService, loginService: ILoginService, toasty: toasty.IToastyService);
        createUser(): void;
    }
}
declare module FinancialPlanning {
    class UserEditController implements IUserEditController {
        $scope: IUserEditControllerScope;
        $modal: ng.ui.bootstrap.IModalService;
        loginService: ILoginService;
        toasty: toasty.IToastyService;
        preferredName: string;
        lowLimitWarning: number;
        password: string;
        static $inject: string[];
        constructor($scope: IUserEditControllerScope, $modal: ng.ui.bootstrap.IModalService, userData: FinancialPlanning.Common.Users.IUserDetails, loginService: ILoginService, toasty: toasty.IToastyService);
        saveUserDetails(): void;
        deleteUser(): void;
    }
}
declare module FinancialPlanning {
    interface IChartController {
        transactionsFrom: Date;
        transactionsTo: Date;
        dates: Array<string>;
        balances: Array<Array<number>>;
    }
}
declare module FinancialPlanning {
    interface IHomeController {
        name: string;
        balance: number;
        isActive(path: string): boolean;
    }
}
declare module FinancialPlanning {
    interface ILoginController {
        username: string;
        password: string;
        login(): void;
        createNewUser(): void;
    }
}
declare module FinancialPlanning {
    interface ITransactionController {
        selectedTransactionType: FinancialPlanning.Common.Transactions.ITransactionType;
        transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>;
        recurringTransactions: Array<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>;
        nonRecurringTransactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>;
        addingNewTransaction: boolean;
        addNewTransaction(): void;
        saveNewTransaction(): void;
    }
}
declare module FinancialPlanning {
    interface ITransactionTypeController {
        transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>;
        selectedTransaction: FinancialPlanning.Common.Transactions.ITransactionType;
        isNewTransactionType: boolean;
        addNewTransactionType(): void;
        selectTransactionType(id: string): void;
        saveTransactionType(): void;
        isActive(id: string): boolean;
    }
}
declare module FinancialPlanning {
    interface IUserController {
        username: string;
        password: string;
        balance: number;
        preferredName: string;
        lowLimitWarning: number;
        createUser(): void;
    }
}
declare module FinancialPlanning {
    interface IUserEditController {
        preferredName: string;
        lowLimitWarning: number;
        saveUserDetails(): void;
    }
}
declare module FinancialPlanning {
    interface IChartControllerScope extends ng.IScope {
        vm: IChartController;
    }
}
declare module FinancialPlanning {
    interface IHomeControllerScope extends ng.IScope {
        vm: IHomeController;
    }
}
declare module FinancialPlanning {
    interface ILoginControllerScope extends ng.IScope {
        vm: ILoginController;
    }
}
declare module FinancialPlanning {
    interface ITransactionControllerScope extends ng.IScope {
        vm: ITransactionController;
        transactionEdit: ng.IFormController;
    }
}
declare module FinancialPlanning {
    interface ITransactionTypeControllerScope extends ng.IScope {
        vm: ITransactionTypeController;
        transactionTypeEdit: ng.IFormController;
    }
}
declare module FinancialPlanning {
    interface IUserControllerScope extends ng.IScope {
        vm: IUserController;
    }
}
declare module FinancialPlanning {
    interface IUserEditControllerScope extends ng.IScope {
        vm: IUserEditController;
    }
}
declare module FinancialPlanning {
    interface IAppRootScope extends ng.IRootScopeService {
        currentUser?: any;
    }
}
declare module FinancialPlanning {
    class LoginService implements ILoginService {
        private $q;
        private $http;
        /**
         * Since all Angular services are singletons, we can store the token here safely
         */
        private jwt;
        static $inject: string[];
        constructor($q: ng.IQService, $http: ng.IHttpService);
        /**
         *
         * @param username
         * @param password
         * @returns {IPromise<T>}
         */
        login(username: string, password: string): ng.IPromise<any>;
        /**
         *
         * @returns {string}
         */
        getJWT(): any;
        /**
         *
         * @returns {IPromise<T>}
         */
        checkLoginStatus(): ng.IPromise<boolean>;
        /**
         *
         * @returns {IPromise<T>}
         */
        getUserSummary(): ng.IPromise<FinancialPlanning.Common.Users.IUserSummary>;
        /**
         *
         * @param username
         * @param password
         * @param balance
         * @param preferredName
         * @param lowLimitWarning
         * @returns {IPromise<T>}
         */
        createUser(username: string, password: string, balance?: number, preferredName?: string, lowLimitWarning?: number): ng.IPromise<any>;
        /**
         *
         * @param preferredName
         * @param lowLimitWarning
         * @param password
         * @returns {IPromise<T>}
         */
        updateUser(preferredName?: string, lowLimitWarning?: number, password?: string): ng.IPromise<any>;
        /**
         *
         * @returns {IPromise<T>}
         */
        getUserDetails(): ng.IPromise<FinancialPlanning.Common.Users.IUserDetails>;
        /**
         *
         * @param startDate
         * @param endDate
         */
        getBalanceSummary(startDate: Date, endDate: Date): ng.IPromise<Array<FinancialPlanning.Common.Users.IBalanceSummary>>;
        getBalanceForecast(): ng.IPromise<Array<FinancialPlanning.Common.Users.IBalanceSummary>>;
        deleteUser(): ng.IPromise<any>;
    }
}
declare module FinancialPlanning {
    class TransactionService implements ITransactionService {
        private $q;
        private $http;
        private loginService;
        static $inject: string[];
        constructor($q: ng.IQService, $http: ng.IHttpService, loginService: ILoginService);
        getTransactionInstances(startDate?: Date, endDate?: Date): ng.IPromise<Array<FinancialPlanning.Common.Transactions.ITransactionInstance>>;
        getRecurringTransactionInstances(startDate?: Date, endDate?: Date): ng.IPromise<Array<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>>;
        getIncomingTotals(): ng.IPromise<Array<FinancialPlanning.Common.Transactions.IMonthTotal>>;
        getOutgoingTotals(): ng.IPromise<Array<FinancialPlanning.Common.Transactions.IMonthTotal>>;
        getTransactionSummaries(startDate?: Date, endDate?: Date): ng.IPromise<Array<FinancialPlanning.Common.Transactions.ITransactionSummary>>;
        createNewTransactionInstance(transactionTypeId: string, date: Date, adjustment: number): ng.IPromise<FinancialPlanning.Common.Transactions.ITransactionInstance>;
        createNewRecurringTransactionInstance(transactionTypeId: string, startDate: Date, adjustment: number): ng.IPromise<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>;
        cancelRecurringTransaction(transactionInstanceId: string): ng.IPromise<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>;
        getTransactionTypes(): ng.IPromise<Array<FinancialPlanning.Common.Transactions.ITransactionType>>;
        createNewTransactionType(name: string, paymentDirection: string, classification: string, isTaxable: boolean, subClassification?: string): ng.IPromise<FinancialPlanning.Common.Transactions.ITransactionType>;
        updateTransactionType(transactionTypeId: string, name?: string, classification?: string, subClassification?: string): ng.IPromise<FinancialPlanning.Common.Transactions.ITransactionType>;
    }
}
declare module FinancialPlanning {
    interface ILoginService {
        login(username: string, password: string): ng.IPromise<any>;
        getJWT(): string;
        checkLoginStatus(): ng.IPromise<boolean>;
        getUserSummary(): ng.IPromise<FinancialPlanning.Common.Users.IUserSummary>;
        createUser(username: string, password: string, balance?: number, preferredName?: string, lowLimitWarning?: number): ng.IPromise<any>;
        updateUser(preferredName?: string, lowLimitWarning?: number, password?: string): ng.IPromise<any>;
        getUserDetails(): ng.IPromise<any>;
        getBalanceSummary(startDate: Date, endDate: Date): ng.IPromise<Array<FinancialPlanning.Common.Users.IBalanceSummary>>;
        getBalanceForecast(): ng.IPromise<Array<FinancialPlanning.Common.Users.IBalanceSummary>>;
        deleteUser(): ng.IPromise<any>;
    }
}
declare module FinancialPlanning {
    interface ITransactionService {
        getTransactionInstances(startDate?: Date, endDate?: Date): ng.IPromise<Array<FinancialPlanning.Common.Transactions.ITransactionInstance>>;
        getRecurringTransactionInstances(startDate?: Date, endDate?: Date): ng.IPromise<Array<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>>;
        getIncomingTotals(): ng.IPromise<Array<FinancialPlanning.Common.Transactions.IMonthTotal>>;
        getOutgoingTotals(): ng.IPromise<Array<FinancialPlanning.Common.Transactions.IMonthTotal>>;
        getTransactionSummaries(startDate?: Date, endDate?: Date): ng.IPromise<Array<FinancialPlanning.Common.Transactions.ITransactionSummary>>;
        createNewTransactionInstance(transactionTypeId: string, date: Date, adjustment: number): ng.IPromise<FinancialPlanning.Common.Transactions.ITransactionInstance>;
        createNewRecurringTransactionInstance(transactionTypeId: string, startDate: Date, adjustment: number): ng.IPromise<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>;
        cancelRecurringTransaction(transactionInstanceId: string): ng.IPromise<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>;
        getTransactionTypes(): ng.IPromise<Array<FinancialPlanning.Common.Transactions.ITransactionType>>;
        createNewTransactionType(name: string, paymentDirection: string, classification: string, isTaxable: boolean, subClassification?: string): ng.IPromise<FinancialPlanning.Common.Transactions.ITransactionType>;
        updateTransactionType(transactionTypeId: string, name?: string, classification?: string, subClassification?: string): ng.IPromise<FinancialPlanning.Common.Transactions.ITransactionType>;
    }
}
declare module FinancialPlanning {
}
