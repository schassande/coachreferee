import { onRequest, Request } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
// const { defineInt, defineString } = require('firebase-functions/params');

import * as auth                      from "firebase-admin/auth";
import * as admin                      from "firebase-admin";
import * as cors from 'cors'
// const cors = require('cors')({origin: true});
import * as sendCoachingLib            from './send-coaching';
import * as sendAssessmentLib          from './send-assessment';
import * as sendAccountNotValidatedLib from './send-account-not-validated'
import * as sendAccountValidatedLib    from './send-account-validated'
import * as sendInvitationLib          from './send-invitation';
import * as sendNewAccountToAdminLib   from './send-new-account-to-admin';
import * as sendNewAccountToUserLib    from './send-new-account-to-user';
import * as sendValidationRequiredLib  from './send-validation-required';
import * as newCompetitionEventLib  from './new-competition-event';
import { Competition } from './model/competition';
import { collectionCompetition } from './common';
import * as refereesApi from "./api/referees";
import * as competitionsApi from "./api/competitions";
import * as coachingsApi from "./api/coachings";
import * as apiKey   from './api/apikey';
import * as usersApi   from './api/users';
import * as express from "express";

admin.initializeApp();
const corsTrue = cors.default({origin: true});


const firestore = admin.firestore();

/*
const privateKey = defineString('PRIVATE_KEY').replace(/\\n/g, '\n');
const projectId = defineString('PROJECT_ID');
const clientEmail = defineString('CLIENT_EMAIL');

admin.initializeApp({ 
    ...firebase,
    credential: admin.credential.cert({
      privateKey, //: config.private.key.replace(/\\n/g, '\n'),
      projectId, //: config.project.id,
      clientEmail //: config.client.email
    })
});
*/
export interface Context {
    db: admin.firestore.Firestore,
    gmailEmail: string
}
const ctx: Context = { 
    db: firestore, 
    gmailEmail : 'coachreferee@gmail.com', 
};

// ===================================================================
// Triggered functions
// On competition created from the database
exports.newCompetitionEvent = onDocumentCreated(collectionCompetition + '/{cid}', async (snap) => {
     await newCompetitionEventLib.func(snap.data?.data() as Competition, ctx);
});
// ===================================================================

// ===================================================================
// Functions exposed over HTTPS
export const sendCoaching = onRequest((request:Request, response: express.Response) => 
    requestWithCorsAndId(request, response, sendCoachingLib.func));
export const sendAssessment = onRequest((request:Request, response: express.Response) => 
    requestWithCorsAndId(request, response, sendAssessmentLib.func));
export const sendAccountNotValidated = onRequest((request:Request, response: express.Response) => 
    requestWithCorsAndId(request, response, sendAccountNotValidatedLib.func));
export const sendAccountValidated = onRequest((request:Request, response: express.Response) => 
    requestWithCorsAndId(request, response, sendAccountValidatedLib.func));
export const sendInvitation = onRequest((request:Request, response: express.Response) => 
    requestWithCorsAndId(request, response, sendInvitationLib.func));
export const sendNewAccountToAdmin = onRequest((request:Request, response: express.Response) => 
    requestWithCorsAndId(request, response, sendNewAccountToAdminLib.func));
export const sendNewAccountToUser = onRequest((request:Request, response: express.Response) => 
    requestWithCorsAndId(request, response, sendNewAccountToUserLib.func));
export const sendValidationRequired = onRequest((request:Request, response: express.Response) => 
    requestWithCorsAndId(request, response, sendValidationRequiredLib.func));

export async function requestWithCorsAndId(request:Request, response: express.Response, coreFunction:(request:Request, response: express.Response, ctx: Context) =>Promise<any>): Promise<any> {
    console.log('Incoming request=' + request.method 
        + ', headers=' + JSON.stringify(request.headers) 
        + ', body=' + JSON.stringify(request.body));

    corsTrue(request, response, () => {
        //get token
        const tokenStr = request.get('Authorization');
        if(!tokenStr) {
            throw new Error('Token required');
        }
        const tokenId = tokenStr.split('Bearer ')[1];
        //Verify token
        auth.getAuth().verifyIdToken(tokenId)
            .then((decoded: admin.auth.DecodedIdToken) => {
                // log console.log('decoded: ' + decoded);
                return coreFunction(request, response, ctx)
                    .catch((err: any) => {
                        console.log(err);
                        response.status(500).send({ error: err});
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    });
}

const app = express.default()
app.disable("x-powered-by");
// Any requests to /api/users, /api/referees, /api/competitions, /api/coachings, /api/apikey
app.use(corsTrue)
app.use("/users", usersApi.usersRouter);
app.use("/referees", refereesApi.refereesRouter);
app.use("/competitions", competitionsApi.competitionsRouter);
app.use("/coachings", coachingsApi.coachingsRouter);
app.use("/apikey", apiKey.apiKeyRouter);
export const api = onRequest(app);
// ===================================================================


// ===================================================================
// Scheduled functions
// exports.voteAndUpgradeReminder = func.pubsub.schedule('4 00 * * 1')
//    .timeZone('Europe/London')
//    .onRun(async (context) => {
//        console.log('voteAndUpgradeReminder BEGIN ' + context.timestamp);
//        await voteAndUpgradeReminderLib.func(ctx);
//        console.log('voteAndUpgradeReminder END ' + context.timestamp);
//    });
// ===================================================================

