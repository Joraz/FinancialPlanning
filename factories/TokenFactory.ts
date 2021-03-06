/// <reference path="../typings/tsd.d.ts" />

import jwt = require("jsonwebtoken");

import ObjectUtilities = require("../utilities/ObjectUtilities");

/**
 * Contains methods for generating JSONWebTokens
 */
class TokenFactory
{
    /**
     * Given a userId, generate a new JSONWebToken with an expiry of 30 minutes
     * @param userId
     * @returns {string}
     */
    public static generateJWT(userId: string): string
    {
        if (!ObjectUtilities.isDefined(userId, true))
        {
            throw new Error("No 'userId' parameter provided in TokenFactory::generateJWT().");
        }

        return jwt.sign(
            {
                _id: userId
            }, '3CF5434AE17036B3F0D32F67AAF9F875F35E0498F1D78F335625BA19E5C38592',
            {
                expiresInMinutes: 30
            });
    }
}

export = TokenFactory;