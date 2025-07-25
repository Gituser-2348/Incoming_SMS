import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { PropertyBindingService } from "../../propertybuilder/propertyBinding.service";
import Keyboard from "simple-keyboard";
import arabic from "../../testlayouts/layouts/arabic";
import hindi from "../../testlayouts/layouts/hindi";
import english from "../../testlayouts/layouts/english";
import malayalam from "../../testlayouts/layouts/malayalam";
import { FlowbuilderService } from "../../flowbuilder.service";
@Component({
  selector: "select-language",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.css"],
})
export class SelectLanguageComponent {
  showWindow: boolean = false;
  value = "";
  keyboard: Keyboard;
  languages = ["English", "Hindi", "Malayalam", "Arabic"];
  nodeName: any;
  keyboardStatus = "closed";
  curPos: any = 0;
  maxLength : any;
  constructor(
    private propertyService: PropertyBindingService,
    private flowservice: FlowbuilderService,
  ) {

  }

  ngOnInit() {
    this.propertyService.changeClassOveride.subscribe((data) => {
      this.nodeName = data;
    });
    this.propertyService.changeCurPos.subscribe((data) => {
      this.curPos = data;
    });
    var element = document.getElementById("simpleKey");
    element.style.display = "none";
    this.keyboardStatus = "closed";
    this.flowservice.openKeyboard.subscribe((data) => {
      // console.log(data);
      this.maxLength  = data["maxLen"];
      if (this.keyboardStatus == "closed") {
        // console.log("ifone");
        this.keyboardStatus = "open";
        var element = document.getElementById("simpleKey");
        element.style.display = "block";
      } else {
        if (this.nodeName == data["data"] || this.nodeName == undefined) {
          // console.log("if");
          this.keyboardStatus = "closed";
          var element = document.getElementById("simpleKey");
          element.style.display = "none";
          this.showWindow = false;
        } else if (this.nodeName != data["data"]) {
          this.showWindow = false;
        }
      }
      this.nodeName = data["data"];
    });
    this.flowservice.alwaysCloseKeyboard.subscribe((data)=>{
      if(this.keyboardStatus == "open"){
        this.keyboardStatus = "closed";
        var element = document.getElementById("simpleKey");
        element.style.display = "none";
      }
    })
  }

  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onChange: (input) => this.onChange(input),
      onKeyPress: (button) => this.onKeyPress(button),
      ...english,
      display: {
        "{cLan}": "&#127760;Change lang",
        "{shift}": "&#8679; Shift",
        "{lock}": "CapsLock",
        "{tab}": "Tab \u21B9",
        "{space}": "\u2800",
        "{bksp}": "&#10229; Backspace",
        "{enter}": "\u21B5 Enter",
        "{close}":"close"
      },
    });
  }

  onChange = (input: string) => {
    this.value = input;
  };

  onKeyPress = (button: string) => {
    // if(this.showWindow==true){
    //   this.showWindow = false;
    // }
    // console.log("Button pressed", button);
    var element = document.getElementById(`${this.nodeName}`);
    if (button === "{shift}" || button === "{lock}") {
      this.handleShift();
    } else if (button == "{cLan}") {
      this.showWindow = !this.showWindow;
      // this.propertyService.changeLangSubject.next(this.type)
    } else if (button == "{bksp}") {
      // var messageString = element.textContent;
      // var finalString = messageString.substring(0, messageString.length - 1);
      // element.textContent = finalString;
      var firstString = element.innerHTML.slice(0, this.curPos);
      var secondString = element.innerHTML.slice(this.curPos);
      firstString = firstString.substring(0, firstString.length - 1);
      element.innerHTML = firstString + secondString;
      this.propertyService.changeCurPos.next(this.curPos - 1);
      this.propertyService.changeTempVar.next(element.textContent);
      this.propertyService.lengthChange.next("changed");
    } else if (button == "{enter}") {
        var firstString = element.innerHTML.slice(0, this.curPos);
        var secondString = element.innerHTML.slice(this.curPos);
        firstString = firstString.trim() + "<br>";
        var finaleString = firstString + secondString;
        element.innerHTML = finaleString;
        this.propertyService.changeCurPos.next(this.curPos + 4);
        this.propertyService.changeTempVar.next(element.textContent);
        this.propertyService.lengthChange.next("changed");
    } else if (button == "{space}") {
      if (element.textContent.trim().length == 0) {
        element.innerHTML = element.innerHTML + "&nbsp;";
        this.propertyService.changeCurPos.next(this.curPos + 6);
        this.propertyService.changeTempVar.next(element.textContent);
        this.propertyService.lengthChange.next("changed");
      } else {
        var firstString = element.innerHTML.slice(0, this.curPos);
        var secondString = element.innerHTML.slice(this.curPos+1);
        firstString = firstString.trim() + "&nbsp;";
        var finaleString = firstString + secondString;
        element.innerHTML = finaleString;
        this.propertyService.changeCurPos.next(this.curPos + 6);
        this.propertyService.changeTempVar.next(element.textContent);
        this.propertyService.lengthChange.next("changed");
      }
    }else if(button == "{tab}"){
    }else if(button == "{close}"){
      var element = document.getElementById("simpleKey");
      element.style.display = "none";
      this.keyboardStatus = "closed";
    }else {
      if (element.textContent.trim().length == 0) {
        element.innerHTML = element.innerHTML + button.slice(0, 1);
        this.propertyService.changeCurPos.next(this.curPos + 6);
        this.propertyService.changeTempVar.next(element.textContent);
        this.propertyService.lengthChange.next("changed");
      } else {
        // console.log(element.textContent.trim().length, this.maxLength,"maxlength");
        if(element.textContent.trim().length < this.maxLength){
          var key = button;
        var newKey = key.slice(0, 1);
        // var element = document.getElementById(`${this.nodeName}`)
        var firstString = element.innerHTML.slice(0, this.curPos);
        var secondString = element.innerHTML.slice(this.curPos);
        firstString = firstString.trim() + newKey;
        var finaleString = firstString + secondString;
        element.innerHTML = finaleString;
        this.propertyService.changeCurPos.next(this.curPos + 1);
        this.propertyService.changeTempVar.next(element.textContent);
        this.propertyService.lengthChange.next("changed");
        }
      }
    }
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle,
    });
  };

  getLanguage(lang, data) {
    if (lang == "English") {
      this.keyboard.setOptions(english);
    } else if (lang == "Malayalam") {
      this.keyboard.setOptions(malayalam);
    } else if (lang == "Hindi") {
      this.keyboard.setOptions(hindi);
    } else if (lang == "Arabic") {
      this.keyboard.setOptions(arabic);
    }
    this.showWindow = false;
  }
}
