import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditScoreComponent } from './credit-score/credit-score.component';
import { MasterCreateScoreComponent } from './master-create-score/master-create-score.component';

const routes: Routes = [
  { path:'creditscore', component: CreditScoreComponent},
  { path:'practiceRule/:id', component: CreditScoreComponent},
  { path:'mastercreditscore', component: MasterCreateScoreComponent},
  {path: '', redirectTo: "creditscore", pathMatch: 'full'},
  {path: '**', redirectTo: "creditscore", pathMatch: 'full'},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
