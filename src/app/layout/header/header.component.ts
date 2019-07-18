import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  UserItem: any;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.UserItem = this.authService.currentUserValue;
  }

  ngOnInit() {

  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/signin']);
  }

}
