import morgan from 'morgan';

morgan.token('colorMethod', (req) => {
    const method = req.method;
    if (method === 'GET') {
        return `\x1b[32m${method}\x1b[0m`;
    } else if (method === 'POST') {
        return `\x1b[34m${method}\x1b[0m`;
    } else if (method === 'PUT') {
        return `\x1b[33m${method}\x1b[0m`;
    } else if (method === 'DELETE') {
        return `\x1b[31m${method}\x1b[0m`;
    }
});

morgan.token('colorStatus', (req, res) => {
    const status = res.statusCode;
    if (status >= 200 && status < 300) {
        return `\x1b[32m${status}\x1b[0m`;
    } else if (status >= 400 && status < 500) {
        return `\x1b[33m${status}\x1b[0m`;
    } else if (status >= 500) {
        return `\x1b[31m${status}\x1b[0m`;
    }
});

morgan.token('date', () => {
    return `\x1b[36m${new Date().toISOString()}\x1b[0m`;
});

const logger = morgan(':date :colorMethod :url :colorStatus :response-time ms - :res[content-length] bytes');
export default logger;
