import { Component ,ViewChild,ElementRef,Input,ViewContainerRef,ComponentRef} from "@angular/core";
import { PropertyBindingService } from "./propertyBinding.service";
import { WpbotsaysComponent } from "./propertyComponents/wpBotSays/wpbotsays.component";
import { WpbotasksComponent } from "./propertyComponents/wpBotAsks/wpbotasks.component";
import { DefaultComponent } from "./propertyComponents/default/default.component";
import { WebhookComponent } from "./propertyComponents/webhook/webhook.component";
import { ConditionsComponent } from "./propertyComponents/conditions/conditions.component";
import { LiveAgentsComponent } from "./propertyComponents/live-agents/live-agents.component";



@Component ({
  selector : 'property-builder',
  templateUrl:'./propertybuilder.component.html',
  styleUrls:["./propertybuilder.component.css"]
})

export class PropertyComponent{

  @Input() node :string;    //!getitng nodename from parent component / used for storing nodeName from services
  @Input() showProperty : string; //!getting propertyWIndow to be show/hide from parent component

  // @ViewChild('side') dropDivRef: ElementRef;
  // dropDivElement: HTMLElement;
  // @ViewChild('arrowDiv') arrowDivRef: ElementRef;
  // arrowDivElement : HTMLElement;

  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;   //!VCR is used for creating dynamic component
  componentsRef = Array<ComponentRef<any>>()  //!array used for storing component while creating

  left = true;
  show =false;

  constructor(private service :PropertyBindingService){
    this.service.propertyShow.subscribe((property:string)=>{      //!getting property window show/hide value from service
      this.showProperty = property;
      this.ngOnChanges()
    })
  }

  ngOnInit(){
    this.service.dynamicSubject.subscribe((data)=>{ //!getting nodeName and callig specific function to create that object property dynamically
      this.node = data
      if(this.node == "Bot Says" || this.node == "wpBotSays"){
        this.createSaysComponent()
      }else if(this.node == "Bot Asks" || this.node == "wpBotAsk"){
        this.createAskComponent()
      }else if(this.node == "Webhook" || this.node =="webhook"){
        this.createWebhookComponent()
      }
      else if(this.node == "Conditions" || this.node == "conditions"){
        this.createConditions()
      }else if(this.node == "liveAgent" || this.node == "liveAgent"){
        this.createLiveAgent()
      }
      else{
        this.createDefaultComponent() //!now an Empty DIv
      }
    })
  }

  ngOnChanges(){  //!propertywindow show/hide by changes in the DOM
    if(this.showProperty === 'true'){
      this.show = true;
      try{
        // this.arrowDivElement = this.arrowDivRef.nativeElement;
        // this.arrowDivElement.style.visibility = 'hidden';
      }catch(err){}
    }else{
      this.show = false;
      this.left= true;
      try{
        // this.arrowDivElement = this.arrowDivRef.nativeElement;
        // this.arrowDivElement.style.visibility = 'visible';
      }catch(err){}
    }
  }

  propertyShow() {
    this.show = true;
    // this.arrowDivElement = this.arrowDivRef.nativeElement;
    // this.arrowDivElement.style.visibility = 'hidden'
  }
  propertyHide(){
    this.show = false;
    this.left= true;
    // this.arrowDivElement = this.arrowDivRef.nativeElement;
    // this.arrowDivElement.style.visibility = 'visible';
    try{
      var temp = document.getElementsByClassName('selected');
      // console.log(temp)
      temp[0].classList.remove('selected');
    }catch(err){

    }
    this.service.propertyShow.next("false")
  }
      //!specific function for each component for creating components in  propertywindow
  createSaysComponent(){
    this.remove()
    this.componentsRef = Array<ComponentRef<WpbotsaysComponent>>()
    // let componentFactory = this.CFR.resolveComponentFactory(WpbotsaysComponent);
    // this.VCR.createComponent(componentFactory)
    this.VCR.createComponent(WpbotsaysComponent)
  }
  createAskComponent(){
    this.remove()
    this.componentsRef = Array<ComponentRef<WpbotasksComponent>>()
    // let componentFactory = this.CFR.resolveComponentFactory(WpbotasksComponent);
    // this.VCR.createComponent(componentFactory)
    this.VCR.createComponent(WpbotasksComponent)
  }
  createConditions(){
    this.remove()
    this.componentsRef = Array<ComponentRef<ConditionsComponent>>()
    this.VCR.createComponent(ConditionsComponent)
  }
  createLiveAgent(){
    this.remove()
    this.componentsRef = Array<ComponentRef<LiveAgentsComponent>>()
    this.VCR.createComponent(LiveAgentsComponent)
  }
  createWebhookComponent(){
    this.remove()
    this.componentsRef = Array<ComponentRef<WebhookComponent>>()
    this.VCR.createComponent(WebhookComponent)
  }
  createDefaultComponent(){
    this.remove()
    this.componentsRef = Array<ComponentRef<DefaultComponent>>()
    // let componentFactory = this.CFR.resolveComponentFactory(DefaultComponent);
    // this.VCR.createComponent(componentFactory)
    this.VCR.createComponent(DefaultComponent)
  }
  remove(){   //!components in the array removed when new component push
    if (this.VCR.length < 1) return;
    this.componentsRef.forEach((value, index) => {
      this.componentsRef.splice(index, 1);
    });
    this.VCR.remove();
  }

}
