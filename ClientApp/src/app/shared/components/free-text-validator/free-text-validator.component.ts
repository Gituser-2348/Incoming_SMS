import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  HostListener,
  ViewChild,
  ElementRef,
  Renderer2,
  Directive,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { PropertyBindingService } from "../../../views/flow/propertybuilder/propertyBinding.service";
import { validation } from "./free-text-validator.modal";

@Component({
  selector: "app-free-text-validator",
  templateUrl: "./free-text-validator.component.html",
  styleUrls: ["./free-text-validator.component.scss"],
})
export class FreeTextValidatorComponent implements OnInit {
  @Output() childToParent = new EventEmitter<any>();

  @Input() style;
  @ViewChild("menu") menu: ElementRef;
  submitionFlag:boolean = true;
  criteriaFlag :boolean = true;
  display: any = "none";

  validationJson: validation;

  // @Input("bind-validation")
  // set bindValidation(_obj: validation) {
  //   this.validationJson = _obj;
  // }

  //selected: any;
  dateFormatList = [
    { formatId: "1", name: "mm/dd/yy" },
    { formatId: "2", name: "mm/dd/yyyy" },
    { formatId: "3", name: "mm/dd/yyyy hh:ss" },
  ];

  textCriteriaList = [
    // { selectedId: 1, value: "" },
  ];
  textCriteria = [
    { id: 1, name: "Starts with" },
    { id: 2, name: "Not starting with" },
    { id: 3, name: "Ends with" },
    { id: 4, name: "Not ending with" },
    { id: 5, name: "Contains" },
    { id: 6, name: "Not Contain" },
  ];
  defaultValidationJSON = {
    typeId: "0",
    dateTime: {
      formatId: "2",
      showDatePicker: false,
      fromDate: "",
      toDate: "",
    },
    number: {
      fromLength: "",
      toLength: "",
      fromRange: "",
      toRange: "",
      exactValue: [
        // { value: ""}
      ],
    },
    text: {
      caseSensitive: false,
      selectedTypeId: 1,
      fromLength: "",
      toLength: "",
      exactValue: [
        // { value: "" }
      ],
      criteriaList: [
        // { selectedId: 1, value: "" }
      ],
    },
  };
  showDatePicker:boolean = false;
  constructor(
    private service: PropertyBindingService,
    private renderer: Renderer2,
    private toaster: ToastrService
  ) {
    this.validationJson = this.defaultValidationJSON;
  }

  ngOnInit() {
    // console.log("Oninit")
    this.service.dynamicValidation.subscribe((data: any) => {
      // console.log(data, "Dynamic Validation");
      if(data!=undefined){
        if(data.typeId == "3"){
          if(data.dateTime.formatId != '3'){
            if(data.dateTime.fromDate != undefined &&
              data.dateTime.fromDate != "" &&
              data.dateTime.fromDate != 'Invalid Date'){
                data.dateTime.fromDate = new Date(data.dateTime.fromDate);
            }
            if(data.dateTime.toDate != undefined &&
              data.dateTime.toDate != "" &&
              data.dateTime.fromDate != 'Invalid Date'){
                data.dateTime.toDate = new Date(data.dateTime.toDate);
            }
          }else{
            if(data.dateTime.fromDate != undefined &&
              data.dateTime.fromDate != "" &&
              data.dateTime.fromDate != 'Invalid Date'){
                data.dateTime.fromDate =moment(data.dateTime.fromDate).format("YYYY-MM-DDTHH:mm");
            }
            if(data.dateTime.toDate != undefined &&
              data.dateTime.toDate != "" &&
              data.dateTime.fromDate != 'Invalid Date'){
                data.dateTime.toDate =  moment(data.dateTime.toDate).format("YYYY-MM-DDTHH:mm");
            }
          }
        }
        this.validationJson =  JSON.parse(JSON.stringify(data));
      }else{
        this.validationJson = this.defaultValidationJSON;
        this.validationJson.typeId = "0";
      }
      // console.log(data, "ValidationJSO Data");
      this.ngOnInit()
      this.display = "block";
    });
    // console.log(this.validationJson)
    let _height = "75px";
    if (this.validationJson.typeId) {
      if (this.validationJson.typeId == 1) {
        _height = "300px";
      } else if (this.validationJson.typeId == 2) {
        _height = "400px";
      } else if (this.validationJson.typeId == 3) {
        _height = "180px";
      }
    }
    document.getElementById("validationModel").style.height = _height;
  }
  ngAfterViewInit() {
    this.renderer.listen("window", "click", (e: Event) => {
      if (e.target == this.menu.nativeElement) {
        this.display = "block";
      }
    });
  }
  // convertTOLocalDateTime(dateString){
  //   console.log(moment(dateString).format("YYYY/MM/DD HH:mm"))
  // }
  onTypeChange(id) {
    // console.log(id)
    this.validationJson = JSON.parse(JSON.stringify(this.defaultValidationJSON));
    let _height = "75px";
    if (id == 1) {
      _height = "300px";
      this.validationJson.typeId = "1";

    } else if (id == 2) {
      _height = "400px";
      this.validationJson.typeId = "2";
    } else if (id == 3) {
      this.validationJson.typeId = "3";
      _height = "180px";
    }else if (id == 0) {
      // console.log(this.validationJson,"Validation")
      this.validationJson.typeId = "0";
    }else if(id == 4){
      this.validationJson.typeId = "4";
    }else if(id == 5){
      this.validationJson.typeId = "5";
    }
    // console.log(this.validationJson,"ValidationJSON")
    document.getElementById("validationModel").style.height = _height;
  }

  addOption(typeId) {
    // typeId : 1-number; 2: text
    if (this.validationJson.typeId == "1")
      this.validationJson.number.exactValue.push({ value: "" });
    else if (this.validationJson.typeId == "2") {
      if (typeId == 0) this.validationJson.text.exactValue.push({ value: "" });
      else if (typeId == 1)
        this.validationJson.text.criteriaList.push({
          selectedId: 1,
          value: "",
        });
    }
  }

  deleteOption(typeId, index) {
    if (this.validationJson.typeId == "1")
      this.validationJson.number.exactValue.splice(index, 1);
    if (this.validationJson.typeId == "2") {
      if (typeId == 0) this.validationJson.text.exactValue.splice(index, 1);
      else if (typeId == 1)
        this.validationJson.text.criteriaList.splice(index, 1);
    }
  }
  switchDateFormate(){
    this.validationJson.dateTime.showDatePicker = false;
    this.validationJson.dateTime.fromDate = "";
    this.validationJson.dateTime.toDate = "";
  }
  openModal() {
    this.display = "block";
  }
  switchDateShow(){
    this.validationJson.dateTime.showDatePicker =! this.validationJson.dateTime.showDatePicker
    this.validationJson.dateTime.fromDate = "";
    this.validationJson.dateTime.toDate = "";
  }
  onCloseHandled() {
    //this.childToParent.emit(value);
    this.validationJson = this.defaultValidationJSON
    this.display = "none";
  }
  preventEinNumber(event){
    if(event.keyCode == 69){
      event.preventDefault();
    }
    // console.log(event.keyCode)
  }
  onClick(e) {
    // console.log(this.validationJson.dateTime,"DateTime");
    this.submitionFlag =  true;
    this.criteriaFlag = true;
    e.preventDefault();
    let dto: validation = { typeId: this.validationJson.typeId };
    // dto.typeId = this.validationJson.typeId;// 0: No Validation; 1:number; 2:text; 3:datetime; 4:e-mail; 5:web URL
    if (dto.typeId == "1") {
      if(this.validationJson.number.exactValue.length > 0){
        this.validationJson.number.exactValue.map((e)=>{
          // console.log(e,"Value");
          if(e.value.toString().trim().length == 0){
            this.submitionFlag = false;
          }
        })
      }
      for(const obj in this.validationJson.number){
        if(this.validationJson.number[obj] == null){
          this.validationJson.number[obj] = "";
        }
      }
      dto.number = {
        fromLength: this.validationJson.number.fromLength,
        toLength: this.validationJson.number.toLength,
        fromRange: this.validationJson.number.fromRange,
        toRange: this.validationJson.number.toRange,
        exactValue: this.validationJson.number.exactValue,
      };
    }
    if (dto.typeId == "2") {
      if(this.validationJson.text.exactValue.length > 0){
        this.validationJson.text.exactValue.map((e)=>{
          if(e.value.trim().length == 0){
            this.submitionFlag = false;
          }
        })
      }
      if(this.validationJson.text.criteriaList.length > 0){
        this.validationJson.text.criteriaList.map((e)=>{
          if(e.value.trim().length == 0){
            this.criteriaFlag = false;
          }
        })
      }
      for(const obj in this.validationJson.text){
        if(this.validationJson.text[obj] == null){
          this.validationJson.text[obj] = "";
        }
      }
      dto.text = {
        caseSensitive: this.validationJson.text.caseSensitive,
        selectedTypeId: this.validationJson.text.selectedTypeId,
        fromLength: this.validationJson.text.fromLength,
        toLength: this.validationJson.text.toLength,
        exactValue: this.validationJson.text.exactValue,
        criteriaList: this.validationJson.text.criteriaList,
      };
    }
    if (dto.typeId == "3") {
      if(this.validationJson.dateTime.formatId == '1'){
        dto.dateTime = {
          showDatePicker: this.validationJson.dateTime.showDatePicker,
          fromDate:moment(new Date(this.validationJson.dateTime.fromDate)).format('MM/DD/YY'),
          toDate: moment(new Date(this.validationJson.dateTime.toDate)).format('MM/DD/YY'),
          formatId: this.validationJson.dateTime.formatId,
        };
        // console.log(dto.dateTime,"DateTime IF");
      }else if(this.validationJson.dateTime.formatId == '2'){
        dto.dateTime = {
          showDatePicker: this.validationJson.dateTime.showDatePicker,
          fromDate: new Date(this.validationJson.dateTime.fromDate).toLocaleDateString(),
          toDate: new Date(this.validationJson.dateTime.toDate).toLocaleDateString(),
          formatId: this.validationJson.dateTime.formatId,
        };
        // console.log(dto.dateTime,"DateTime IF");
      }
      else{
        dto.dateTime = {
          showDatePicker: this.validationJson.dateTime.showDatePicker,
          formatId: this.validationJson.dateTime.formatId,
          // fromDate: new Date(this.validationJson.dateTime.fromDate).toLocaleString().replace(",",""),
          // toDate: new Date(this.validationJson.dateTime.toDate).toLocaleString().replace(",",""),
          fromDate: moment(new Date(this.validationJson.dateTime.fromDate)).format('MM/DD/YYYY h:mm A'),
          toDate: moment(new Date(this.validationJson.dateTime.toDate)).format('MM/DD/YYYY h:mm A')
        };
        // console.log(dto.dateTime,"DateTime ELse");

      }
    }
    if(dto.typeId == "0"){
      dto = this.defaultValidationJSON;
    }

    if(this.submitionFlag==true && this.criteriaFlag == true){
      this.childToParent.emit(dto);
      this.display = "none";
    }else if(this.submitionFlag !=true && this.criteriaFlag !=true){
      this.toaster.warning("Exact value and Criteria list is required","Warning");
    }else if (this.submitionFlag != true && this.criteriaFlag == true){
      this.toaster.warning("Exact value is required","Warning");
    }
    else if (this.submitionFlag ==true && this.criteriaFlag != true){
      this.toaster.warning("Criteria list is required","Warning");
    }
    e.preventDefault();
  }
}
