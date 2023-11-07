import * as admin   from 'firebase-admin';
import * as express from "express";
import { Competition } from '../model/competition';
import * as tool   from './apikey';

export let competitionsRouter = express.Router();

// GET /api/competitions/:id
competitionsRouter.get("/:id", async function getCompetition(req: express.Request, res: express.Response) {
    if (!tool.ensureApiKey(req, res)) return;
    const id = req.params.id;
    const firestore: admin.firestore.Firestore = admin.firestore();
    const elem = (await firestore.collection('competition').doc(id).get()).data();
    res.status(200).send(elem);
});

// GET /api/competitions?region=xxx&country=xxx&name=xxx
competitionsRouter.get("*", async (req: express.Request, res: express.Response) => {
    if (!tool.ensureApiKey(req, res)) return;
    const firestore: admin.firestore.Firestore = admin.firestore();
    let query:admin.firestore.Query<admin.firestore.DocumentData> = firestore.collection('competition');
    if (req.query.region) {
        console.log('Filter by region: '+req.query.region);
        query = query.where('region', '==', req.query.region);
    }
    if (req.query.country) {
        console.log('Filter by country: '+req.query.country);
        query = query.where('country', '==', req.query.country);
    }
    if (req.query.name) {
        console.log('Filter by name: '+req.query.name);
        query = query.where('name', '==', req.query.name);
    }
    const elems = (await query.get()).docs.filter(e => e.exists).map(e => e.data());
    console.log(elems.length+' competitions found.');
	res.status(200).send(elems);
});

// POST /api/competitions
competitionsRouter.post("/", async (req: express.Request, res: express.Response) => {
    if (!tool.ensureApiKey(req, res)) return;
    const firestore: admin.firestore.Firestore = admin.firestore();
    const competition: Competition = req.body;
    //Rehydrate dates
    competition.creationDate = new Date(competition.creationDate);
    competition.lastUpdate = new Date(competition.lastUpdate);
    competition.date = new Date(competition.date);
    competition.days = competition.days.map(day => new Date(day));
    competition.allocations.forEach(alloc => alloc.date = new Date(alloc.date));

    console.log('Ask for competition creation: '+JSON.stringify(competition));
    if (!competition) {
        res.status(403).send("No data provided");
        return;
    }
    if (competition.dataStatus === 'NEW') {
        console.log('NEW: check if a competition with the same name does not already exist');
        const existingCompetition = await getCompetitionByName(competition.name);
        if (existingCompetition) {
            console.log('A competition with the name "'+competition.name+'" already exist.');
            res.status(402).send('A competition with the name "'+competition.name+'" already exist.');
            return;
        }
        try {
            console.log('Store the competition once time without the id');
            // Store the competition once time without the id
            const doc  = await firestore.collection('competition').add(competition);
            // get the id from the firestore doc
            competition.id = doc.id;
            competition.dataStatus = 'CLEAN';
            console.log('get the id from the firestore doc: '+JSON.stringify(competition));
            // store again the document containing the id.
            return doc.set(competition).then(() => {
                console.log('200 competition created, return body: '+JSON.stringify(competition));
                res.status(200).send(competition);
            });
        } catch (err) {
            console.log('Errore when creating: ' + err);
            res.status(500).send('Errore when creating: ' + err);
            return;
        }

    } else if (competition.dataStatus === 'REMOVED') {
        console.log('REMOVED');
        return firestore.doc('competition/'+competition.id).delete()
            .then(() => res.status(200).send(competition))
            .catch((err) => res.status(500).send('Errore when removing: ' + err));

    } else if (competition.dataStatus === 'DIRTY') {
        console.log('DIRTY');
        competition.dataStatus = 'CLEAN';
        return firestore.doc('competition/'+competition.id).set(competition)
            .then(() => res.status(200).send(competition))
            .catch((err) => res.status(500).send('Errore when saving: ' + err));
            
    } else if (competition.dataStatus === 'CLEAN') {
        console.log('CLEAN');
        res.status(402).send(competition);
    }
});

// PRIVATE METHODS
async function getCompetitionByName(competitionName: string): Promise<Competition|undefined> {
    const firestore: admin.firestore.Firestore = admin.firestore();
    const elems = (await firestore.collection('competition').where('name', '==', competitionName).limit(1).get()).docs;
    if (elems && elems.length > 0 && elems[0].exists) {
        return elems[0].data() as Competition;
    } else {
        return undefined;
    }
}
