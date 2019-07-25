import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.actRoute.params.subscribe(res => {

    });
  }

  ngOnInit() {
  }

}
