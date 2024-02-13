import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './default/menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';


const routes: Routes = [
  {
    path: 'menu',
    component: MenuComponent,
  },
  {
    path: 'menu/default',
    component: MenuComponent,
  },
  {
    path: 'user',
    component: MenuComponent,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AngularFireAuthGuard],
  exports: [RouterModule],
})
export class MenuRoutingModule { }
