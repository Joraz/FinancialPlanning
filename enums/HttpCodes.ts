const enum HttpCodes
{
    /**
     * Success codes
     */
    ok = 200,

    created = 201,

    /**
     * Client error codes
     */
    badRequest = 400,

    /**
     * Server error codes
     */
    internalServerError = 500
}

export = HttpCodes;