import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SigninService } from '../../../views/sign-in/sign-in.service';

@Component({
  selector: 'app-regiform',
  templateUrl: './regiform.component.html',
  styleUrls: ['./regiform.component.scss']
})
export class RegiformComponent implements OnInit {
  @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = 'https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png';
  editFile: boolean = true;
  removeUpload: boolean = false;
  displayStyle:string;
  RoleID="";
  Registered="";
  registrationForm = this.fb.group({
    file: [null,[Validators.required]],
    address:['',[Validators.required]],
    about:['',[Validators.required]],
    description:['',[Validators.required]],
    website:['',[Validators.required]],
    api:['',[Validators.required]],
    vertical:['',[Validators.required]],
    person:['',[Validators.required]]
  })
  constructor(
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private toastr:ToastrService,
    private router:Router,
    private signInService :SigninService) { }


  ngOnInit(): void {
    this.RoleID=this.signInService.decryptData(sessionStorage.getItem("RoleID"));
    this.Registered=this.signInService.decryptData(sessionStorage.getItem("Registered"));
    if(this.RoleID == "3"  && this.Registered=="0"){
    this.displayStyle="block"
    }
  }
  register(){
    this.displayStyle="none";
  }
  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.registrationForm.patchValue({
          file: reader.result
        });
        this.editFile = false;
        this.removeUpload = true;
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }

  // Function to remove uploaded file
  removeUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.imageUrl = 'https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png';
    this.editFile = true;
    this.removeUpload = false;
    this.registrationForm.patchValue({
      file: [null]
    });
  }

  // Submit Registration Form
  onSubmit() {

    if(!this.registrationForm.valid) {

      this.toastr.warning("Please fill all the required");
      return false;
    } else {
      // console.log(this.registrationForm.value)
      sessionStorage.setItem("Registered", "1")
      this.displayStyle="none";
      window.location.reload();
      this.router.navigate(["/flow"])
    }
  }

}
