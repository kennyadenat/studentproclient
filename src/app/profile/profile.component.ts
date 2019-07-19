import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.setProfileform();
  }

  get f() {
    return this.profileForm.controls;
  }

  setProfileform() {
    this.profileForm = this.fb.group({
      userid: [null, Validators.required],
      role: [null, Validators.required],
      title: [null, Validators.required],
      identityid: [null, Validators.required],
      avatar: [null, Validators.required],
      fullname: [null, Validators.required],
      institution: [null, Validators.required],
      faculty: [null, Validators.required],
      department: [null, Validators.required],
      level: [null, Validators.required],
      phone: [null, Validators.required],
    });
  }

  updateProfile(formValue: NgForm) {
    console.log(formValue.value);
  }

}
