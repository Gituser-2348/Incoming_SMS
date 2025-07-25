import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedRoutingModule } from "./shared-routing.module";
import { SharedService } from "./service/shared.service";
import { MyLoaderComponent } from "./components/my-loader/my-loader.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { VoiceFileUploadComponent } from "./components/voice-file-upload/voice-file-upload.component";
import { VoiceFileUploadService } from "./service/voice-file-upload.service";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { DaterangePickerComponent } from "./components/daterange-picker/daterange-picker.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { RegiformComponent } from "./components/regiform/regiform.component";
import { VerificationComponent } from "./components/verification/verification.component";
import { VariablePopComponent } from "./components/variable-pop/variable-pop.component";
import { ChatBotComponent } from "./components/chat-bot/chat-bot.component";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { EmojiModule } from "@ctrl/ngx-emoji-mart/ngx-emoji";

@NgModule({
  declarations: [
    MyLoaderComponent,
    DaterangePickerComponent,
    ConfirmDialogComponent,
    VoiceFileUploadComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
    PickerModule,
    EmojiModule,
  ],
  exports: [
    MyLoaderComponent,
    ConfirmDialogComponent,
    VoiceFileUploadComponent,
    DaterangePickerComponent,
  ],
  entryComponents: [ConfirmDialogComponent],
  providers: [SharedService, VoiceFileUploadService],
})
export class SharedModule {}
