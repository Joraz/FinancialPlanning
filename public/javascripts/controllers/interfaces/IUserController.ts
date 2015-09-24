module FinancialPlanning
{
    export interface IUserController
    {
        username: string;
        password: string;
        balance: number;
        preferredName: string;
        lowLimitWarning: number;
        createUser(): void;
    }
}