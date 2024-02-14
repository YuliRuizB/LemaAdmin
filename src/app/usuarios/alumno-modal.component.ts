import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '../shared/services/usuarios.service';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-alumno-modal',
  templateUrl: './alumno-modal.component.html'
})
export class AlumnoModalComponent implements OnInit{
    searchForm: FormGroup;
    grados: any[] = []; // You need to replace 'any[]' with the actual type of your grado objects
    alumnos: any[] = []; // You need to replace 'any[]' with the actual type of your alumno objects
    user: any;

  constructor(
    private fb: FormBuilder,
    public authService: AuthenticationService,
    private usersService:UsersService,
    public dialogRef: MatDialogRef<AlumnoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {    
    this.searchForm = this.fb.group({
        grado: [''],
        alumno: ['']
      });
  }
  ngOnInit(): void {
    // Fetch grados from Firebase
    this.authService.user.subscribe((user) => {
        if (user) {
          this.user = user;
       //   console.log(this.user);
    
          this.usersService.getGradesInfo(this.user.claveCliente, 10).subscribe(
            (data: any) => {
              this.grados = data;
            },
            (error) => {
              console.error('Error fetching grados:', error);
            }
          );
        }
      });
    
  }

  onGradoSelected(): void {
    const selectedGradoId = this.searchForm.get('grado')?.value;

    console.log(selectedGradoId);
    console.log(this.user.claveCliente);
    
    this.usersService.getAlumnosByGrade(this.user.claveCliente,selectedGradoId ).subscribe((data: any) => {  
        this.alumnos = data;
        console.log(data);
      });
  }
  onSave(): void {
    // Add your save logic here
    const selectedAlumnoId = this.searchForm.get('alumno')?.value;
    console.log("save");
console.log(selectedAlumnoId);

    this.usersService.updateStudentUser(selectedAlumnoId, this.user.uid);
    // Close the modal after saving
    this.dialogRef.close();
  }

  onClose(): void {
    // Close the modal without saving
    this.dialogRef.close();
  }
}