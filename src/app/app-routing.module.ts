import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileComponent} from "./profile/profile.component";
import {ChartComponent} from "./chart/chart.component";

const routes: Routes = [
  {path:'profile' , component:ProfileComponent , title:'Profile'},
  {path:'chart' , component:ChartComponent , title:'AMChart'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
