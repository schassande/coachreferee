import * as func                       from 'firebase-functions';
import * as admin                      from "firebase-admin";
const cors = require('cors')({origin: true});
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
const express = require('express')

admin.initializeApp({ 
    ...func.config().firebase,
    credential: admin.credential.cert({
      privateKey: func.config().private.key.replace(/\\n/g, '\n'),
      projectId: func.config().project.id,
      clientEmail: func.config().client.email
    })
});

const ctx = { 
    db : admin.firestore(), 
    gmailEmail : 'coachreferee@gmail.com', 
    // gmailPassword : func.config().gmail.password
};

// ===================================================================
// Triggered functions
// On competition created from the database
exports.newCompetitionEvent = func.firestore.document(collectionCompetition + '/{cid}').onCreate(async (snap, context) => {
     await newCompetitionEventLib.func(snap.data() as Competition, context, ctx);
});
// ===================================================================

// ===================================================================
// Functions exposed over HTTPS
export const sendCoaching = func.https.onRequest(
    (request, response) => requestWithCorsAndId(request, response, sendCoachingLib.func));
export const sendAssessment = func.https.onRequest(
    (request, response) => requestWithCorsAndId(request, response, sendAssessmentLib.func));
export const sendAccountNotValidated = func.https.onRequest(
    (request, response) => requestWithCorsAndId(request, response, sendAccountNotValidatedLib.func));
export const sendAccountValidated = func.https.onRequest(
    (request, response) => requestWithCorsAndId(request, response, sendAccountValidatedLib.func));
export const sendInvitation = func.https.onRequest(
    (request, response) => requestWithCorsAndId(request, response, sendInvitationLib.func));
export const sendNewAccountToAdmin = func.https.onRequest(
    (request, response) => requestWithCorsAndId(request, response, sendNewAccountToAdminLib.func));
export const sendNewAccountToUser = func.https.onRequest(
    (request, response) => requestWithCorsAndId(request, response, sendNewAccountToUserLib.func));
export const sendValidationRequired = func.https.onRequest(
    (request, response) => requestWithCorsAndId(request, response, sendValidationRequiredLib.func));

export async function requestWithCorsAndId(request:any, response:any, coreFunction:any): Promise<any> {
    console.log('Incoming request=' + request.method 
        + ', headers=' + JSON.stringify(request.headers) 
        + ', body=' + JSON.stringify(request.body));
    const corsOptions: any = {
        origin: function (origin: string, callback: any) {
            callback(null, true);
            // ['*', 'https://app.coachreferee.com'],
        },
        optionsSuccessStatus: 200
    }
    cors.default(corsOptions)(request, response, () => {
        //get token
        const tokenStr = request.get('Authorization');
        if(!tokenStr) {
            throw new Error('Token required');
        }
        const tokenId = tokenStr.split('Bearer ')[1];
        //Verify token
        admin.auth().verifyIdToken(tokenId)
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

const app = express()
app.disable("x-powered-by");
// Any requests to /api/users, /api/referees, /api/competitions, /api/coachings, /api/apikey
app.use(cors)
app.use("/users", usersApi.usersRouter);
app.use("/referees", refereesApi.refereesRouter);
app.use("/competitions", competitionsApi.competitionsRouter);
app.use("/coachings", coachingsApi.coachingsRouter);
app.use("/apikey", apiKey.apiKeyRouter);
export const api = func.https.onRequest(app);
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

