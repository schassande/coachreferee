import * as express from "express";
import * as func    from 'firebase-functions';

export let apiKeyRouter = express.Router();

export function ensureApiKey(req: express.Request, res:express.Response): boolean {
    const expectedApiKey:string = func.config().private.ref_coach_api_key;
    console.log('expectedApiKey='+expectedApiKey+', req.headers.authorization='+req.headers.authorization);
    if (!expectedApiKey) {
        console.log('No expected API key');
        res.status(401).send();
        return false;
    }
    if (expectedApiKey !== req.headers.authorization) {
        console.log('Wrong provided API key');
        res.status(401).send();
        return false;
    }
    return true;
}

// GET /
apiKeyRouter.get("/", async function(req: express.Request, res: express.Response) {
    console.log('Test API KEY');
    if (ensureApiKey(req, res)) {
        console.log('Right provided API key');
        res.status(200).send();
    }
});