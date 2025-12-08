import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private firestore: Firestore) {}

  addCourse(course: any) {
    const ref = collection(this.firestore, 'cursos');
    return addDoc(ref, course);
  }

  getCourses(): Observable<any[]> {
    const ref = collection(this.firestore, 'cursos');
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }
}
