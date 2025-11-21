import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCOLQn_4RxXMvQhhlXBKjC1K-2pk-TvxIA",
  authDomain: "gestor-inscripciones-760ca.firebaseapp.com",
  projectId: "gestor-inscripciones-760ca",
  storageBucket: "gestor-inscripciones-760ca.firebasestorage.app",
  messagingSenderId: "860981727874",
  appId: "1:860981727874:web:34ca444b1ef0d306339a9b"
};

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular default providers (NO BORRAR)
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // Firebase providers (AGREGADOS)
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
