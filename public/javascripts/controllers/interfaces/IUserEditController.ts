module FinancialPlanning
{
    /**
     * Describes the properties of the user edit controller
     */
    export interface IUserEditController
    {
        /**
         * The entered preferred name
         */
        preferredName: string;
        /**
         * The entered low limit warning
         */
        lowLimitWarning: number;
        /**
         * The entered password
         */
        password: string;
    }
}