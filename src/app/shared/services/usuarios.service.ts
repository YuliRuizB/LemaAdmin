import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';


@Injectable({
    providedIn: 'root'
  })

  export class UsersService {
   
    constructor(  private afs: AngularFirestore) { 

    }

    getClientInfo(claveCliente:string){     
      return this.afs.collection('customers', (ref) => 
      ref
      .where('claveCliente', '==', claveCliente)
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data() as any;
          return { id, ...data }
        }))
      )
    }
    getUserInfo(claveCliente:string, limit?: number){    
      return this.afs.collection('users', (ref) => 
      ref
      .where('claveCliente', '==', claveCliente)  
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data() as any;
          return { id, ...data }
        }))
      )
    }
    getAlumnoInfo(userId:string){    
      return this.afs.collection('students', (ref) => 
      ref
      .where('userId', '==', userId)  
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data() as any;
          return { id, ...data }
        }))
      )
    }

    getUserInfoByID(uid:string, limit?: number){    
      return this.afs.collection('users', (ref) => 
      ref
      .where('uid', '==', uid)  
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data() as any;
          return { id, ...data }
        }))
      )
    }
  
    updateUserInfoByID(uid: string, url: string) {
      this.afs.collection('users', (ref) =>
        ref
          .where('uid', '==', uid)
      ).get().toPromise().then((querySnapshot) => {
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            // Update the 'photoUrl' field in the Firestore document
            this.afs.collection('users').doc(doc.id).update({
              photoUrl: url
            });
            console.log("UpdateCorrect");
          });
        } else {
          console.error('Query snapshot is undefined.');
        }
      }).catch((error) => {
        console.error('Error updating user info:', error);
      });
    }
    


    createUser(newUser: any) {
      const newId = this.afs.createId();
      newUser.uid = newId;   
      const user = this.afs.collection('users').doc(newId);
      return user.set(newUser).then(() => {
        return newId;
      });
    }
  
}