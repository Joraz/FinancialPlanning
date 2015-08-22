/// <reference path="../typings/tsd.d.ts" />

import IUser = require("../interfaces/customObjects/IUser");

import jwt = require("jsonwebtoken");

class TokenProvider
{
    public static generateJWT(user: IUser): string
    {
        if (!user || !user._id)
        {
            throw new Error("A valid IUser object must be provided to TokenProvider::generateJWT().")
        }

        return jwt.sign(
            {
                _id: user._id
            }, '3CF5434AE17036B3F0D32F67AAF9F875F35E0498F1D78F335625BA19E5C38592',
            {
                expiresInMinutes: 30
            });
    }
}

export = TokenProvider;