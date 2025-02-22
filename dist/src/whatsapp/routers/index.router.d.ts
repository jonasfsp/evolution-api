declare enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NOT_FOUND = 404,
    FORBIDDEN = 403,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    INTERNAL_SERVER_ERROR = 500
}
declare const router: import("express-serve-static-core").Router;
export { HttpStatus, router };
