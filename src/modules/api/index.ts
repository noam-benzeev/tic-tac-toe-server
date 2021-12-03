import express from "express";

export class Api {
    static init(app: express.Application): void {
        app.get('/health', Api.healthCheck);
    }

    private static healthCheck(req: any, res: any):void {
        res.json({ message: 'Tic Tak Toe server is UP' });
    }
}