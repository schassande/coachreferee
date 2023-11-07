import * as admin   from 'firebase-admin';
import * as express from "express";
import * as tool   from './apikey';
import { Coaching } from '../model/coaching';

// This is the router which will be imported in our
// api hub (the index.ts which will be sent to Firebase Functions).
export let coachingsRouter = express.Router();

// GET /api/coachings/:id
coachingsRouter.get("/:id", async function getReferee(req: express.Request, res: express.Response) {
    if (!tool.ensureApiKey(req, res)) return;
  const firestore: admin.firestore.Firestore = admin.firestore();
  const id = req.params.id;
  const elem = (await firestore.collection('coaching').doc(id).get()).data();
  res.status(200).send(elem);
});

// Useful: Let's make sure we intercept un-matched routes and notify the client with a 404 status code
// GET /api/coachings?competitionId=xxx&gameId=xxx
coachingsRouter.get("*", async (req: express.Request, res: express.Response) => {
    if (!tool.ensureApiKey(req, res)) return;
    if (!req.query.competitionId) {
        res.status(401).send('Competition Id is a missing parameter.');    
    }
    const firestore: admin.firestore.Firestore = admin.firestore();
    let query:admin.firestore.Query<admin.firestore.DocumentData> = firestore.collection('coaching');
    query = query.where('competitionId', '==', req.query.competitionId);
    if (req.query.gameId) {
        query = query.where('importGameId', '==', req.query.gameId);
    }
    const elems = (await query.get()).docs.filter(e => e.exists).map(e => e.data());
	res.status(200).send(elems);
});


// POST /api/competitions
coachingsRouter.post("/", async (req: express.Request, res: express.Response) => {
    if (!tool.ensureApiKey(req, res)) return;
    const firestore: admin.firestore.Firestore = admin.firestore();
    const coaching: Coaching = req.body;
    //Rehydrate dates
    coaching.creationDate = new Date(coaching.creationDate);
    coaching.lastUpdate = new Date(coaching.lastUpdate);
    coaching.date = new Date(coaching.date);

    console.log('Ask for coaching creation: '+JSON.stringify(coaching));
    if (!coaching) {
        res.status(403).send("No data provided");
        return;
    }
    if (coaching.dataStatus === 'NEW') {
        console.log('NEW');
        try {
            console.log('Store the coaching once time without the id');
            // Store the competition once time without the id
            const doc  = await firestore.collection('coaching').add(coaching);
            // get the id from the firestore doc
            coaching.id = doc.id;
            coaching.dataStatus = 'CLEAN';
            console.log('get the id from the firestore doc: '+JSON.stringify(coaching));
            // store again the document containing the id.
            return doc.set(coaching).then(() => {
                console.log('200 coaching created, return body: '+JSON.stringify(coaching));
                res.status(200).send(coaching);
            });
        } catch (err) {
            console.log('Errore when creating: ' + err);
            res.status(500).send('Errore when creating: ' + err);
            return;
        }

    } else if (coaching.dataStatus === 'REMOVED') {
        console.log('REMOVED');
        return firestore.doc('coaching/'+coaching.id).delete()
            .then(() => res.status(200).send(coaching))
            .catch((err) => res.status(500).send('Errore when removing: ' + err));

    } else if (coaching.dataStatus === 'DIRTY') {
        console.log('DIRTY');
        coaching.dataStatus = 'CLEAN';
        return firestore.doc('coaching/'+coaching.id).set(coaching)
            .then(() => res.status(200).send(coaching))
            .catch((err) => res.status(500).send('Errore when saving: ' + err));
            
    } else if (coaching.dataStatus === 'CLEAN') {
        console.log('CLEAN');
        res.status(402).send(coaching);
    }
});
