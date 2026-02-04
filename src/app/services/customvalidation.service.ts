import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CustomvalidationService {
  PatternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }

      // Regular Expression for Minimum 6 characters, 1 Uppercase, 1 lowercase, 1 number, and 1 non - alphanumeric symbol
      // 10/09/2020 DMB AMS-133  Changed how regex was declared.  Using new RegExp('') does not seem to work so that declaration was changed.
      // Javascript interpets characters in between forward slashes as a regular expression, so that was used as the declaration
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])(?=.*[!@#$%&`~\*\(\)\=\^\_\+\-;:\'\",.\/?\\|]).{6,}$/;

      const valid = regex.test(control.value);

      return valid ? null : { invalidPassword: true };
    };
  }

  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors.passwordMismatch
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }
}
