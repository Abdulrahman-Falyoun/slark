export const operationsCodes = {
    SUCCESS: 711,
    ALREADY_EXISTS: 732,
    UN_COMPLETE: 797,

    FAILED: 812,
    MISSING_DATA: 899,

    ACCESS_DENIED: 900,
    AUTHORIZATION_FAILED: 901,
    UNAVAILABLE_RESOURCE: 909,

    FILESYSTEM_ERROR: 1024,
    DATABASE_ERROR: 1025,

    /**
     *
     * @param opcode
     * @return {number}
     */
    getResponseCode: (opcode) => {
        // Success process
        if (opcode >= 700 && opcode < 800) return 200;
        // Missing or Failed process
        if (opcode >= 800 && opcode < 900) return 401;
        // Auth failed
        if (opcode >= 900 && opcode < 1000) return 409;
        // Internal server error
        if (opcode > 1000) return 500;

        return 200;
    },
};
