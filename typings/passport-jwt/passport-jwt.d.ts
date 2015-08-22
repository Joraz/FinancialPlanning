// Type definitions for passport-jwt 1.1.0
// Project: https://github.com/themikenicholson/passport-jwt
// Definitions by: Daniel Young <https://github.com/Joraz>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../passport/passport.d.ts"/>

declare module 'passport-jwt'
{
    import passport = require('passport');
    import express = require('express');

    interface IJwtStrategyOptions
    {
        secretOrKey: string;
        issuer?: string;
        audience?: string;
        tokenBodyField?: string;
        tokenQueryParameterName?: string;
        authScheme?: string;
        passReqToCallback?: boolean;
    }

    interface IJwtVerifyFunction
    {
        (jwt_payload: any, done: (error: any, user?: any, info?: any) => void): void;
    }

    class Strategy implements passport.Strategy
    {
        constructor(options: IJwtStrategyOptions, verify: IJwtVerifyFunction);

        name: string;
        authenticate: (req: express.Request, options?: Object) => void;
    }
}