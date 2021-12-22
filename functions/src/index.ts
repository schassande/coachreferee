import * as func                       from 'firebase-functions';
import * as cors                       from  'cors';
import * as admin                      from 'firebase-admin';
import * as sendCoachingLib            from './send-coaching';
import * as sendAssessmentLib          from './send-assessment';
import * as sendAccountNotValidatedLib from './send-account-not-validated'
import * as sendAccountValidatedLib    from './send-account-validated'
import * as sendInvitationLib          from './send-invitation';
import * as sendNewAccountToAdminLib   from './send-new-account-to-admin';
import * as sendNewAccountToUserLib    from './send-new-account-to-user';
import * as computeRefereeUpgradeLib   from './compute-referee-upgrade';
import * as sendRefereeUpgradeLib      from './send-referee-upgrade';
import * as sendValidationRequiredLib  from './send-validation-required';
import * as sendRefereeUpgradeStatusLib  from './send-referee-upgrade-status';
import * as voteAndUpgradeReminderLib  from './vote-and-upgrade-reminder';
import * as newCompetitionEventLib  from './new-competition-event';
import { Competition } from './model/competition';
import { collectionCompetition } from './common';


admin.initializeApp(func.config().firebase);

const ctx = { 
    db : admin.firestore(), 
    gmailEmail : func.config().gmail.email, 
    gmailPassword : func.config().gmail.password
};
// ===================================================================
// Scheduled functions
exports.voteAndUpgradeReminder = func.pubsub.schedule('4 00 * * 1')
    .timeZone('Europe/London')
    .onRun(async (context) => {
        console.log('voteAndUpgradeReminder BEGIN ' + context.timestamp);
        await voteAndUpgradeReminderLib.func(ctx);
        console.log('voteAndUpgradeReminder END ' + context.timestamp);
    });

// ===================================================================
// Triggered functions

// On competition created from the database
exports.newCompetitionEvent = func.firestore.document(collectionCompetition + '/{cid}').onCreate(async (snap, context) => {
     await newCompetitionEventLib.func(snap.data() as Competition, context, ctx);
});

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
export const computeRefereeUpgrade = func.https.onRequest(
    (request, response) => requestWithCorsAndId(request, response, computeRefereeUpgradeLib.func));
export const sendRefereeUpgrade = func.https.onRequest(
    (request, response) => requestWithCorsAndId(request, response, sendRefereeUpgradeLib.func));
export const sendValidationRequired = func.https.onRequest(
    (request, response) => requestWithCorsAndId(request, response, sendValidationRequiredLib.func));
export const sendRefereeUpgradeStatus = func.https.onRequest(
    (request, response) => requestWithCorsAndId(request, response, sendRefereeUpgradeStatusLib.func));

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
                // console.log('decoded: ' + decoded);
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
