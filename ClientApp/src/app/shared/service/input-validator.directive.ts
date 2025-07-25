import { Directive, ElementRef, HostListener, Input } from "@angular/core";
import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  Validators,
} from "@angular/forms";

@Directive({
  selector: "[InputValidator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: InputValidatorDirective,
      multi: true,
    },
  ],
})
export class InputValidatorDirective implements Validator {
  @Input() categoy: string;

  constructor(private el: ElementRef) {}

  validate(control: AbstractControl): { [key: string]: any } {
    if (this.categoy == "notnull") {
      if (this.notnull(control.value)) {
        // console.log("Validate Event result: true");
        control.setErrors({ required: true });
        return Validators.email(control);
        // console.log("Validate  2 :", control);
      }
    }
  }


  @HostListener("keypress", ["$event"]) onKeyPress(event) {
    // console.log("Inside HostListener");
    // console.log("Inside HostListener elementRef : ", this.el);

    if(this.categoy == "number"){
      this.validateNumber(event)
    }
    if(this.categoy == "noInput"){
      this.preventTyping(event)
    }
    if(this.categoy == "phoneNumber"){
      this.validatePhoneNumber(event)
    }
    if(this.categoy == "multiple_phoneNumber"){
      this.validatePhone(event)
    }
  }

  validateEmail(input): boolean | number {
    const emailPattern = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    let isValid: boolean = false;
    // console.log("validateEmail Input", input);

    if (input) {
      input.split(",").forEach((mailid) => {
        let chkmailid = emailPattern.test(mailid);
        // console.log("chkmailid : ",chkmailid);

        if (chkmailid) {
          isValid = true;
        } else {
          isValid = false;
          return;
        }
      });
    } else {
      isValid = true;
    }
    // console.log ("retrun value isValid", isValid);
    return isValid;
  }

  validatePhone(event) {
    const e = <KeyboardEvent>event;
    const inputValue = this.el.nativeElement.value + e.key;
    // console.log(e.keyCode,"E")
    if (e.key === "Tab" || e.key === "TAB") {
      return;
    }
    if (
      [46, 8, 9, 27, 13, 110,44 ].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      // let it happen, don't do anything
      return;
    }
    if (
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].indexOf(e.key) === -1
    ) {
      e.preventDefault();
    }

    if (
      this.el.nativeElement.selectionStart != this.el.nativeElement.selectionEnd
    ) {
      // to replace selected numbers
      return;
    }

    // console.log("inputValue : ", inputValue);
    // console.log("inputValue this.max : ", this.max);
    // console.log("inputValue this.length : ", inputValue.length);
  }

  notnull(input) {
    if (input && input.trim().length == 0) {
      return true;
    }
    return false;
  }

  validateNumber(event){
    var reg = /^[0-9+-.]+$/;
    if (
      event.key.match(reg) ||
      event.keyCode == 8 ||
      event.keyCode == 37 ||
      event.keyCode == 38 ||
      event.keyCode == 39 ||
      event.keyCode == 40
    ) {
      return true;
    } else {
      event.preventDefault();
    }
  }
  validatePhoneNumber(event){
    var reg = /^[0-9+]+$/;
    if (
      event.key.match(reg) ||
      event.keyCode == 8 ||
      event.keyCode == 37 ||
      event.keyCode == 38 ||
      event.keyCode == 39 ||
      event.keyCode == 40
    ) {
      return true;
    } else {
      event.preventDefault();
    }
  }

  validateMultiplePhoneNumber(event){
    var reg = /^[0-9+]+$/;
    if (
      event.key.match(reg) ||
      event.keyCode == 8 ||
      event.keyCode == 37 ||
      event.keyCode == 38 ||
      event.keyCode == 39 ||
      event.keyCode == 40 ||
      event.keycode == 13
    ) {
      return true;
    } else {
      event.preventDefault();
    }
  }

  preventTyping(event){
    event.preventDefault();
  }
}
