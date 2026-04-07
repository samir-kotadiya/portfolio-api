export class BaseService {

    badRequest(message: string) {
        throw {
            status: 400,
            message: message,
        };
    }

    notFound(message: string) {
        throw {
            status: 404,
            message: message,
        };
    }
};