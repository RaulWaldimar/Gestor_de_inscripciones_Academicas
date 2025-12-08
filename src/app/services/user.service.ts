import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  async createUser(uid: string, data: any) {
    return setDoc(doc(this.firestore, 'usuarios', uid), data);
  }

  async getUser(uid: string) {
    return (await getDoc(doc(this.firestore, 'usuarios', uid))).data();
  }
}