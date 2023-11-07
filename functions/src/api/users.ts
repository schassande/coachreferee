import * as admin   from 'firebase-admin';
import * as express from "express";
import * as tool   from './apikey';

// This is the router which will be imported in our
// api hub (the index.ts which will be sent to Firebase Functions).
export let usersRouter = express.Router();

// GET /api/referees/:id
usersRouter.get("/:id", async function getReferee(req: express.Request, res: express.Response) {
    if (!tool.ensureApiKey(req, res)) return;
    const firestore: admin.firestore.Firestore = admin.firestore();
  const id = req.params.id;
  const elem = (await firestore.collection('user').doc(id).get()).data();
  res.status(200).send(elem);
});

// Useful: Let's make sure we intercept un-matched routes and notify the client with a 404 status code
// GET /api/referees?region=xxx&country=xxx&shortName=xxx&shortNames=xxx,xxx&email=xxx
usersRouter.get("*", async (req: express.Request, res: express.Response) => {
    if (!tool.ensureApiKey(req, res)) return;
    const firestore: admin.firestore.Firestore = admin.firestore();
    let query:admin.firestore.Query<admin.firestore.DocumentData> = firestore.collection('user')
        .where('accountStatus', '==', 'ACTIVE');
    if (req.query.region) {
        query = query.where('region', '==', req.query.region);
    }
    if (req.query.country) {
        query = query.where('country', '==', req.query.country);
    }
    if (req.query.shortName) {
        query = query.where('shortName', '==', req.query.shortName);
    }
    if (req.query.shortNames) {
        query = query.where('shortName', 'in', (''+req.query.shortNames).split(','));
    }
    if (req.query.email) {
        query = query.where('email', '==', req.query.email);
    }
    let elems = (await query.get()).docs.filter(e => e.exists).map(e => e.data());
    elems = elems.filter((elem) => elem.applications.filter(
        (ar:any) => ar.name === 'RefereeCoach' && ar.role === 'REFEREE_COACH').length > 0);
	res.status(200).send(elems);
});