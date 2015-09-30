module FinancialPlanning
{
    /**
     * Describes the properties of the user controller
     */
    export interface IUserController
    {
        /**
         * The entered username
         */
        username: string;
        /**
         * The entered password
         */
        password: string;
        /**
         * The entered balance
         */
        balance: number;
        /**
         * The entered preferred name
         */
        preferredName: string;
        /**
         * The entered low limit warning
         */
        lowLimitWarning: number;
    }
}