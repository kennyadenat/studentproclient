import { AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// regex function to check if its a valid email address
export function ValidateEmailType(control: AbstractControl) {
  const type = control.get('fullname');
  // tslint:disable-next-line:max-line-length
  const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (EMAIL_REGEXP.test(String(control.value).toLowerCase())) {
    return null;
  } else {
    return { valid: false };
  }
  // return EMAIL_REGEXP.test(String(control.value).toLowerCase()) ? null : { valid: false };
}

// function to check if start date isnt less than end date

