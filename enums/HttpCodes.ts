const enum HttpCodes
{
    /**
     * Success codes
     */
    ok = 200,

    created = 201,

    accepted = 202,

    noContent = 204,

    /**
     * Client error codes
     */
    badRequest = 400,

    unauthorized = 401,

    forbidden = 403,

    notFound = 404,

    /**
     * Server error codes
     */
    internalServerError = 500,

    serviceUnavailable = 503
}

export = HttpCodes;