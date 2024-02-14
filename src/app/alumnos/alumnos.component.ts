import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';
import { UsersService } from '../shared/services/usuarios.service';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { usuariosTable } from '../usuarios/usuarios.component';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.scss']
})
export class AlumnosComponent implements OnInit {
  user: any;
  client:any[] =[];
  displayedColumns: string[] = ['uid','claveAlumno','nombre', 'apellidoPaterno', 'apellidoMaterno', 'claveGrado'];

  ELEMENT_DATA: AlumnosTable[] = [];
  dataSource = new MatTableDataSource<AlumnosTable>(this.ELEMENT_DATA);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private router: Router, 
    public authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private storage: AngularFireStorage,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private usersService: UsersService) { 

      this.authService.user.subscribe( (user) => {
        this.user = user;      
        if(this.user != null){
        
          this.usersService.getClientInfo(this.user.claveCliente).subscribe((data1: any[]) => {           
            this.client = data1;  
            
            this.usersService.getAlumnosInfo(this.user.claveCliente).subscribe((data: any) => {        
              this.ELEMENT_DATA = data;
        });   
      });
    }             
    });

    }
    borrarAlumno(id:any){    
      console.log("borrar usuario id" +id);
    }
  
    verAlumno(uid:any){  
      console.log("ver alumnos id" + uid);
      /* this.verAlumnosClicked = true;
      this.verUsuarioClicked = false; 
      
      this.usersService.getAlumnoInfo(uid).subscribe((data: any) => {       
        console.log(data); 
        this.Element_Data_Alumnos = data;
     });     */
    }
    
  ngOnInit(): void {
  }
  logout() { 
    this.authService.signOut();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  redirectTo(place:string){
    this.router.navigate([`/${place}`]);
  }
  configuracion(){
    //this.router.navigate([`/${place}`]);
  }
  applyFilter(event: any) {
    const filterValue = event.target.value;
    if (filterValue.length > 0){
        this.dataSource.filter = filterValue.trim().toLowerCase();
    } else {
      console.log(filterValue);
      console.log("filterValue");
    }
  
  }
  clearFilter(): void {
    this.dataSource.filter = '';
  }

  private showNotification(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  private notifyUser(message: string, type: 'info' | 'error' | 'warning') {
    this.showNotification(message, type);
  }


}
export interface AlumnosTable {
  uid:string;
  claveAlumno: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno:string;
  claveGrado:string;
}


