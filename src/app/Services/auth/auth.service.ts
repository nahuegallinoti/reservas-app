import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { ReservaService } from '../evento.service';
import { AuthData } from './auth-data.model';
import { UIService } from '../../Shared/ui.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isUserLoggedIn = false;

  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private uiService: UIService
  ) {}

  initAuthListener() {
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        this.isUserLoggedIn = true;
        this.authChange.next(true);
        this.router.navigate(['/calendarios']);
      } else {
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isUserLoggedIn = false;
      }
    });
  }

  // Not used
  registerUser(authData: AuthData) {
    this.angularFireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.angularFireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackBar(error.message, null, {
          duration: 3000,
        });
      });
  }

  logout() {
    this.angularFireAuth.signOut();
  }

  isAuthenticated() {
    return this.isUserLoggedIn;
  }
}
