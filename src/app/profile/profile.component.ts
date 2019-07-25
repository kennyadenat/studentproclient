import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { Institution, } from '../../models/institution.model';
import { Department } from '../../models/department.model';
import { Faculty } from '../../models/faculty.model';
import { Level } from '../../models/level.model';
import * as FuzzySearch from 'fuzzy-search';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  @ViewChild('inst') inst;
  @ViewChild('fac') fac;
  @ViewChild('dept') dept;
  @ViewChild('lev') lev;

  currentUser: any;
  profileForm: FormGroup;
  respData: any;
  resp: any;
  institutionKeyword = 'institution';
  facultyKeyword = 'faculty';
  departmentKeyword = 'department';
  levelKeyword = 'level';

  private institutionContext: Institution[];
  private facultyContext: Faculty[];
  private departmentContext: Department[];
  private levelContext: Level[];

  private institutionContexts: Institution[];
  private facultyContexts: Faculty[];
  private departmentContexts: Department[];
  private levelContexts: Level[];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService
  ) {
    this.currentUser = this.authService.currentUserValue;
    this.institutionKeyword = 'institution';
  }

  ngOnInit() {
    this.setProfileform();
    this.getProfileOption();
    this.getProfile(this.currentUser._id);
  }

  get f() {
    return this.profileForm.controls;
  }

  getProfileOption() {
    this.profileService.getProfileOption()
      .valueChanges
      .subscribe(res => {
        this.respData = res.data;
        this.institutionContext = this.respData.institutions;
        this.facultyContext = this.respData.facultys;
        this.departmentContext = this.respData.departments;
        this.levelContext = this.respData.levels;
      });
  }

  getProfile(params) {
    this.profileService.getOneProfile(params)
      .subscribe(res => {
        this.resp = res.data;
        console.log(this.resp.profile);
        this.updateProfileForm(this.resp.profile);
      });
  }

  updateProfileForm(params) {
    this.profileForm.patchValue({
      _id: params._id,
      userid: params.userid,
      email: params.email,
      role: params.role,
      title: params.title,
      identityid: params.identityid,
      avatar: params.avatar,
      fullname: params.fullname,
      institution: params.institution,
      faculty: params.faculty,
      department: params.department,
      level: params.level,
      phone: params.phone,
    });
  }

  setProfileform() {
    this.profileForm = this.fb.group({
      _id: [null, Validators.required],
      userid: [null, Validators.required],
      email: [null, Validators.required],
      role: [null],
      title: [null],
      identityid: [null],
      avatar: [null, Validators.required],
      fullname: [null, Validators.required],
      institution: [null],
      faculty: [null],
      department: [null],
      level: [null],
      phone: [null],
    });
  }

  updateProfile(formValue: NgForm) {
    this.profileForm.patchValue({
      institution: this.inst.query,
      faculty: this.fac.query,
      department: this.dept.query,
      level: this.lev.query
    });
    this.profileService.updateProfile(formValue.value)
      .subscribe(res => {

      });
  }

  selectEventInstitution(item) {
    this.profileForm.patchValue({
      institution: item.institution
    });
  }

  selectEventFaculty(item) {
    this.profileForm.patchValue({
      faculty: item.faculty
    });
  }

  selectEventDepartment(item) {
    this.profileForm.patchValue({
      department: item.department
    });
  }

  selectEventLevel(item) {
    this.profileForm.patchValue({
      level: item.level
    });
  }

  onChangeSearchInstitution(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    const searcher = new FuzzySearch(this.institutionContext, ['institution'], {
      caseSensitive: true,
    });
    const result = searcher.search(val);
    this.institutionContexts = [];
    this.institutionContexts = result;
  }

  onChangeSearchFaculty(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    const searcherFac = new FuzzySearch(this.facultyContext, ['faculty'], {
      caseSensitive: true,
    });
    const resultFac = searcherFac.search(val);
    this.facultyContexts = [];
    this.facultyContexts = resultFac;
  }

  onChangeSearchDepartment(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    const searcher = new FuzzySearch(this.departmentContext, ['department'], {
      caseSensitive: true,
    });
    const result = searcher.search(val);
    this.departmentContexts = [];
    this.departmentContexts = result;
  }

  onChangeSearchLevel(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    const searcher = new FuzzySearch(this.levelContext, ['level'], {
      caseSensitive: true,
    });
    const result = searcher.search(val);
    this.levelContexts = [];
    this.levelContexts = result;
  }

  clearedInst(e) {
    this.institutionContexts = [];
  }

  clearedFac(e) {
    this.facultyContexts = [];
  }

  clearedDept(e) {
    this.departmentContexts = [];
  }

  clearedLev(e) {
    this.levelContexts = [];
  }

  addSearchInstitution(value: string) {
    this.profileForm.patchValue({
      institution: value
    });
    this.inst.notFound = false;
  }

  addSearchFaculty(value: string) {
    this.profileForm.patchValue({
      faculty: value
    });
    this.fac.notFound = false;
  }

  addSearchDepartment(value: string) {
    this.profileForm.patchValue({
      department: value
    });
    this.dept.notFound = false;
  }

  addSearchLevel(value: string) {
    this.profileForm.patchValue({
      level: value
    });
    this.lev.notFound = false;
  }

}
