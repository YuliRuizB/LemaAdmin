import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginFormValue = { username: '', password: '', claveCliente: '' };

  constructor(private router: Router, private fb: FormBuilder, 
    private authService: AuthenticationService) {

    console.log("here");
    }
  ngOnInit(): void {
   
  }

  login() {
     this.authService.signIn( this.loginFormValue.username,
        this.loginFormValue.password,
        this.loginFormValue.claveCliente); 

  }

  
}
