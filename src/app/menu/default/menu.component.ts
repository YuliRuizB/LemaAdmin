import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UsersService } from 'src/app/shared/services/usuarios.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  user: any;
  client:any[] =[];

  constructor(private router: Router, 
    public authService: AuthenticationService,
    private usersService: UsersService) { 

      this.authService.user.subscribe( (user) => {
        this.user = user;      
        if(this.user != null){
        
          this.usersService.getClientInfo(this.user.claveCliente).subscribe((data1: any[]) => {           
            this.client = data1;         
        });   
        }                
    });

    }
  ngOnInit(): void {
  }

  redirectTo(place:string){
    this.router.navigate([`/${place}`]);
  }
  
  logout() { 
    this.authService.signOut();
  }

}
