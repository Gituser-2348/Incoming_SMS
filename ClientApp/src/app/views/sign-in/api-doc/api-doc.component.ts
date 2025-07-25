import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { Build } from '../../../shared/app-enum.model';
declare var Redoc: any;
@Component({
  selector: 'app-api-doc',
  templateUrl: './api-doc.component.html',
  styleUrls: ['./api-doc.component.scss']
})

// declare var Redoc: any;
export class ApiDocComponent implements OnInit {
  newJSON: any = [];
  jsonToShow: any = [];
  constructor(private location: Location, private appService: AppService, public http: HttpClient,
    ) { }

  ngOnInit(): void {
    //console.log(location.origin.slice,'origin-------------------');

   // alert(this.appService.buildName)
    var href = location.origin;
    var api_url = 'assets/json/doc_vil.json'
    if (this.appService.buildName === Build.Etisalat
      || this.appService.buildName === Build.Banglalink) { api_url = 'assets/json/doc_1.json'; }
    else if (this.appService.buildName === Build.Airtel
      || this.appService.buildName === Build.BSNL
      || this.appService.buildName === Build.Vil
      || this.appService.buildName === Build.Prutech) { api_url = 'assets/json/doc_vil.json' }
   // alert(api_url)
    this.http.get(api_url).subscribe((data: any) => {
      this.jsonToShow = data
      var oldJSON = data
      Object.keys(oldJSON.paths).map(data => {
        if (data.slice(0, 19) == "https://prutech.org") {
          var value = oldJSON.paths[data]
          var first = href;
          var second = data.slice(19, data.length);
          data = first + second;
          this.newJSON[data] = value;
        } else {
          this.newJSON[data] = oldJSON.paths[data]
        }
      })

      //AbsoluteUri = configuration["MailInfo:AbsoluteUri"];
      //AppName = configuration["MailInfo:AppName"];

      oldJSON.info.contact.name = Build[this.appService.buildName] + " Support team"
      oldJSON.info.contact.email = "asdadad@asdadsasds.in"
      oldJSON.info.contact.version = "1.0.0"

      this.jsonToShow = oldJSON
      this.jsonToShow.paths = this.newJSON;

    });
    if (this.appService.buildName === Build.Vil) {
      var element = document.getElementById('mainHeading')
      element.classList.add('mainHeader')
      // console.log(element, 'ele');
    }
    else if (this.appService.buildName === Build.Etisalat) {
      var element = document.getElementById('mainHeading')
      element.classList.remove('mainHeader')
    }
    this.initDocs();
  }

  initDocs() {
    setTimeout(() => {
      Redoc.init(this.jsonToShow, {
        scrollYOffset: 60,
        hideDownloadButton: true
      }, document.getElementById('redoc'))
    }, 200);
  }
}
