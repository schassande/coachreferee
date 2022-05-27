import * as m      from '../mailer';

m.sendMail({
    from: 'CoachReferee <no-reply@coachreferee.com>',
    cc: 'CoachReferee <coachreferee@gmail.com>',
    replyTo: 'CoachReferee <coachreferee@gmail.com>',
    to: 'Tester email <coachreferee@yopmail.com>',
    subject: 'Test ' + new Date(),
    html: `Hi Seb,<br> It is a test.<br>Best regard<br>Coach Referee App`,
    attachments: [{   
        filename: 'test-email.ts',
        contentType: 'text',
        content: m.fileToBase64(`${__dirname}/test-email.js`)
        },
        {   
            filename: 'test.pdf',
            contentType: 'application/pdf',
            content: m.fileToBase64(`${__dirname}/../../test/test.pdf`)
        }]
}).then(() => console.log('test ok')).catch(err => console.error(err));
