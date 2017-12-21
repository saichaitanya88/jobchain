import * as express from "express";

import { environment } from "../environment";

export class LocalApi {
    routes: RouteDefinition[];
}
export class RouteDefinition{
    method: string;
    endPoint: string;
    action: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
}