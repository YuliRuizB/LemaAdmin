
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { NzNotificationService } from 'ng-zorro-antd';
import { Observable, of } from 'rxjs';
import { switchMap, take, map, tap } from 'rxjs/operators';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';  // Import MatSnackBar
export interface User {
    uid?: string;
    email?: string;
    displayName?: string;
    name?: string;
    apellidoMaterno?: string;
    apellidoPaterno?: string;
    photoURL?: string;
    calle?: string;
    claveCliente?: string;
    codigoPostal?: string;
    colonia?: string;
    estado?: string;
    telefono?: string;
    emailVerified: boolean;
    fechaNacimiento?: string;
    numero?: string;
    roles: string[];
    rolId?: string;
    active: boolean;
  }

  export enum Role {
    user = 'usuario',
    alumno = 'alumno',   
    admin = 'admin'
  } 

  
@Injectable({ providedIn: 'root' })

export class AuthenticationService {

user: Observable<User | null>;
role: Role | undefined; 

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private ngZone: NgZone,
    private snackBar: MatSnackBar,
  ) {
   
    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            const data = this.afs.doc<User>(`users/${user.uid}`);
            return data.valueChanges();
          } else {
            localStorage.setItem('user', JSON.stringify(null)); // Store null as a string
            return of(null);
          }
        }),
        map(user => user || null)
      );
    }

  getUser() {
    return this.user;
  }

  // Sign in with email/password
  signIn(email: any, password:any, claveCliente:string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result:any) => {
      
        this.ngZone.run(() => {
          if (!result.user.emailVerified) {
            this.notifyUser(
              '¡Oops!, su cuenta no ha sido verificada , Para continuar es necesario verificar su cuenta de correo electrónico.'
              , 'warning'
            );
            //this.router.navigate(['auth/please-verify-email']);
          } else {        
            console.log("resultbef getacceslevel");   
            this.getAccessLevel(result.user.uid, claveCliente);
          }
        });
        // if (result.user) { this.updateUserData(result.user) };
      }).catch((error) => {
        this.notifyUser(error.message,"error");
      });
  }

    async getAccessLevel(userId: string, claveCliente: string) {
        const userRef$ = await this.afs.collection('users').doc(userId);
        userRef$.snapshotChanges().pipe(
            take(1),
            map((a) => {
                const id = a.payload.id;
                const data = a.payload.data() as any;
                return { id: id, ...data }
            })
        ).subscribe((user: any) => {
            if (claveCliente == user.claveCliente) {
                const hasRoleAccess = _.includes(['admin', 'user'], user.roles[0]);
                if (!hasRoleAccess) {
                    this.notifyUser(                       
                        'Si esto es un error, por favor contacte al administrador del sitio.', "info"
                    );
                    this.signOut();
                } else {
                    //this.router.navigate([`/dashboard/${user.roles[0]}`])
                   // console.log(user);
                   this.router.navigate(['/usuarios']);
                }
            } else {  
                this.notifyUser(                    
                    '¡La cuenta a la que se esta tratando de acceder no es la correcta, favor de validar. Si esto es un error, por favor contacte al administrador del sitio.',
                    "warning"
                );
                this.signOut();
            }
        })
    }

 /*  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) { return false; }
    for (const role of allowedRoles) {
      if ( user.roles[role] ) {
        return true;
      }
    }
    return false;
  } */

  // Sign up with email/password
  signUp(form: any) {
    const email = form.email;
    const password = form.password;
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.sendVerificationMail();

        this.setUserData(result.user, form);
      }).catch((error) => {
        this.notifyUser(error,"error");
      });
  }

  // Send email verfificaiton when new user sign up
  sendVerificationMail() {
    const currentUser = this.afAuth.auth.currentUser;
    if (currentUser) {
      console.log("sendverificationMail)");
      return currentUser.sendEmailVerification()
        .then(() => {
        //  this.router.navigate(['authentication/verify-email']);
          this.notifyUser( 'El correo ha sido enviado',"info");
        }).catch((error) => {        
          this.notifyUser( 'Error de verificación de correo',"error");
        });
    } else {
      // Handle the case where currentUser is null
      console.error("Current user is null");
      // You might want to notify the user or take appropriate action.
      return Promise.reject("Current user is null");
    }
  }
  // Reset Forggot password
  forgotPassword(passwordResetEmai: any) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmai)
      .then(() => {
        // tslint:disable-next-line: max-line-length
        this.notifyUser('Se ha enviado un correo electrónico a su cuenta con la información necesaria para recuperar su contraseña.', "info");
      }).catch((error) => {
        this.notifyUser( '¡Oops!, algo salió mal ...', 'error');
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    // const user = JSON.parse(localStorage.getItem('user'));
    // return (user !== null && user.emailVerified !== false) ? true : false;
    // return (user !== null) ? true : false;
    return (!!this.user);
  }

  // Sign in with Google
  googleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider : any) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.setUserData(result.user);
      }).catch((error) => {
        this.notifyUser(error, 'error');
      });
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user:any, form?:any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData = {
      uid: user.uid,
      email: user.email,
      phoneNumber: form && form.phoneNumber ? form.phoneNumber : null,
      displayName: form.firstName + ' ' + form.lastName,//user.displayName ? user.displayName : form && form.firstName ? form.lastName : null,
      studentId: form && form.studentId ? form.studentId : null,
      photoURL: user.photoURL,      
      emailVerified: user.emailVerified,
      name: form.firstName,
      firstName: form.firstName,
      lastName: form.lastName,
      customerName: form.customerName,
      customerId: form.customerId,
      round: form.round,      
      status:form.status,
      roundTrip: form.roundTrip,
      turno: form.turno,
      defaultRouteName: form.defaultRouteName,
      defaultRoute: form.defaultRoute,
      defaultRound: form.defaultRound
    };
    return userRef.set(userData, {
      merge: true
    }).then( (result) => {
      this.updateUserProfile(form);
    })
    .catch( err => console.log('err: ', err));
  }

  getUserFromDatabase(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    // tslint:disable-next-line: no-shadowed-variable
    userRef.snapshotChanges().subscribe(user => {
      return user.payload.data();
    });
  }

  updateUserData(user : any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData = {
      emailVerified: user.emailVerified
    };
    // this.updateRolesAndPermissions(user);
    return userRef.set(userData, {
      merge: true
    })
    .then( response => console.log('ok', response))
    .catch( err => console.log('err: ', err));
  }

  updateUserProfile(form: any) {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      currentUser.updateProfile({
        displayName: form && form.fullName ? form.fullName : null,
        photoURL: 'https://example.com/jane-q-user/profile.jpg',
      }).then(function () {
        console.log('Update successful');
      }).catch(function (error) {
        console.log('An error happened:', error);
      });
    } else {
      console.log('Current user is null. Unable to update profile.');
    }
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: any) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
      });
  }

  signOut() {
   
    this.afAuth.auth.signOut().then(() => {   
      this.router.navigate(['/login']);
    });
  }

  private showNotification(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
  // Example usage in the code
  private notifyUser(message: string, type: 'info' | 'error' | 'warning') {
    this.showNotification(message, type);
  }

}