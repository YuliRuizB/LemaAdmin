import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';
import { UsersService } from '../shared/services/usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  client: any[] = [];
  displayedColumns: string[] = ['claveAlumno', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'claveGrado', 'uid'];
  filterValue: string = '';
  ELEMENT_DATA: AlumnosTable[] = [];
  alumnoForm: FormGroup;
  grados: any[] = [];
  fileValue: any;
  imageUrl: any;
  dataSource1 = new MatTableDataSource<AlumnosTable>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private router: Router,
    public authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private storage: AngularFireStorage,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private usersService: UsersService) {

    this.authService.user.subscribe((user) => {
      this.user = user;
      if (this.user != null) {

        this.usersService.getClientInfo(this.user.claveCliente).subscribe((data1: any[]) => {
          this.client = data1;

          this.usersService.getAlumnosInfo(this.user.claveCliente).subscribe((data: any) => {
            this.ELEMENT_DATA = data;
            this.dataSource1 = new MatTableDataSource<AlumnosTable>(this.ELEMENT_DATA);
          });
          this.usersService.getGradesInfo(this.user.claveCliente, 10).subscribe(
            (data: any) => {
              this.grados = data;
            },
            (error) => {
              console.error('Error fetching grados:', error);
            }
          );
        });

      }
    });

    this.alumnoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      claveAlumno: ['', Validators.required],
      fechaNacimiento: [null, Validators.required],
      claveCliente: [''],
      claveGrado:[''],
      photoURL:[''],
      userId:['']
       
    });

  }

  submitForm() {
    if (this.alumnoForm.valid) {
      // Your logic to handle the submitted form     

      this.alumnoForm.controls['claveCliente'].setValue(this.user.claveCliente);

       console.log(this.alumnoForm.value);
      this.usersService.createStudent(this.alumnoForm.value).then((response: any) => {
        //console.log(response);
        this.notifyUser("Listo! El Alumno a sido  generado.", "info");

        this.uploadImage(response);
      }).catch(err => {
        console.log(err);
      });


    } else {
      // Handle form validation errors
      console.log('Form is invalid');
    }

  }
  borrarAlumno(id: any) {
    console.log("borrar usuario id" + id);
  }

  verAlumno(uid: any) {
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
    this.dataSource1.paginator = this.paginator;
  }
  redirectTo(place: string) {
    this.router.navigate([`/${place}`]);
  }
  configuracion() {
    //this.router.navigate([`/${place}`]);
  }
  applyFilter(event: any) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource1.filter = filterValue;

  }
  clearFilter(): void {
    this.dataSource1.filter = '';
  }

  private showNotification(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  private notifyUser(message: string, type: 'info' | 'error' | 'warning') {
    this.showNotification(message, type);
  }
  uploadImage(response: string) {
    const file = this.fileValue;//this.userForm.get('photoUrlInfo')?.value;    
    if (file) {
      const fileName = `${new Date().getTime()}_${file.name}`;
      const storageRef = this.storage.ref(`alumnos/${fileName}`);
      const uploadTask = storageRef.put(file);

      uploadTask.percentageChanges().subscribe(progress => {
        console.log(`Upload progress: ${progress}%`);
      });

      uploadTask.then(snapshot => snapshot.ref.getDownloadURL())
        .then(downloadURL => {
          console.log('File available at', downloadURL);

          // Update the correct field in the form
          const photoUrlControl = downloadURL; 
          if (photoUrlControl) {
            console.log("paso");
            //  this.alumnoForm.controls['photoUrl'].setValue("valor");
              console.log(response + downloadURL);
              this.usersService.updateAlumnoInfoByID(response, downloadURL);
          }
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        });
    }
  }
  handleFileInput(event: any) {
    const file = event.target.files[0];
    console.log(file);

    this.fileValue = file;

  }

}
export interface AlumnosTable {

  claveAlumno: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  claveGrado: string;
  uid: string;
}


