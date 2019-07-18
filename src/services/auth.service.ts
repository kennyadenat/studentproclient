import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.prod';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserContext: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  respUser: any;
  constructor(
    private http: HttpClient) {
    const env = { environment };
    this.currentUserContext = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('User')));
    this.currentUser = this.currentUserContext.asObservable();
  }

  redirectUrl: string;

  public get currentUserValue(): User {
    return this.currentUserContext.value;
  }

  // Service for google authentication
  signWithGoogle() {
    const env = { environment };
    return this.http.get(`${env.environment.auth.dev}/google/`);
  }

  // service for user sign-in
  userSignin(params) {
    const env = { environment };
    return this.http.post(`${env.environment.auth.dev}/signin`, params)
      .pipe(map(user => {
        this.respUser = user;
        if (this.respUser && this.respUser.token) {
          localStorage.setItem('User', JSON.stringify(this.respUser));
          this.currentUserContext.next(this.respUser);
        }
        return user;
      }));
  }

  // service for user sign-up
  userSignup(params) {
    const env = { environment };
    return this.http.post(`${env.environment.auth.dev}/signup`, params);
  }

  logOut() {
    localStorage.removeItem('User');
    this.currentUserContext.next(null);
  }
}
