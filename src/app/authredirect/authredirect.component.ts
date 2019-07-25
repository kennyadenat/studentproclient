import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-authredirect',
  templateUrl: './authredirect.component.html',
  styleUrls: ['./authredirect.component.css']
})
export class AuthredirectComponent implements OnInit {

  resp: any;
  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    //  this.navID = this.actRoute.snapshot.params;
  }

  ngOnInit() {
    this.actRoute.params.subscribe(res => {
      this.authService.signWithGoogle(res)
        .subscribe(resp => {
          this.resp = resp;
          // if authentication is successful
          const redirect = this.authService.redirectUrl ? this.router.parseUrl(this.authService.redirectUrl) : '/dashboard';
          // Redirect the user
          this.router.navigateByUrl(redirect);
        }, (err) => {

        });
    });
  }

}
