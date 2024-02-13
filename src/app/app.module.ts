import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/default/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AlumnosComponent } from './alumnos/alumnos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ReportesAlumnosComponent } from './reportes-alumnos/reportes-alumnos.component';
import { PagosComponent } from './pagos/pagos.component';
import { ProductosComponent } from './productos/productos.component';
import { PromocionesComponent } from './promociones/promociones.component';
import { ReportesAdministracionComponent } from './reportes-administracion/reportes-administracion.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { SalonesComponent } from './salones/salones.component';
import { MaestrosComponent } from './maestros/maestros.component';
import { ReportesSalonesComponent } from './reportes-salones/reportes-salones.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoginComponent } from './auth/login/login.component';
import { PleaseVerifyEmailComponent } from './auth/please-verify-email/please-verify-email.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { NzResultModule } from 'ng-zorro-antd/result';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthenticationService } from './shared/services/authentication.service';
import { NzBreadCrumbModule, NzNotificationModule, NzNotificationService } from 'ng-zorro-antd';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonLayoutComponent } from './menu/common-layout/common-layout.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { ThemeConstantService } from './shared/services/theme-constant.service';
import { AngularFireStorage } from '@angular/fire/storage';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AlumnosComponent,
    UsuariosComponent,
    ReportesAlumnosComponent,
    PagosComponent,
    ProductosComponent,
    PromocionesComponent,
    ReportesAdministracionComponent,
    NotificacionesComponent,
    SalonesComponent,
    MaestrosComponent,
    ReportesSalonesComponent,   
    LoginComponent,  
    PleaseVerifyEmailComponent,
    CommonLayoutComponent,
    VerifyEmailComponent

  ],
  imports: [
    BrowserModule,
    MatSliderModule,
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    NzBreadCrumbModule,
    RouterModule,
    AngularFirestoreModule,
    
    ReactiveFormsModule,
    AngularFireModule,
    NzInputModule,
    NzFormModule, 
    FormsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatTabsModule,
    MatDatepickerModule,
    NzNotificationModule,
    MatNativeDateModule,
    MatMenuModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MatTableModule,
    MatToolbarModule,
    NzResultModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    NzDropDownModule,
    MatSnackBarModule, 
    NzMenuModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [AuthenticationService,
    ThemeConstantService,
    AngularFireStorage,
     NzNotificationService,AngularFireAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
