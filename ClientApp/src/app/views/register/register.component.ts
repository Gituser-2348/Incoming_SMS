import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cibGmail } from '@coreui/icons';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { timezone } from './model';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  timezone=timezone
  title = 'newangular';
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(private formbuilder: FormBuilder, private service:RegisterService,private toastr:ToastrService) { }

  ngForm = this.formbuilder.group({
    email: ['', [Validators.email,Validators.required]],
    fullName: ['',Validators.required],
    password: ['',Validators.required],
    legalCompanyName: ['',Validators.required],
    facebookId: ['',Validators.required],
    timezone: [''],
    termsOne: [''],
    termsTwo: [''],
    phone:['',Validators.required]
  })

  save() {
    var termsOne = this.ngForm.value.termsOne
    var termsTwo = this.ngForm.value.termsTwo
    if (this.ngForm.valid) {
      if (termsOne == true && termsTwo == true) {
        this.toastr.success("Success");
        // console.log(this.ngForm.value);
        this.service.SendMail("FirstTime","ACP - Welcome",1,"arjunmc506@gmail.com",null,"merlin").subscribe(res=>{
          // console.log(res);
        })
      }
      else {
        this.toastr.warning("Accept Terms");
        return;
      }
    } else {
      this.toastr.warning("Invalid Form");
      return;
    }
  }
}
