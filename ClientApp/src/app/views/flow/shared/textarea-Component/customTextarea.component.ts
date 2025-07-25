import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Renderer2,
  ChangeDetectorRef,
  OnInit,
} from "@angular/core";
import { PropertyBindingService } from "../../propertybuilder/propertyBinding.service";
import Keyboard from "simple-keyboard";
import arabic from "../../testlayouts/layouts/arabic";
import hindi from "../../testlayouts/layouts/hindi";
import english from "../../testlayouts/layouts/english";
import malayalam from "../../testlayouts/layouts/malayalam";
import { FlowbuilderService } from "../../flowbuilder.service";
import { SigninService } from "../../../sign-in/sign-in.service";
import { Router } from "@angular/router";
import { ChatBotService } from "../../../../shared/components/chat-bot/chat-bot.service";

@Component({
  selector: "custom-textarea",
  templateUrl: "./customTextarea.component.html",
  styleUrls: ["./customTextarea.component.css"],
})
export class TextareaComponent implements OnInit {
  @Input() classOverride; //! for creating id for specific textareaDiv
  @Input() model; //! modal of the field eg:botask.message
  @Input() placeHolder; //!placeholder for the textarea
  @Input() minHeight; //! for converting single line input/multiline input
  @Input() maxLen;
  @Input() emojiFlag?:boolean =false;
  @Input() maxHeightFlag?:boolean =false;
  @Input() arrangeButtonDiv?:boolean =false;
  @Output() messageData = new EventEmitter<string>(); //! message/data passed to the parent component
  @Output() textLength = new EventEmitter(); //! Length of the message passed to the parent component

  @ViewChild("contentEditobleDiv") editableDiv: ElementRef; //!for selecting particular textarea if morethan one exist
  @ViewChild("placeholder") placeholder: ElementRef; //!for selecting placeholde spantag
  @ViewChild("buttonDiv") buttonDiv: ElementRef; //!for selecting placeholde spantag
  // clicked = "";
  padding: any = "0px";
  show = false;
  tempVar: any = " ";
  boldFlag = false;
  italicFlag = false;
  strikeFlag = false;
  underlineFlag = false;
  currentPosition: any = 0;
  caretCurrentpos: any;
  icon = "{X}";
  showEmojiPicker = false;
  set: string = "twitter";
  targetedTextarea;
  style = "";
  lengthShow: any = "";
  nextText: any = "";
  editableFlag = true;
  showKeybordcom = false;
  keyboard: Keyboard;
  value = "";
  type = "";
  div: any;
  lastInd: any;
  agentWindow:boolean=false;
  showVariable:boolean=true;
  // ErrorFlags={
  //   botsays:false,
  //   botask:false,
  // }
  agentChat:boolean = false;
  constructor(
    private propertyService: PropertyBindingService,
    private flowService: FlowbuilderService,
    private renderListener: Renderer2,
    private signInService:SigninService,
    private router:Router,
    private chatBotService :ChatBotService
  ) {
    this.checkLength();
    this.propertyService.clearTextbox.subscribe(() => {
      //!clearing textarea
      this.clearTextarea();
    });
    this.propertyService.resetBtn.subscribe(()=>{
      this.resetFunction();
    })
    this.propertyService.changeCurPos.subscribe((position) => {
      this.currentPosition = position;
    });
    // this.chatBotService.emojiPosition.subscribe((flag:boolean)=>{
    //   this.agentChat = flag
    // })
  }

  ngOnInit() {
    // console.log(this.router.url)
    if(this.router.url=='/accounts/chatReplies'){
      this.showVariable=false;
    }else{
      this.showVariable=true;
    }
    if(this.signInService.decryptData(sessionStorage.getItem("agentFlag"))=='1'){
      this.agentWindow=true;
    }else{
      this.agentWindow=false;
    }
    this.propertyService.lengthChange.subscribe((data) => {
      this.keyUp();
    });

    this.propertyService.changeTempVar.subscribe((data) => {
      this.tempVar = data;
    });
    this.propertyService.getPos.subscribe((data) => {
      this.propertyService.currentPos = this.currentPosition;
    });
    // console.log(this.model,"model Before");
    this.model = this.model.replace(/ /g, "&nbsp;").replace(/\\"/g, '"');
    this.tempVar = this.model;
    // console.log(this.model,"model After");
    this.checkLength();
    if(this.emojiFlag == true){
      this.showVariable = false
    }
  }

  checkLength() {
    var element = document.getElementById(`${this.classOverride}`);
    if (element) {
      var text = element.textContent;
      var html = element.innerHTML;
      var brLength = (html.match(new RegExp("<br>", "g")) || []).length;
      var bLength = (html.match(new RegExp("<b>", "g")) || []).length;
      var iLength = (html.match(new RegExp("<i>", "g")) || []).length;
      var sLength = (html.match(new RegExp("<strike>", "g")) || []).length;
      // console.log(brLength, "brLength");
      var times = Math.min(
        text.split("[").length - 1,
        text.split("]").length - 1
      );
      this.nextText = text;
      var val: any = "";
      var num: any = "";
      for (let i = 1; i <= times; i++) {
        var first = this.nextText.indexOf("[");
        var end = this.nextText.indexOf("]");
        var nextFirst = this.nextText.indexOf("[", first + 1);
        var nextEnd = this.nextText.indexOf("]", end + 1);
        if (nextFirst > end || nextFirst == -1) {
          var firstText = this.nextText.substring(0, first);
          var secondText = this.nextText.substring(
            end + 1,
            this.nextText.length
          );
          this.nextText = firstText += secondText;
        } else if (nextFirst < end && nextFirst > first && nextFirst != -1) {
          if (nextEnd < 0) {
            var firstText = this.nextText.substring(0, nextFirst);
            var secondText = this.nextText.substring(end);
            val = nextFirst - this.nextText.length;
          } else {
            val = nextFirst - first;
            num = 50;
            var firstText = this.nextText.substring(0, first);
            var secondText = this.nextText.substring(nextFirst);
            this.nextText = firstText += secondText;
          }
        } else {
          var firstText = this.nextText.substring(0, nextFirst);
          var secondText = this.nextText.substring(
            end + 1,
            this.nextText.length
          );
          this.nextText = firstText += secondText;
        }
      }
      if(this.router.url=='/flow/flow'){
        this.lengthShow =
          this.nextText.length +
          times * 50 +
          (brLength * 6) +
          (bLength * 4) +
          (iLength * 4) +
          (sLength * 4) +
          val - num;
      }else{
        this.lengthShow =
        text.length +
        (brLength * 6) +
        (bLength * 4) +
        (iLength * 4) +
        (sLength * 4) +
        val - num;
      }
    }
  }


  returnLength(text){

    this.nextText = text;
    var element=document.createElement("div");
    element.innerHTML=text;
    var html = element.innerHTML;
    var brLength = (html.match(new RegExp("<br>", "g")) || []).length;
    var times = Math.min(
      text.split("[").length - 1,
      text.split("]").length - 1
    );
    var val: any = "";
      var num: any = "";
      for (let i = 1; i <= times; i++) {
        var first = this.nextText.indexOf("[");
        var end = this.nextText.indexOf("]");
        var nextFirst = this.nextText.indexOf("[", first + 1);
        var nextEnd = this.nextText.indexOf("]", end + 1);
        if (nextFirst > end || nextFirst == -1) {
          var firstText = this.nextText.substring(0, first);
          var secondText = this.nextText.substring(
            end + 1,
            this.nextText.length
          );
          this.nextText = firstText += secondText;
        } else if (nextFirst < end && nextFirst > first && nextFirst != -1) {
          if (nextEnd < 0) {
            var firstText = this.nextText.substring(0, nextFirst);
            var secondText = this.nextText.substring(end);
            val = nextFirst - this.nextText.length;
          } else {
            val = nextFirst - first;
            num = 50;
            var firstText = this.nextText.substring(0, first);
            var secondText = this.nextText.substring(nextFirst);
            this.nextText = firstText += secondText;
          }
        } else {
          var firstText = this.nextText.substring(0, nextFirst);
          var secondText = this.nextText.substring(
            end + 1,
            this.nextText.length
          );
          this.nextText = firstText += secondText;
        }
      }
        return this.nextText.length +
          times * 50+(brLength * 6)
  }

  checkPasteData(text,maxLength){
    // console.log(maxLength,'maxLength')
    // console.log(this.returnLength(text),'length')
    // console.log(text)
    if(this.returnLength(text)>maxLength){
      for(let i=1; i<text.length;i++){
        // console.log(i,'i');

        var lastText=text.slice(0,-i);
        // console.log(lastText,'lastText')
        var returnValue=this.returnLength(lastText)
        // console.log(returnValue,'returnValue')
        if(returnValue<=maxLength){
          // console.log(text.slice(0,-i))
          // console.log(text.slice(0,-i),'sliceValie');
          return text.slice(0,-i);
        }
      }
    }else{
      return text;
    }
  }

  keyUp() {
    this.checkLength();
    var message = document.getElementById(`${this.classOverride}`);
    // console.log(message.innerHTML, "message");
    var newCurrentPos = this.getcaretPositionWIthInnerHtml(message);
    if (this.currentPosition < newCurrentPos) {
      this.currentPosition = newCurrentPos;
    }
    var messageEmit = message.innerHTML
      .replace(/<b>[<br>]*<\/b>/g, "<br>")
      .replace(/[a-z0-9]<div><br><\/div><div>/, "<br><br>")
      .replace(/<div><br><\/div><div>/g, "<br>")
      .replace(/<div><br><div>/g, "<br><br>")
      .replace(/<div><br><\/div>/g, "<br>")
      .replace(/<\/?span[^>]*>/g, "")
      .replace(/<div>/g, "<br>")
      .replace(/<\/div>/g, "")
      .replace(/\s+/g, "&nbsp;")
      .replace(/\n/g, "<br>");

    this.propertyService.currentPos = this.currentPosition;
    this.messageData.emit(messageEmit);
    this.textLength.emit(this.lengthShow);
    // message.innerHTML = messageEmit
    // this.moveFocusToEnd();
    this.propertyService.changeCurPos.next(this.currentPosition);
    this.propertyService.changeClassOveride.next(this.classOverride);
    // console.log(
    //   document.getElementById(`${this.classOverride}`).innerHTML,
    //   "innerhtml"
    // );
    // console.log( document.getElementById(`${this.classOverride}`).textContent,
    // "innerhtml")
  }

  moveFocusToEnd() {
    const el = document.getElementById(`${this.classOverride}`);
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(el);
    range.collapse(false);
    selection.addRange(range);
    el.focus();
  }

  ngAfterViewInit() {
    this.checkLength();
    this.currentPosition = this.lengthShow;
    this.renderListener.listen("window", "click", (data) => {
      //!selecting particular textarea from click on textarea
      if (data.target == this.editableDiv.nativeElement) {
        this.ngOnInit();
        this.checkLength();
      }
    });
  }
  ngOnChanges() {
    this.ngOnInit();
  }
  focusToInital() {
    if (this.tempVar.length == 0) {
      this.editableDiv.nativeElement.focus();
    }
  }

  resetFunction(){
    this.boldFlag=false;
    this.italicFlag=false;
    this.strikeFlag=false;
    this.underlineFlag=false;
  }

  selectFunction(name: string, falsevalue, nullvalue) {
    // console.log(name,falsevalue,nullvalue)
    document.execCommand(name, falsevalue, nullvalue); //!code for creating bold italics underline strikethrogh properties
    this.keyUp();
  }

  addText(event) {
    //!adding new value to textare by keypress and assigning properties like length
    if (this.lengthShow < this.maxLen) {
      this.tempVar = document.getElementById(
        `${this.classOverride}`
      ).textContent;
      var element = document.getElementById(`${this.classOverride}`);
      var pos = this.getcaretPositionWIthInnerHtml(element); //!getting curser postion for checking the bold italics etc..flags for assign to button enable/desable
      this.currentPosition = pos;
      var status = this.checkRegExp(element, pos, pos); //!regular expression for checking whethe bold,italcs,.. are present or not

      this.boldFlag = status.bold.status;
      this.italicFlag = status.italic.status;
      this.strikeFlag = status.strike.status;
      this.underlineFlag = status.underline.status;

      var message = document.getElementById(`${this.classOverride}`);
      this.checkLength();
      // this.messageData.emit(message.innerHTML.replace(/<div>/g,"").replace(/<\/div>/g,"").replace(/&nbsp;/g," "));     //! emitting message data to parent component
      this.textLength.emit(this.lengthShow); //!emittin length of the message to parent component
      // document.getElementById(`${this.classOverride}`).innerHTML = message.innerHTML.replace(/<div>/g,"").replace(/<\/div>/g,"").replace(/&nbsp;/g," ");
      this.propertyService.changeCurPos.next(this.currentPosition);
    } else {
      if (event.code != "Backspace") {
        event.preventDefault();
        this.checkLength();
      }
      // event.preventDefault()
      // return false;
    }
  }
  clearTextarea() {
    //!function to clear textarea
    try {
      document.getElementById(`${this.classOverride}`).innerHTML = "";
      this.tempVar = "";
      this.lengthShow = 0;
    } catch (err) { }
  }
  checkRegExp(element, sel_start, sel_end) {
    //! function to check regular expression for bold,italics..
    var selectionStart = sel_start,
      selectionEnd = sel_end,
      statusObject = {
        bold: {
          expression: /<b>[^]*<\/b>/g,
          status: false,
        },
        italic: {
          expression: /<i>[^]*<\/i>/g,
          status: false,
        },
        strike: {
          expression: /<strike>[^]*<\/strike>/g,
          status: false,
        },
        underline: {
          expression: /<u>[^]*<\/u>/g,
          status: false,
        },
      },
      value = element.innerHTML; //!value is used to iteration for matching the RE, innerhtml used for getting specific tags
    for (var key in statusObject) {
      for (
        let match;
        (match = statusObject[key].expression.exec(value)) !== null;

      ) {
        // console.log(statusObject[key].expression.lastIndex,selectionEnd)
        if (
          match.index < selectionStart &&
          statusObject[key].expression.lastIndex > selectionEnd
        ) {
          statusObject[key].status = true;
        } else {
          statusObject[key].status = false;
        }
      }
    }
    return statusObject;
  }
  contentCheckOnPaste(event) {
    // console.log(event.clipboardData.getData("text/plain"), "event");
    var maxLength = this.maxLen;
    var copiedData = event.clipboardData.getData("text/plain");
    copiedData = copiedData.replace(/(<([^>]+)>)/gi, "");
    var existingMessage = document.getElementById(
      `${this.classOverride}`
    ).textContent;
    var existingInnerHtml = document.getElementById(
      `${this.classOverride}`
    ).innerHTML;
    var newCopiedData;
    var existingMessageLength = existingMessage.length;
    var CopiedDataLength = copiedData.length;
    // console.log(existingMessageLength, CopiedDataLength);
    if (existingMessageLength == maxLength) {
      // console.log(1)
      event.preventDefault();
    } else if (existingMessageLength + CopiedDataLength >= maxLength) {
      // console.log(this.returnLength(existingMessage),'existingMessageLength')
      var balanceAcceptableLength = maxLength - existingMessageLength;
      newCopiedData = copiedData.slice(0, balanceAcceptableLength);
      if(this.router.url=='/flow/flow'){
        newCopiedData=this.checkPasteData(newCopiedData,maxLength-this.returnLength(existingMessage));
      }
      // console.log(2)
      // console.log(balanceAcceptableLength,'balanceAcceptableLength')
      this.pasteData(existingInnerHtml, newCopiedData);
    } else if (existingMessageLength + CopiedDataLength < maxLength) {
      if(this.router.url=='flow/flow'){
        newCopiedData =       this.checkPasteData(copiedData,maxLength-this.returnLength(existingMessage));
      }else{
        newCopiedData = copiedData;
      }
      // console.log(3)
      this.pasteData(existingInnerHtml, newCopiedData);
    }
    event.preventDefault();
    // if (existingMessageLength == maxLength) {
    //   event.preventDefault();
    // } else if (existingMessageLength + CopiedDataLength >= maxLength) {
    //   var balanceAcceptableLength = maxLength - existingMessageLength;
    //   newCopiedData = copiedData.slice(0, balanceAcceptableLength);
    //   this.pasteData(existingInnerHtml, newCopiedData);
    // } else if (existingMessageLength + CopiedDataLength < maxLength) {
    //   newCopiedData = copiedData;
    //   this.pasteData(existingInnerHtml, newCopiedData);
    // }
  }
  pasteData(existingInnerHtml, newCopiedData) {
    var firstString = existingInnerHtml.slice(0, this.currentPosition);
    var secondString = existingInnerHtml.slice(this.currentPosition);
    firstString = firstString + newCopiedData;
    document.getElementById(`${this.classOverride}`).innerHTML =
      firstString + secondString;
    this.moveFocusToEnd();
    this.messageData.emit(
      document
        .getElementById(`${this.classOverride}`)
        .innerHTML.replace(/<b>[<br>]*<\/b>/g, "\n")
        .replace(/<div><br><\/div><div>/g, "<br>")
        .replace(/<div><br><\/div>/g, "<br>")
        .replace(/<\/?span[^>]*>/g, "")
        .replace(/<div>/g, "<br>")
        .replace(/<\/div>/g, "")
        .replace(/\s+/g, "&nbsp;")
        .replace(/\n/g, "<br>")
    ); //!emiting the content of text area with emoji
    this.textLength.emit(this.lengthShow);
  }
  // getCaretIndex(element) {
  //   // console.log(element)
  //   let position = 0;
  //   const isSupported = typeof window.getSelection !== "undefined";
  //   if (isSupported) {
  //     const selection = window.getSelection();
  //     if (selection.rangeCount !== 0) {
  //       const range = window.getSelection().getRangeAt(0);
  //       const preCaretRange = range.cloneRange();
  //       preCaretRange.selectNodeContents(element);
  //       preCaretRange.setEnd(range.endContainer, range.endOffset);
  //       position = preCaretRange.toString().length;
  //     }
  //   }
  //   // console.log(position)
  //   return (position)
  // }

  getCaretPosition(node) {
    // console.log(node)
    //!  function for getting curser position in the textarea
    var range = window.getSelection().getRangeAt(0),
      preCaretRange = range.cloneRange(),
      caretPosition;
    // tmp = document.createElement("div");
    preCaretRange.selectNodeContents(node);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    // tmp.appendChild(preCaretRange.cloneContents());
    //testing start here
    // console.log(range, 'range');
    var value = range.startContainer.textContent.replace(/\s/g, "&nbsp;")
    var val = range.startContainer.nextSibling
    var curPos: number = 0;
    // curPos=range.startOffset
    // console.log(range.startContainer.textContent.slice(0, range.startOffset), 'start');
    var extra = range.startContainer.textContent.slice(0, range.startOffset).replace(/\s/g, "&nbsp;").length;
    curPos = curPos + extra;
    if (val) {
      // console.log(val.toString(), 'next');
      if (val.toString() == '[object HTMLBRElement]') {
        value = `${value}<br>`;
        // curPos=curPos+4;
      }
    }
    if (range.startContainer.previousSibling&&!val) {
      if (range.startContainer.previousSibling.toString() == '[object HTMLBRElement]') {
        value = `<br>${value}`;
        curPos = curPos + 4;
      }
      // console.log(range.startContainer.previousSibling.toString(), 'prev');
    }
    // console.log(curPos, 'curPos');
    // console.log(value, "replaced");
    var element = document.getElementById(this.classOverride).innerHTML.replace(/\s/g, "&nbsp;");
    // console.log(element, 'ele');
    this.lastInd = element.indexOf(value) + curPos;
    // console.log(this.lastInd, 'index');
    //test ends here
    caretPosition = preCaretRange.toString().length;
    this.caretCurrentpos = caretPosition;
    // console.log(caretPosition, "caretPosition");
    return caretPosition;
  }
  getcaretPositionWIthInnerHtml(element) {
    //!getting curser position with html tags if bold,italics are present
    var textPosition = this.getCaretPosition(element),
      // var textPosition = this.getCaretIndex(element),
      // htmlContent = element.innerHTML
      //   .replace(/<div>/g, "")
      //   .replace(/<\/div>/g, "")
      //   .replace(/" "/g,"&nbsp;"),
      htmlContent = element.innerHTML,
      // .replace(/\s+/g, "&nbsp;"),

      textIndex = 0,
      htmlIndex = 0,
      insideHtml = false,
      htmlBeginChars = ["&", "<"],
      htmlEndChars = [";", ">"];
    if (textPosition == 0) {
      return 0;
    }
    while (textIndex < textPosition) {
      while (htmlBeginChars.indexOf(htmlContent.charAt(htmlIndex)) > -1) {
        insideHtml = true;
        while (insideHtml) {
          if (htmlEndChars.indexOf(htmlContent.charAt(htmlIndex)) > -1) {
            if (htmlContent.charAt(htmlIndex) == ";") {
              htmlIndex++;
            }
            insideHtml = false;
          }
          htmlIndex++;
        }
      }
      htmlIndex++;
      textIndex++;
    }
    // console.log(htmlIndex, "htmlIndex");
    return htmlIndex;
  }




  //! Emoji Part
  toggleEmojiPicker() {
    //!function for show/hide emoji component
    this.showEmojiPicker = !this.showEmojiPicker;
  }
  addEmoji(event) {
    //!function for adding emoji
    // this.textareaData.emit(this.model)
    // this.textLength.emit(this.length)
    if (this.lengthShow < this.maxLen && this.lengthShow + 2 <= this.maxLen) {
      var emoji = event.emoji.native;
      var element = document.getElementById(`${this.classOverride}`);
      var curPosition = this.currentPosition;
      var firstString = element.innerHTML.slice(0, curPosition); //!adding emoji to specific position where the cursers last position
      var secondString = element.innerHTML.slice(curPosition); //!slicing and concatinating string with emoji and returning new string with emoji
      firstString = firstString + emoji;
      var finalString = firstString + secondString;
      element.innerHTML = finalString;
      this.currentPosition = this.currentPosition + emoji.length;
      this.tempVar = element.textContent;
      this.checkLength();
      this.propertyService.changeCurPos.next(this.currentPosition);
      this.messageData.emit(
        element.innerHTML
          .replace(/<b>[<br>]*<\/b>/g, "\n")
          .replace(/<div><br><\/div><div>/g, "<br>")
          .replace(/<div><br><\/div>/g, "<br>")
          .replace(/<\/?span[^>]*>/g, "")
          .replace(/<div>/g, "<br>")
          .replace(/<\/div>/g, "")
          .replace(/\s+/g, "&nbsp;")
          .replace(/\n/g, "<br>")
      ); //!emiting the content of text area with emoji
      this.textLength.emit(this.lengthShow);
    }
  }

  input(data) {
    this.show = true;
    this.propertyService.dynamicVariable.next(data);
    //! used to pass the variable property to variable popUp component
  }

  childToParent(name) {
    if (this.lastInd) {
      if (this.lengthShow < this.maxLen && this.lengthShow + 50 <= this.maxLen) {
        var emoji = name;
        var element = document.getElementById(`${this.classOverride}`);
        var curPosition = this.lastInd;
        var firstString = element.innerHTML.slice(0, curPosition); //!adding emoji to specific position where the cursers last position
        var secondString = element.innerHTML.slice(curPosition); //!slicing and concatinating string with emoji and returning new string with emoji
        firstString = firstString + emoji;
        var finalString = firstString + secondString;
        element.innerHTML = finalString;
        this.currentPosition = this.currentPosition + emoji.length;
        this.tempVar = element.textContent;
        this.checkLength();
        this.propertyService.changeCurPos.next(this.currentPosition);
        this.messageData.emit(element.innerHTML
          .replace(/<b>[<br>]*<\/b>/g, "\n")
          .replace(/<div><br><\/div><div>/g, "<br>")
          .replace(/<div><br><\/div>/g, "<br>")
          .replace(/<\/?span[^>]*>/g, "")
          .replace(/<div>/g, "<br>")
          .replace(/<\/div>/g, "")
          .replace(/" "/g, "&nbsp;")
          .replace(/\n/g, "<br>")); //!emiting the content of text area with emoji
        this.textLength.emit(this.lengthShow);
      }
    } else {
      // console.log('else');

      // if (this.lengthShow < this.maxLen && this.lengthShow + 50 <= this.maxLen) {
      //   var emoji = name;
      //   var element = document.getElementById(`${this.classOverride}`);
      //   var curPosition = this.currentPosition;
      //   var firstString = element.innerHTML.slice(0, curPosition); //!adding emoji to specific position where the cursers last position
      //   var secondString = element.innerHTML.slice(curPosition); //!slicing and concatinating string with emoji and returning new string with emoji
      //   firstString = firstString + emoji;
      //   var finalString = firstString + secondString;
      //   element.innerHTML = finalString;
      //   this.currentPosition = this.currentPosition + emoji.length;
      //   this.tempVar = element.textContent;
      //   this.checkLength();
      //   this.propertyService.changeCurPos.next(this.currentPosition);
      //   this.messageData.emit(element.innerHTML
      //   .replace(/<b>[<br>]*<\/b>/g,"\n")
      //   .replace(/<div><br><\/div><div>/g,"<br>")
      //   .replace(/<div><br><\/div>/g,"<br>")
      //   .replace(/<\/?span[^>]*>/g,"")
      //   .replace(/<div>/g, "<br>")
      //   .replace(/<\/div>/g, "")
      //   .replace(/" "/g,"&nbsp;")
      //   .replace(/\n/g, "<br>")); //!emiting the content of text area with emoji
      //   this.textLength.emit(this.lengthShow);
      // }
    }

  }

  ngOnDestroy() {
    this.model = "";
    this.tempVar = " ";
    this.boldFlag = false;
    this.italicFlag = false;
    this.strikeFlag = false;
    this.underlineFlag = false;
    this.currentPosition = 0;
  }

  clicked() {
    var element = document.getElementById(`${this.classOverride}`);
    // console.log(window.getSelection(), "Selection");
    var pos = this.getcaretPositionWIthInnerHtml(element); //!getting curser postion for checking the bold italics etc..flags for assign to button enable/desable
    this.currentPosition = pos;
    this.propertyService.changeCurPos.next(pos);
    // console.log(window.getSelection());

  }

  toggleKeyboard(data) {
    // console.log(data)
    var dataObject = {
      data: data,
      maxLen: this.maxLen,
    };
    // console.log("Data")
    // this.flowService.openKeyboard.next(data);
    this.flowService.openKeyboard.next(dataObject);
  }
}
