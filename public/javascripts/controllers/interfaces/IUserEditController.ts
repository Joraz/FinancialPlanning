module FinancialPlanning
{
    export interface IUserEditController
    {
        preferredName: string;
        lowLimitWarning: number;
        saveUserDetails(): void;
    }
}