import { Component, OnInit,TemplateRef,ViewChild } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-credit-score',
  templateUrl: './credit-score.component.html',
  styleUrls: ['./credit-score.component.scss']
})
export class CreditScoreComponent implements OnInit {

  url:any = environment.decisionEngineUrl;

  nodeUrl:any =environment.nodeUrl;
  selSettingId : string = '';
  data:any = [];
  col_id:any = [];
  row_id:any = [];
  rows:any = {};
  grades:any = [];
  f1:any = {"gradeId":"-1","scoreId":"-1","incomeId":"-1"}
  f2:any = {}
  updateform:any=false;
  modalRef: BsModalRef;
  message:any = [];
  LoadRuleDescription_value:any = [];
  LoadRules_value:any = [];
  settingsRules_value:any = [];
  rulef_1:any = {}
  rulef_2:any = {}
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  offer_1:any = {"gradeId":"-1","offerlableid":"-1","offerValueId":"-1"}
  term_1:any = {"gradeId":"-1","termId":"-1"}
  offerlistids:any = [];
  termlist:any = [];
  termlistdata:any = [];
  offerlistvalues:any = {};
  offerupdateform:any=false;
  offerlistdata:any=[];
  apofferdata:any=[];
  apoffers:any={data:JSON.stringify({​​​​​​​
    "hardPull": false,
    "id": "1",
    "firstName": "Temekasdere",
    "middleName": "string",
    "lastName": "Adamserwe",
    "dateOfBirth": null,
    "address": {​​​​​​​
      "addressStatus": "",
      "houseNumber": "",
      "streetName": "8180 W Briarwood St Road",
      "streetType": "",
      "direction": "",
      "city": "Stanton California",
      "state": "CA",
      "zipCode": "90680"
    }​​​​​​​,
    "ssnNumber": "666603693",
    "income": 2000
  }​​​​​​​)}
  color = {
    a:"#00ffff",
    b:"#7fffd4",
    c:"#ffebcd",
    d:"#0000ff",
    e:"#8a2be2",
    f:"#a52a2a",
    g:"#deb887",
    h:"#5f9ea0",
    i:"#7fff00",
    j:"#d2691e",
    k:"#6495ed",
    l:"#fff8dc",
    m:"#dc143c",
    n:"#00ffff",
    o:"#008b8b",
    p:"#b8860b",
    q:"#a9a9a9",
    r:"#006400",
    s:"#a9a9a9",
    t:"#bdb76b",
    u:"#8b008b",
    v:"#556b2f",
    w:"#ff8c00",
    x:"#9932cc",
    y:"#8b0000",
    z:"#2f4f4f"
  };
  id : string = '';
  score2DEditData:any = {};
  @ViewChild('messagebox', { read: TemplateRef }) messagebox:TemplateRef<any>;
  @ViewChild('dialogupdate2DScore', { read: TemplateRef }) dialogupdate2DScore:TemplateRef<any>;
  constructor(private spinner: NgxSpinnerService,private http:HttpClient,private modalService: BsModalService,private route: ActivatedRoute, public router: Router,) {
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id != null && this.id){
      this.selSettingId = this.id;
      this.LoadRules(this.selSettingId);
    }else{
      this.getSettingsrules()
    }
   }

  ngOnInit(): void {
    // this.LoadRules()   
  }

  ngAfterViewInit(){

    let tab = sessionStorage.getItem("tab")
   if(tab){
     this.selectTab(+tab)
   }
    
  }

  number(data){
    return data.target.value = data.target.value.replace(/[^0-9.]/g,'')
  }

  get(url){
    let httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin','*')
    let options = {
        headers: httpHeaders
    };
     return this.http.get(this.url+url,options)
  }
  nodeGet(nodeUrl){
    let httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin','*')
    let options = {
        headers: httpHeaders
    };
     return this.http.get(this.nodeUrl+nodeUrl,options)
  }

  selectTab(tabId: number) {
    if (this.staticTabs?.tabs[tabId]) {
      this.staticTabs.tabs[tabId].active = true;
    }
    sessionStorage.removeItem("tab")
  }

  post(url,data){
    let httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin','*')
    let options = {
        headers: httpHeaders
    };
     return this.http.post(this.url+url,data,options)
  }

  // put(url,data){
  //   let httpHeaders = new HttpHeaders()
  //   .set('Content-Type', 'application/json')
  //   .set('Access-Control-Allow-Origin','*')
  //   let options = {
  //       headers: httpHeaders
  //   };
  //    return this.http.put(this.url+url,data,options)
  // }

  msg(msg){
    this.message = msg
    this.modalRef = this.modalService.show(this.messagebox);
  }

  close(): void {
    this.modalRef.hide();
  }

  getofferslist(){
    this.spinner.show()
    this.get(`/api/Offer/offers/${this.selSettingId}`).subscribe(res=>{
      this.offerlistids=res
      this.get(`/api/OfferValue/offerValues/${this.selSettingId}`).subscribe((res:any)=>{
        for (let i = 0; i < this.offerlistids.length; i++) {
          this.offerlistvalues[this.offerlistids[i]['id']]=[]
        }
        for (let i = 0; i < res.length; i++) {
          this.offerlistvalues[res[i]['offerId']].push(res[i])
        }
        this.spinner.hide()
      },err=>{
        this.spinner.hide()
        console.log(err)
      })
      
    },err=>{
      this.spinner.hide()
      console.log(err)
    })

    this.spinner.show()
    this.get(`/api/OfferGrade/offergrades/${Number(this.selSettingId)}`).subscribe((res:any)=>{
      this.spinner.hide()
      this.offerlistdata = res
      console.log(this.offerlistdata)
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }

  gettermlist(){
    this.spinner.show()
    this.get(`/api/Term/terms/${this.selSettingId}`).subscribe((res:any)=>{
      this.spinner.hide()
      this.termlist = res
      console.log(res)
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
    this.spinner.show()
    this.get(`/api/TermGrade/termGrades/${Number(this.selSettingId)}`).subscribe((res:any)=>{
      this.spinner.hide()
      this.termlistdata = res
      console.log(res)
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }


  getlist(){
    this.spinner.show()
    this.get(`/api/Score/scores/${this.selSettingId}`).subscribe(res=>{
      this.spinner.hide()
      let scores:any = res
      scores = scores.sort((a, b)=> b.fromScore-a.fromScore)
      for (let i = 0; i < scores.length; i++) {
        this.row_id.push({
          id:scores[i].id,
          value:scores[i].fromScore.toString()+"-"+scores[i].toScore.toString()
        })
      }
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
    this.spinner.show()
    this.get(`/api/Income/incomes/${this.selSettingId}`).subscribe(res=>{
      this.spinner.hide()
      let incomes:any = res
      incomes = incomes.sort((a, b)=> b.minIncome-a.minIncome);
      for (let i = 0; i < incomes.length; i++) {
        this.col_id.push({
          id:incomes[i].id,
          value:incomes[i].minIncome.toString()+"-"+incomes[i].maxIncome.toString()
        })
      }
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
    this.getdata()
  }


  getdata(){
    this.spinner.show();
    this.get(`/api/GradeAPR/gradeapr-details/${Number(this.selSettingId)}`).subscribe(res=>{
     this.data = res
     console.log(this.data)
     this.spinner.hide()
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }


  add(){
    this.spinner.show()
    let data = {}
    this.f1['scoreId'] = +this.f1['scoreId']
    this.f1['incomeId'] = +this.f1['incomeId']
    this.f1['gradeId'] = +this.f1['gradeId']
    if(this.f1['scoreId']>0){
      if(this.f1['incomeId']>0){
        if(this.f1['gradeId']>0){
          this.f1['apr'] = +this.f1['apr']
          data['scoreId'] = this.f1['scoreId']
          data['incomeId'] = this.f1['incomeId']
          data['apr'] = this.f1['apr']
          data['gradeId'] = this.f1['gradeId'];
          data['settingId'] = Number(this.selSettingId);
          this.post('/api/GradeAPR/add',data).subscribe(res=>{
            this.spinner.hide()
            sessionStorage.setItem("tab","1")
            // window.location.reload()
            this.callallApiCallBySettingId();
          },err=>{
            this.spinner.hide()
            console.log(err)
          })
        }else{
        this.spinner.hide()
        this.msg(["Please Select Grade"])
      }
        
      }else{
        this.spinner.hide()
        this.msg(["Please Select Income"])
      }
    }else{
      this.spinner.hide()
      this.msg(["Please Select Score"])
    }
  }
  deletegradeAprDetails(){
    this.spinner.show()
    this.post(`/api/GradeAPR/delete/${this.score2DEditData.id}`,{}).subscribe(res=>{
      this.spinner.hide()
      this.close();
      this.getdata();
    },err=>{
      this.spinner.hide()
      console.log(err)
    });
  }
  check(){
    let check = this.data
      this.f1['scoreId'] = +this.f1['scoreId']
      this.f1['incomeId'] = +this.f1['incomeId']
      this.f1['gradeId'] = +this.f1['gradeId']
    if(this.f1['scoreId']>0){
      if(this.f1['incomeId']>0){
          let j = 0;
        for (let i = 0; i < check.length; i++) {
          console.log(check[i]['apr'])
          if(check[i]['scoreId']==this.f1['scoreId'] && check[i]['incomeId']==this.f1['incomeId']){
            j=1;
            this.updateform = true
            this.f1["apr"] = check[i]['apr']
            this.f1["gradeId"] = check[i]['gradeId']
            this.f1["id"] = check[i]['id']
            i = check.length+1
          }else{
            this.updateform = false
            this.f1["apr"] = ''
          }
        }
        }else{
          this.updateform = false
        this.updateform = false
          this.f1["apr"] = ''
        }
        
       
       
     
    }else{
      this.updateform = false
      this.updateform = false
          this.f1["apr"] = ''
    }
  }

  put(url,data) {
    return this.http.put(this.url+url, data);
  }

  update(){
    this.f1['apr'] = +this.f1['apr']
    this.f1['gradeId'] = +this.f1['gradeId']
    this.spinner.show()
    this.put('/api/GradeAPR/update',this.f1).subscribe(res=>{
      this.spinner.hide()
      sessionStorage.setItem("tab","1")
      window.location.reload()
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }

  getGrades(){
    this.spinner.show()
    this.get(`/api/Grade/grades/${this.selSettingId}`).subscribe(res=>{     
      this.spinner.hide()
      this.grades = res;
      console.log('grades', this.grades);
    },err=>{
      this.spinner.hide()
      console.log(err)
    })    
  }



  setLoadRules_value(data,template: TemplateRef<any>){
    let selRule = {
      declinedif: "",
      description: "",
      disabled: '',
      id: 0,
      rule_id: 0,
      value: 0,
      passthru : ''
    };
    if(data.disabled==true){
      selRule.disabled = 't';
    }else{
      selRule.disabled = 'f'
    }
    if(data.passthru==true){
      selRule.passthru = 't';
    }else{
      selRule.passthru = 'f'
    }
    selRule.declinedif = data.declinedif;
    selRule.description = data.description;
    selRule.id = Number(data.id);
    selRule.rule_id = Number(data.rule_id);
    selRule.value = Number(data.value);
    this.rulef_2 = selRule;
    console.log(this.rulef_2);
    this.modalRef = this.modalService.show(template);
  }
  setLoadRuleDescription_value(){
    if(this.LoadRuleDescription_value.length>0){
      this.rulef_1.rule_id= this.LoadRuleDescription_value[0].id.toString()
    }
    this.rulef_1.declinedif='Greater than'
    this.rulef_1.value=0
    this.rulef_1.disabled='t'    
  }

  LoadRules(selSettingId){
    this.selSettingId = selSettingId;
    this.spinner.show();
    this.get(`/api/Rules/LoadRules/${selSettingId}`).subscribe(res=>{
     this.LoadRules_value = res;
     this.callallApiCallBySettingId();
     this.spinner.hide()
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }
  callallApiCallBySettingId(){
    this.col_id = [];
    this.row_id = [];
    this.getGrades();
    this.getofferslist();
    this.gettermlist();
    this.LoadRuleDescription();
    this.getlist();
  }
  getSettingsrules(){
    this.spinner.show();
    this.nodeGet('practicerules/getAllPracticeRules').subscribe(res=>{
      this.settingsRules_value = res['data']
      if(this.settingsRules_value.length > 0){
        this.LoadRules(this.settingsRules_value[0].ref_no);
        this.selSettingId = this.settingsRules_value[0].ref_no;
        // this.callallApiCallBySettingId();
      }
      
     // console.log()
      this.spinner.hide()
     },err=>{
       this.spinner.hide()
       console.log(err)
     })
  }
  

  LoadRuleDescription(){
    this.spinner.show();
    this.get('/api/Rules/LoadRuleDescription').subscribe(res=>{
     this.LoadRuleDescription_value = res
     this.setLoadRuleDescription_value()
     this.spinner.hide()
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }

  onSubmit(){
    this.spinner.show();
    let data = {
      "rule_id": Number(this.rulef_1.rule_id),
      "declinedif": this.rulef_1.declinedif,
      "value": Number(this.rulef_1.value)
    }
    if(this.rulef_1.disabled=='t'){
      data['disabled'] = true
    }else{
      data['disabled'] = false
    }
    this.post("/api/Rules/addRule",data).subscribe(res=>{
      this.spinner.hide()
      this.close()
      // this.LoadRules()
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }
  onSubmitScoreUpdate(){
    this.spinner.show();
    let data = {
      "id": this.score2DEditData.id,
      "scoreId": this.score2DEditData.scoreId,
      "incomeId": this.score2DEditData.incomeId,
      "gradeId": Number(this.score2DEditData.gradeId),
      "apr": Number(this.score2DEditData.apr)
    }
    this.post("/api/GradeAPR/update",data).subscribe(res=>{
      this.spinner.hide()
      this.close()
      this.getdata();
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }

  openaddproductrulemodal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }
  editDownPayment(data,template: TemplateRef<any>){
    this.score2DEditData = data;
    console.log(this.score2DEditData);
    this.modalRef = this.modalService.show(this.dialogupdate2DScore);  
  }
  onSubmit1(){
    // {
    //   "id": 0,
    //   "rule_id": 0,
    //   "declinedif": "string",
    //   "value": 0,
    //   "disabled": true,
    //   "setting_id": 0
    //"description": this.rulef_2.description,
    // }
    let data = 
      {
        "id": this.rulef_2.id,
        "rule_id": this.rulef_2.rule_id,
        "declinedif": this.rulef_2.declinedif,
        "value": Number(this.rulef_2.value),
        "disabled": (this.rulef_2.disabled=='t')?true : false,
        "setting_id": Number(this.selSettingId)
      }
    this.post(`/api/Rules/updateRule`,data).subscribe(res=>{
      this.spinner.hide()
      this.close()
      this.LoadRules(this.selSettingId)
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }


  addoffer(){
    this.spinner.show()

    // this.offer_1['offerValueId'] = +this.offer_1['offerValueId']
    // this.offer_1['minAPR'] = +this.offer_1['minAPR']
    // this.offer_1['maxAPR'] = +this.offer_1['maxAPR']
    // this.offer_1['gradeId'] = +this.offer_1['gradeId']
    // this.offer_1['avgAPR'] = +this.offer_1['avgAPR']
    let reqData = {"gradeId":Number(this.offer_1['gradeId']),"offerValueId":Number(this.offer_1['offerValueId']),"minAPR":Number(this.offer_1['minAPR']),"maxAPR":Number(this.offer_1['maxAPR']),"avgAPR":0,"settingId" : Number(this.selSettingId)}

    if(this.offer_1['gradeId']>0){
      if(this.offer_1['offerValueId']>0){
        // if(this.offer_1['minAPR']>0){
        //   if(this.offer_1['maxAPR']>0){
        //     if(this.offer_1['avgAPR']>0){
              this.post('/api/OfferGrade/add',reqData).subscribe(res=>{
                this.spinner.hide();
                this.getofferslist();
                this.offer_1['minAPR'] = '';
                this.offer_1['maxAPR'] = '';
                this.offer_1['avgAPR'] = '';
                console.log(this.offer_1);
                // sessionStorage.setItem("tab","2")
                // window.location.reload()
              },err=>{
                this.spinner.hide()
                console.log(err)
              })
        //     }else{
        //       this.spinner.hide()
        //       this.msg(["Please Enter AVG APR"])
        //     }
        //   }else{
        //     this.spinner.hide()
        //     this.msg(["Please Enter Max APR"])
        //   }
        // }else{
        //   this.spinner.hide()
        //   this.msg(["Please Enter Min APR"])
        // }
      }else{
        this.spinner.hide()
        this.msg(["Please Select Offer value"])
      }
    }else{
      this.spinner.hide()
      this.msg(["Please Select Grade"])
    }
  }

  offerDelete(data){
    this.spinner.show()
    this.post(`/api/OfferGrade/delete/${data.id}`,{}).subscribe(res=>{
      this.spinner.hide()
      this.getofferslist()
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }
  termsDelete(data){
    this.spinner.show()
    this.post(`/api/Term/delete/${data.id}`,{}).subscribe(res=>{
      this.spinner.hide()
      this.gettermlist();
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }
  addterm(){
    this.spinner.show()

    this.term_1['termId'] = +this.term_1['termId'];
    this.term_1['termDuration'] = +this.term_1['termDuration'];
    this.term_1['avgTermPayment'] = 0 // +this.term_1['avgTermPayment'];
    this.term_1['gradeId'] = +this.term_1['gradeId'];
    this.term_1['maxTermPayment'] = 0 // +this.term_1['maxTermPayment'];
    this.term_1['settingId'] = Number(this.selSettingId);

    if(this.term_1['gradeId']>0){
      if(this.term_1['termId']>0){
        this.post('/api/TermGrade/add',this.term_1).subscribe(res=>{
          this.spinner.hide()
          sessionStorage.setItem("tab","3");
          this.callallApiCallBySettingId();
          // window.location.reload()
        },err=>{
          this.spinner.hide()
          console.log(err)
        });
        // if(this.term_1['termDuration']>0){
        //   if(this.term_1['maxTermPayment']>0){
        //     if(this.term_1['avgTermPayment']>0){
        //       this.post('/api/TermGrade/add',this.term_1).subscribe(res=>{
        //         this.spinner.hide()
        //         sessionStorage.setItem("tab","3")
        //         window.location.reload()
        //       },err=>{
        //         this.spinner.hide()
        //         console.log(err)
        //       })
        //     }else{
        //       this.spinner.hide()
        //       this.msg(["Please Enter AVG Payment"])
        //     }
        //   }else{
        //     this.spinner.hide()
        //     this.msg(["Please Enter Max Payment"])
        //   }
        // }else{
        //   this.spinner.hide()
        //   this.msg(["Please Enter Duration"])
        // }
      }else{
        this.spinner.hide()
        this.msg(["Please Select Term"])
      }
    }else{
      this.spinner.hide()
      this.msg(["Please Select Grade"])
    }
  }
  


  getoffers(){
    this.spinner.show()
    this.post('/api/Decision/approvedOffers',JSON.parse(this.apoffers['data'])).subscribe(res=>{
      this.spinner.hide()
      this.apofferdata=res
      console.log(this.apofferdata)
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }


































  // add(){
  //   if(isNaN(Number(this.f1['toScore']))){
  //     this.f1['toScore'] = 0
  //   }
  //   if(isNaN(Number(this.f1['maxIncome']))){
  //     this.f1['maxIncome'] = 0
  //   }
  //   this.f1['fromScore'] = Number(this.f1['fromScore'])
  //   this.f1['toScore'] = Number(this.f1['toScore'])
  //   this.f1['maxIncome'] = Number(this.f1['maxIncome'])
  //   this.f1['minIncome'] = Number(this.f1['minIncome'])
  //   this.f1['apr'] = Number(this.f1['apr'])
  //   this.spinner.show();
  //   this.post('/api/Grade/add',this.f1).subscribe(res=>{
  //    this.spinner.hide()
  //    this.getdata()
  //   },err=>{
  //     this.spinner.hide()
  //     console.log(err)
  //   })
  // }

  // update(){
  //   if(isNaN(Number(this.f1['toScore']))){
  //     this.f1['toScore'] = 0
  //   }
  //   if(isNaN(Number(this.f1['maxIncome']))){
  //     this.f1['maxIncome'] = 0
  //   }
  //   this.f1['fromScore'] = Number(this.f1['fromScore'])
  //   this.f1['toScore'] = Number(this.f1['toScore'])
  //   this.f1['maxIncome'] = Number(this.f1['maxIncome'])
  //   this.f1['minIncome'] = Number(this.f1['minIncome'])
  //   this.f1['apr'] = Number(this.f1['apr'])
    

  //   this.spinner.show();
  //   this.put('/api/Grade/update',this.f1).subscribe(res=>{
  //    this.spinner.hide()
  //    this.getdata()
  //   },err=>{
  //     this.spinner.hide()
  //     console.log(err)
  //   })
  // }
  
  // getdata(){
  //   this.spinner.show();
  //   this.get('/api/Grade/grades').subscribe(res=>{
  //    this.data = res
  //    this.set()
  //    this.spinner.hide()
  //   },err=>{
  //     this.spinner.hide()
  //     console.log(err)
  //   })
  // }

  // set(){
  //   this.col_id = [];
  //   let key = [];
  //   let value = {};
  //   for (let i = 0; i < this.data.length; i++) {
  //     let a = "";
  //     let b = "";
  //     if(this.data[i]["minIncome"]){
  //       if(this.data[i]["maxIncome"]!=0 && this.data[i]["maxIncome"]!=null && this.data[i]["maxIncome"]!=""){
  //         a = this.data[i]["minIncome"].toString()+"-"+this.data[i]["maxIncome"].toString()
  //       }else{
  //         a = this.data[i]["minIncome"].toString()+"+"
  //       }
  //       b = this.data[i]["minIncome"]
  //     }
  //     if(!key.includes(b)){
  //       key.push(b)
  //       value[b]=a
  //     }
  //   }
  //   key = key.sort((a, b)=> b-a)
  //   for (let i = 0; i < key.length; i++) {
  //     this.col_id.push(value[key[i]])
  //   }
  //   this.row_id = [];
  //   key = [];
  //   value = {};
  //   for (let i = 0; i < this.data.length; i++) {
  //     let a = "";
  //     let b = "";
  //     if(this.data[i]["fromScore"]){
  //       if(this.data[i]["toScore"]!=0 && this.data[i]["toScore"]!=null && this.data[i]["toScore"]!=""){
  //         a = this.data[i]["fromScore"].toString()+"-"+this.data[i]["toScore"].toString()
  //       }else{
  //         a = this.data[i]["fromScore"].toString()+"+"
  //       }
  //       b = this.data[i]["fromScore"]
  //     }
  //     if(!key.includes(b)){
  //       key.push(b)
  //       value[b]=a
  //     }
  //   }
  //   key = key.sort((a, b)=> b-a)
  //   for (let i = 0; i < key.length; i++) {
  //     this.row_id.push(value[key[i]])
  //   }

  //   for (let i = 0; i < this.row_id.length; i++) {
  //     this.rows[this.row_id[i]] = {};
  //     for (let j = 0; j < this.col_id.length; j++) {
  //       this.rows[this.row_id[i]][this.col_id[j]] = {"gradeValue":"","apr":""}
  //     }
  //   }

  //   for (let i = 0; i < this.data.length; i++) {
  //     let a = "";
  //     let b = "";
  //     if(this.data[i]["fromScore"]){
  //       if(this.data[i]["toScore"]!=0 && this.data[i]["toScore"]!=null && this.data[i]["toScore"]!=""){
  //         a = this.data[i]["fromScore"].toString()+"-"+this.data[i]["toScore"].toString()
  //       }else{
  //         a = this.data[i]["fromScore"].toString()+"+"
  //       }
  //     }
  //     if(this.data[i]["minIncome"]){
  //       if(this.data[i]["maxIncome"]!=0 && this.data[i]["maxIncome"]!=null && this.data[i]["maxIncome"]!=""){
  //         b = this.data[i]["minIncome"].toString()+"-"+this.data[i]["maxIncome"].toString()
  //       }else{
  //         b = this.data[i]["minIncome"].toString()+"+"
  //       }
  //     }
  //     this.rows[a][b]["gradeValue"] = this.data[i]["gradeValue"]
  //     this.rows[a][b]["apr"] = this.data[i]["apr"]
  //     this.rows[a][b]["index"] = i
  //   }
  // }

 
 

}
