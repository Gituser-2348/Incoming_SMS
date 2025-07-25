import {
  NgModule,
  Directive,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  Input,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TextareaComponent } from "./views/flow/shared/textarea-Component/customTextarea.component";
import { VariablePopComponent } from "./shared/components/variable-pop/variable-pop.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { NgxtForDirective } from "./views/report/chatHisotry/ngxt-for.directive";
import { SelectLanguageComponent } from "./views/flow/shared/select/select.component";
import { MaterialExampleModule } from "../material.module";
/*import { ChatRepliesComponent } from "./views/accounts/chat-replies/chat-replies.component";*/
import { FileHandler } from "./shared/components/file-handler-chat/file-handler-chat";
import { NgxSpinnerModule } from "ngx-spinner";
import { ChatBotComponent } from "./shared/components/chat-bot/chat-bot.component";
import { CreateTemplateComponent } from "./shared/components/create-template/create-template.component";
import { InputValidatorDirective } from "./shared/service/input-validator.directive";
import { SmsTemplateDetailsComponent } from "./shared/components/smsTemplateDetails/smsTemplateDetails.component";
import { DaterangePickerComponent } from "./shared/components/daterange-picker/daterange-picker.component";
import { TestSMSComponent } from "./shared/components/testSMS/testSMS.component";
import { MatSortModule } from "@angular/material/sort";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PickerModule,
    MaterialExampleModule,
    NgxSpinnerModule,
    MatSortModule,
  ],
  declarations: [
    // DaterangePickerComponent,
    TextareaComponent,
    VariablePopComponent,
    NgxtForDirective,
    SelectLanguageComponent,
   // ChatRepliesComponent,
    FileHandler,
    ChatBotComponent,
    CreateTemplateComponent,
    InputValidatorDirective,
    SmsTemplateDetailsComponent,
    TestSMSComponent

  ],
  exports: [
    TextareaComponent,
    VariablePopComponent,
    NgxtForDirective,
    SelectLanguageComponent,
  //  ChatRepliesComponent,
    FileHandler,
    ChatBotComponent,
    CreateTemplateComponent,
    InputValidatorDirective,
    SmsTemplateDetailsComponent,
    TestSMSComponent
    // DaterangePickerComponent
  ],
})
export class AppSharedModule {}
