import { Component, OnInit, TemplateRef,ViewChild } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-master-create-score',
  templateUrl: './master-create-score.component.html',
  styleUrls: ['./master-create-score.component.scss']
})
export class MasterCreateScoreComponent implements OnInit {
  url:any = environment.decisionEngineUrl;//"https://de-businesswarrior.alchemylms.com"
  nodeUrl:any =environment.nodeUrl;
  selSettingId : string = '';
  settingsRules_value:any = [];
  scores:any = [];
  incomes:any = [];
  offers:any = [];
  offerValues:any = [];
  grades:any = [];
  terms:any = [];

  f1:any = {};
  f2:any = {};
  f3:any = {};
  offerlistids:any = [];

  offerAddForm:any = {};
  offerEditForm:any = {};

  offerValueAddForm:any = {offerId:'-1'};
  offerValueEditForm:any = {};

  termAddForm:any = {};
  termEditForm:any = {};

  gradeAddForm:any = {};

  a_z:any = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
  modalRef: BsModalRef;
  message:any = [];
  scoreeditid = -1;
  gradeeditid = -1;
  incomeeditid = -1;
  offerEditId = -1;
  offerValueEditId = -1;
  termEditId = -1;
  @ViewChild('messagebox', { read: TemplateRef }) messagebox:TemplateRef<any>;
 
  constructor(private spinner: NgxSpinnerService,private http:HttpClient,private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getSettingsrules()
    // this.getofferslist();
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
  callallApiCallBySettingId(){
    // this.col_id = [];
    // this.row_id = [];
    this.getlist();
    this.getOffer();
    this.getGrades();
    this.getOfferValue();
    this.getTerm();
  }
  getSettingsrules(){
    this.spinner.show();
    this.nodeGet('practicerules/getAllPracticeRules').subscribe(res=>{
      this.settingsRules_value = res['data'];
      if(this.settingsRules_value.length > 0){
        this.selSettingId = this.settingsRules_value[0].ref_no;
        this.callallApiCallBySettingId();
        // this.callallApiCallBySettingId();
      }
      
     // console.log()
      this.spinner.hide()
     },err=>{
       this.spinner.hide()
       console.log(err)
     })
  }
  changeSettingName(selSettingId){
    this.selSettingId = selSettingId;
    this.callallApiCallBySettingId();
  }
  getofferslist(scoreres : any = []){
    this.spinner.show()
    this.get(`/api/Offer/offers/${this.selSettingId}`).subscribe(res=>{
      this.offerlistids=res;
      let offerlist = this.offerlistids;
      let scoreList = [];
      for(let i=0;i<scoreres.length;i++){
        let filterOfferByValue = offerlist.filter(data=>{
          return data.offerLabel == scoreres[i].offerLabel;
        });
        if(filterOfferByValue.length >0){
          scoreres[i].offerId = Number(filterOfferByValue[0].id);
          scoreres[i].offerLabel = Number(filterOfferByValue[0].offerLabel);
          scoreList.push(scoreres[i]);
        }else{
          scoreres[i].offerId = 0;
          scoreres[i].offerLabel = 0;
          scoreList.push(scoreres[i]);
        }
      }
      
      // this.scores = res;
      this.scores = scoreList.sort((a, b)=> b.fromScore-a.fromScore);
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
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

  getlist(){
    this.spinner.show()
    this.get(`/api/Score/scores/${this.selSettingId}`).subscribe(res=>{
      this.spinner.hide()
      this.getofferslist(res);
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
    this.spinner.show()
    this.get(`/api/Income/incomes/${this.selSettingId}`).subscribe(res=>{
      this.spinner.hide()
      this.incomes = res
      this.incomes = this.incomes.sort((a, b)=> b.minIncome-a.minIncome)
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }

  number(data){
    return data.target.value = data.target.value.replace(/[^0-9.]/g,'')
  }


  addscore(){
   
    this.spinner.show()
    this.f1['fromScore'] = +this.f1['fromScore']
    this.f1['toScore'] = +this.f1['toScore']
    if(this.f1['fromScore']<this.f1['toScore']){
      let j = 0;
      for (let i = 0; i < this.scores.length; i++) {
        if(this.scores[i]['fromScore']==this.f1['fromScore'] && this.scores[i]['toScore']==this.f1['toScore']){
          j = 1;
          i = this.scores.length+1;
        }       
      }
      if(j==1){
        this.spinner.hide()
        this.msg(["From Score: "+this.f1['fromScore'],"To Score: "+this.f1['toScore'],"Already Exists..."])
      }else{
        this.f1['settingId'] = Number(this.selSettingId);
        this.post("/api/Score/add",this.f1).subscribe(res=>{
          this.spinner.hide()
          window.location.reload()
        },err=>{
          this.spinner.hide()
          console.log(err)
        })
      }
    }else{
      this.spinner.hide()
      this.msg(["From Score < To Score","Ex: 100 < 150","Please Check Your Value"])
    }  
  }


  addincome(){
    this.spinner.show()
    this.f1['minIncome'] = +this.f1['minIncome']
    this.f1['maxIncome'] = +this.f1['maxIncome']
    if(this.f1['minIncome']<this.f1['maxIncome']){
      let j = 0;
      for (let i = 0; i < this.incomes.length; i++) {
        if(this.incomes[i]['minIncome']==this.f1['minIncome'] && this.incomes[i]['maxIncome']==this.f1['maxIncome']){
          j = 1;
          i = this.incomes.length+1;
        }       
      }
      if(j==1){
        this.spinner.hide()
        this.msg(["Min Income: "+this.f1['minIncome'],"Max Income: "+this.f1['maxIncome'],"Already Exists..."])
      }else{
        this.f1['settingId'] = Number(this.selSettingId);
        this.post("/api/Income/add",this.f1).subscribe(res=>{
          this.spinner.hide()
          window.location.reload()
        },err=>{
          this.spinner.hide()
          console.log(err)
        })
      }
    }else{
      this.spinner.hide()
      this.msg(["Min Income < Max Income","Ex: 100 < 150","Please Check Your Value"])
    }  
  }

  msg(msg){
    this.message = msg
    this.modalRef = this.modalService.show(this.messagebox);
  }

  close(): void {
    this.modalRef.hide();
  }

  scoreedit(d){
    this.f2 = d;
    this.scoreeditid = d.id;
  }
  gradeEdit(d){
    this.f3 = d;
    this.gradeeditid = d.id;
  }
  gradeeditcolse(){
    this.gradeeditid = -1;
  }
  scoreeditcolse(){
    this.scoreeditid = -1
    this.incomeeditid = -1
  }

  updatesocre(){
    this.spinner.show();
    this.f2.offerId = Number(this.f2.offerId);
    this.f2['fromScore'] = +this.f2['fromScore']
    this.f2['toScore'] = +this.f2['toScore']
    if(this.f2['fromScore']<this.f2['toScore']){
      let j = 0;
      for (let i = 0; i < this.scores.length; i++) {
        if(this.scores[i]['fromScore']==this.f2['fromScore'] && this.scores[i]['toScore']==this.f2['toScore'] && this.scores[i]['id']!=this.f2['id']){
          j = 1;
          i = this.scores.length+1;
        }       
      }
      if(j==1){
        this.spinner.hide()
        this.msg(["From Score: "+this.f2['fromScore'],"To Score: "+this.f2['toScore'],"Already Exists..."])
      }else{
        this.f2['settingId'] = Number(this.selSettingId);
        this.post("/api/Score/update",this.f2).subscribe(res=>{
          this.spinner.hide()
          this.scoreeditid = -1
          this.incomeeditid = -1
          this.getlist()
        },err=>{
          this.spinner.hide()
          console.log(err)
        })
      }
    }else{
      this.spinner.hide()
      this.msg(["From Score < To Score","Ex: 100 < 150","Please Check Your Value"])
    }
  }

  updategrade(){
    this.spinner.show();
    this.f2.id = Number(this.f3.id);
    this.f3['settingId'] = Number(this.selSettingId);
    this.post("/api/Grade/update",this.f3).subscribe(res=>{
      this.spinner.hide()
      this.gradeeditcolse();
      this.getGrades();
    },err=>{
      this.spinner.hide()
      console.log(err)
    });
  }
  
  gradeDelete(d){
    this.spinner.show()
    this.post(`/api/Grade/delete/${d.id}`,{}).subscribe(res=>{
      this.spinner.hide()
      this.getGrades()
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }
  
  scoredelete(d){
    this.spinner.show()
    this.post("/api/Score/delete/"+d.id,{}).subscribe(res=>{
      this.spinner.hide()
      this.getlist()
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }

  incomeedit(d){
    this.f2 = d;
    this.incomeeditid = d.id;
  }

  incomeeditcolse(){
    this.incomeeditid = -1
    this.scoreeditid = -1
    
  }

  updateincome(){
    this.spinner.show()
    this.f2['minIncome'] = +this.f2['minIncome']
    this.f2['maxIncome'] = +this.f2['maxIncome']
    if(this.f2['minIncome']<this.f2['maxIncome']){
      let j = 0;
      for (let i = 0; i < this.incomes.length; i++) {
        if(this.incomes[i]['minIncome']==this.f2['minIncome'] && this.incomes[i]['maxIncome']==this.f2['maxIncome'] && this.incomes[i]['id']!=this.f2['id']){
          j = 1;
          i = this.incomes.length+1;
        }       
      }
      if(j==1){
        this.spinner.hide()
        this.msg(["Min Income: "+this.f2['minIncome'],"Max Income: "+this.f2['maxIncome'],"Already Exists..."])
      }else{
        this.f2['settingId'] = Number(this.selSettingId);
        this.post("/api/Income/update",this.f2).subscribe(res=>{
          this.spinner.hide()
          this.scoreeditid = -1
          this.incomeeditid = -1
          this.getlist()
        },err=>{
          this.spinner.hide()
          console.log(err)
        })
      }
    }else{
      this.spinner.hide()
      this.msg(["Min Income < Max Income","Ex: 100 < 150","Please Check Your Value"])
    }  
  }

 incomedelete(d){
    this.spinner.show()
    this.post("/api/Income/delete/"+d.id,{}).subscribe(res=>{
      this.spinner.hide()
      this.getlist()
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }

  addOffer(){   
    this.spinner.show()   

    let j = 0;
    for (let i = 0; i < this.offers.length; i++) {      
      if(this.offers[i]['offerLabel']==this.offerAddForm['offerLabel']){
        j = 1;
        break;
      }       
    }   

    if(j==1){
      this.spinner.hide()
      this.msg(["Offer Name: "+this.offerAddForm['offerLabel'],"Already Exists..."])
    }else{    
      this.offerAddForm['settingId'] = Number(this.selSettingId);
      this.post("/api/Offer/add",this.offerAddForm).subscribe(res=>{
        this.spinner.hide()
        // window.location.reload()
        this.getOffer();
      },err=>{
        this.spinner.hide()
        console.log(err)
      })  
    }   
  }

  getOffer(){
    this.spinner.show()
    this.get(`/api/Offer/offers/${this.selSettingId}`).subscribe(res=>{     
      this.spinner.hide()
      this.offers = res
      this.offers = this.offers.sort((a, b)=> a.id-b.id)
      console.log('offers', this.offers);
    },err=>{
      this.spinner.hide()
      console.log(err)
    })    
  }

  offerEdit(d){
    this.offerEditForm = d;
    this.offerEditId = d.id;
  }  

  offerEditClose(){
    this.offerEditId = -1
  }

  updateOffer(){
    this.spinner.show()
    this.offerEditForm['amount'] = Number(this.offerEditForm['amount']);
    
    let j = 0;
    for (let i = 0; i < this.offers.length; i++) {      
      if(this.offers[i]['offerLabel']==this.offerEditForm['offerLabel'] && this.offers[i]['id']!=this.offerEditForm['id']){
        j = 1;
        break;
      }       
    }  
    
    if(j==1){
      this.spinner.hide()
      this.msg(["Offer Name: "+this.offerEditForm['offerLabel'],"Already Exists..."])
    }else{    
      this.offerEditForm['settingId'] = Number(this.selSettingId);
      this.post("/api/Offer/update",this.offerEditForm).subscribe(res=>{
        this.spinner.hide()
        this.offerEditId = -1
        this.getOffer()
      },err=>{
        this.spinner.hide()
        console.log(err)
      })
    }  
  }

  offerDelete(d){
    this.spinner.show()
    this.post("/api/Offer/delete/"+d.id,{}).subscribe(res=>{
      this.spinner.hide()
      this.getOffer()
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }

  getOfferValue(){
    this.spinner.show()
    this.get(`/api/OfferValue/offerValues/${this.selSettingId}`).subscribe(res=>{     
      this.spinner.hide()
      this.offerValues = res
      this.offerValues = this.offerValues.sort((a, b)=> a.id-b.id)
      console.log('offerValues', this.offerValues);
    },err=>{
      this.spinner.hide()
      console.log(err)
    })    
  }

  addOfferValue(){
    this.spinner.show()  
    if(this.offerValueAddForm['offerId']>0){
      let lv_offerLable;

      let j = 0;
      for (let i = 0; i < this.offerValues.length; i++) {      
        if(this.offerValues[i]['offerId']==this.offerValueAddForm['offerId'] && this.offerValues[i]['value']==this.offerValueAddForm['value']){
          j = 1;
          lv_offerLable = this.offerValues[i]['offerLabel'];
          break;
        }       
      }   

      if(j==1){
        this.spinner.hide()      
        this.msg(["Offer Name: "+lv_offerLable,"Value: "+this.offerValueAddForm['value'],"Already Exists..."])
      }else{    
        this.offerValueAddForm['offerId'] = Number(this.offerValueAddForm['offerId'])
        this.offerValueAddForm['settingId'] = Number(this.selSettingId);
        this.post("/api/OfferValue/add",this.offerValueAddForm).subscribe(res=>{
          this.spinner.hide()
          window.location.reload()
        },err=>{
          this.spinner.hide()
          console.log(err)
        })  
      }   
    }else{
      this.spinner.hide()
      this.msg(["Please Select Offer"])
    }
  }

  offerValueEdit(d){
    this.offerValueEditForm = d;
    this.offerValueEditId = d.id;
  }  

  offerValueEditClose(){
    this.offerValueEditId = -1
  }

  updateOfferValue(){
    this.spinner.show()
    
    if(this.offerValueEditForm['offerId']>0){
      let j = 0;
      for (let i = 0; i < this.offerValues.length; i++) {      
        if(this.offerValues[i]['offerId']==this.offerValueEditForm['offerId'] 
          && this.offerValues[i]['value']==this.offerValueEditForm['value']
          && this.offerValues[i]['id']!=this.offerValueEditForm['id']){
          j = 1;
          break;
        }       
      }  
      
      if(j==1){
        this.spinner.hide()
        this.msg(["Offer Name: "+this.offerValueEditForm['offerLabel'],"Value: "+this.offerValueEditForm['value'],"Already Exists..."])
      }else{    
        this.offerValueEditForm['offerId'] = Number(this.offerValueEditForm['offerId']);
        this.offerValueEditForm['settingId'] = Number(this.selSettingId)
        this.post("/api/OfferValue/update",this.offerValueEditForm).subscribe(res=>{
          this.spinner.hide()
          this.offerValueEditId = -1
          this.getOfferValue()
        },err=>{
          this.spinner.hide()
          console.log(err)
        })
      }
    }else{
      this.spinner.hide()
      this.msg(["Please Select Offer"])
    }  
  }

  offerValueDelete(d){
    this.spinner.show()
    this.post("/api/OfferValue/delete/"+d.id,{}).subscribe(res=>{
      this.spinner.hide()
      this.getOfferValue()
    },err=>{
      this.spinner.hide()
      console.log(err)
    })
  }

  getTerm(){
    this.spinner.show()
    this.get(`/api/Term/terms/${this.selSettingId}`).subscribe(res=>{     
      this.spinner.hide()
      this.terms = res
      this.terms = this.terms.sort((a, b)=> a.id-b.id)
      console.log('terms', this.terms);
    },err=>{
      this.spinner.hide()
      console.log(err)
    })    
  }

  addTerm(){
    this.spinner.show()   

    let j = 0;
    for (let i = 0; i < this.terms.length; i++) {      
      if(this.terms[i]['description']==this.termAddForm['description']){
        j = 1;
        break;
      }       
    }   

    if(j==1){
      this.spinner.hide()
      this.msg(["Term Name: "+this.termAddForm['description'],"Already Exists..."])
    }else{ 
      this.termAddForm['settingId'] = Number(this.selSettingId);   
      this.post("/api/Term/add",this.termAddForm).subscribe(res=>{
        this.spinner.hide();
        this.getTerm();
        // window.location.reload()
      },err=>{
        this.spinner.hide()
        console.log(err)
      })  
    }
  }

  termEdit(d){
    this.termEditForm = d;
    this.termEditId = d.id;
  }  

  termEditClose(){
    this.termEditId = -1
  }

  updateTerm(){
    this.spinner.show()    
   
    let j = 0;
    for (let i = 0; i < this.terms.length; i++) {      
      if(this.terms[i]['description']==this.termEditForm['description'] 
        && this.terms[i]['id']!=this.termEditForm['id']){
        j = 1;
        break;
      }       
    }  
    
    if(j==1){
      this.spinner.hide()
      this.msg(["Term Name: "+this.termEditForm['description'],"Already Exists..."])
    }else{      
      this.termEditForm['settingId'] = Number(this.selSettingId);     
      this.post("/api/Term/update",this.termEditForm).subscribe(res=>{
        this.spinner.hide()
        this.termEditId = -1
        this.getTerm()
      },err=>{
        this.spinner.hide()
        console.log(err)
      })
    }    
  }

  termDelete(d){
    this.spinner.show()
    this.post("/api/Term/delete/"+d.id,{}).subscribe(res=>{
      this.spinner.hide()
      this.getTerm()
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

  addGrade(){   
    this.spinner.show()   

    let j = 0;
    for (let i = 0; i < this.grades.length; i++) {      
      if(this.grades[i]['description']==this.gradeAddForm['description']){
        j = 1;
        break;
      }       
    }   

    if(j==1){
      this.spinner.hide()
      this.msg(["Grade: "+this.gradeAddForm['description'],"Already Exists..."])
    }else{   
      this.gradeAddForm['settingId'] = Number(this.selSettingId); 
      this.post("/api/Grade/add",this.gradeAddForm).subscribe(res=>{
        this.spinner.hide()
        window.location.reload()
      },err=>{
        this.spinner.hide()
        console.log(err)
      })  
    }   
  }

}
