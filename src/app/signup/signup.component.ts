import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators, AbstractControl } from '@angular/forms';
import { ValidateEmailType } from '../../Validators/email.validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  res: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    // window.location.href = 'http://localhost:4000/auth/google';
    //  this.router.navigate([]).then(result => { window.open('http://localhost:4000/auth/google'); });
    this.setSignupForm();

  }

  setSignupForm() {
    this.signupForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [ValidateEmailType, this.ValidateExistingEmail, Validators.required]],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
      policy: [false, Validators.required]
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  ValidateExistingEmail(control: AbstractControl) {
    const existingEmail = 'kennyadenat09@yahoo.com';
    return (control.value === existingEmail) ? { exist: true } : null;
  }

  signupGoogle() {
    this.router.navigate([]).then(result => { window.open('http://localhost:3000/auth/google'); });
  }

  signUp(formValue) {
    this.authService.userSignup(formValue.value)
      .subscribe(res => {
        this.setSignupForm();
        this.router.navigate(['/cofirmation']);
      }, (err) => {
        console.log(err.error);
      });
  }

}
