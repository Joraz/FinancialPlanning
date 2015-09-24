module FinancialPlanning
{
    export interface ILoginController
    {
        username: string;
        password: string;
        login(): void;
        createNewUser(): void;
    }
}