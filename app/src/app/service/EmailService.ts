// import { EmailComposer } from '@ionic-native/email-composer';
import { Injectable } from '@angular/core';


@Injectable()
export class EmailService {

    constructor(
      // private emailComposer: EmailComposer
      ) {
    }

    public sendEmail(email) {
      // this.emailComposer.open(email).then(() => console.log('Email sent:' + JSON.stringify(email, null, 2)));
   }
}
