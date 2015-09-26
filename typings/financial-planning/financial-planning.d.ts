/// <reference path="../es6-promise/es6-promise.d.ts" />
/// <reference path="../mongodb/mongodb.d.ts" />

declare module FinancialPlanning
{
    module Server
    {
        module Security
        {
            interface IPasswordHash
            {
                hash: string;

                salt: string;
            }
        }

        module Users
        {
            interface IUser
            {
                /**
                 * The application uses the given username as the mongoDB _id.
                 * This will prevent multiple users being created with the same name
                 */
                _id: string;

                /**
                 * The bcrypt hash of the users password. No plaintext passwords stored!
                 */
                hash: string;

                /**
                 * The bcrypt salt of the users password
                 */
                salt: string;

                /**
                 * The users balance (can be positive or negative
                 */
                balance: number;

                /**
                 * Users preferences
                 */
                options: IUserOptions;
            }

            interface IUserOptions
            {
                /**
                 * Users can set a preferred name to be called by.
                 * Will default to the username if not provided
                 */
                preferredName?: string;

                /**
                 * Limit which will, when crossed, alert the user
                 */
                lowLimitWarning?: number;
            }
        }

        module Database
        {
            interface IDatabase
            {
                readObject(collectionName: string, match: any, fields: any): Promise<any>;

                readCollection(collectionName: string, match: any, fields: any): Promise<Array<any>>;

                writeObject(collectionName: string, data: any): Promise<any>;

                writeMultipleObjects(collectionName: string, data: Array<any>): Promise<any>;

                updateObject(collectionName: string, match: any, data: any): Promise<any>;

                deleteObject(collectionName: string, match: any): Promise<any>;

                deleteMultipleObjects(collectionName: string, match: any): Promise<any>;

                deleteCollection(collectionName: string): Promise<any>;

                close(): void;
            }

            interface IUserDal
            {
                createUser(user: Users.IUser): Promise<Users.IUser>;

                getUser(userId: string): Promise<Users.IUser>;

                deleteUser(userId: string): Promise<boolean>;

                updatePassword(userId: string, hash: Security.IPasswordHash): Promise<Users.IUser>;

                updatePreferredName(userId: string, preferredName: string): Promise<Users.IUser>;

                updateLimitWarning(userId: string, limitWarning: number): Promise<Users.IUser>;

                updateBalance(userId: string, balance: number): Promise<Users.IUser>;
            }

            interface ITransactionTypeDal
            {
                createTransactionType(transactionType: Common.Transactions.ITransactionType): Promise<Common.Transactions.ITransactionType>;

                getTransactionType(transactionTypeId: string, userId?: string): Promise<Common.Transactions.ITransactionType>;

                getAllTransactionTypesByUserId(userId: string): Promise<Array<Common.Transactions.ITransactionType>>;

                deleteTransactionType(transactionTypeId: string): Promise<boolean>;

                updateTransactionType(transactionTypeId: string, name?: string, classification?: string, subClassification?: string): Promise<Common.Transactions.ITransactionType>;

                checkTransactionTypeExists(transactionTypeId: string): Promise<boolean>;

                deleteAllTransactionTypesForUser(userId: string): Promise<boolean>;
            }

            interface ITransactionInstanceDal
            {
                createTransaction(transaction: Common.Transactions.ITransaction): Promise<Common.Transactions.ITransaction>;

                getTransaction(transactionId: string): Promise<Common.Transactions.ITransaction>;

                getAllTransactionsByUserId(userId: string): Promise<Array<Common.Transactions.ITransaction>>;

                getAllTransactionsByUserAndType(userId: string, transactionTypeId: string): Promise<Array<Common.Transactions.ITransaction>>;

                deleteAllTransactionsForUser(userId: string): Promise<boolean>;
            }
        }

        module Transactions
        {
            interface IAdjustmentSummary
            {
                /**
                 * YYYY-MM-DD format
                 */
                date: string;

                adjustment: number;
            }
        }
    }

    module Common
    {
        module Users
        {
            interface IUserSummary
            {
                /**
                 * Name to use client-side
                 */
                name: string;

                /**
                 * Users balance
                 */
                balance: number;

                limitWarning?: number;
            }

            interface IBalanceSummary
            {
                date: Date;

                balance: number;
            }

            interface IUserDetails
            {
                preferredName?: string;

                lowLimitWarning?: number;
            }
        }

        module Transactions
        {

            interface ITransactionType
            {
                _id?: any;

                name: string;

                paymentDirection: string;

                classification: string;

                subClassification?: string;

                isDefault: boolean;

                isTaxable: boolean;

                userId?: string;
            }

            interface ITransactionInstance
            {
                _id?: any;

                transactionTypeId: string;

                userId: string;

                startDate: Date;

                adjustment: number;

                transactions: Array<ITransaction>;
            }

            interface IRecurringTransactionInstance extends ITransactionInstance
            {
                isActive: boolean;
            }

            interface ITransaction
            {
                _id: any;

                processed: boolean;

                transactionDate: Date;

                processedDate?: Date;
            }

            interface ITransactionSummary
            {
                _id: any;

                classification: string;

                subClassification: string;

                name: string;

                transactionDate: Date;

                adjustment: number;
            }

            interface IMonthTotal
            {
                month: string;

                total: number;
            }
        }
    }
}