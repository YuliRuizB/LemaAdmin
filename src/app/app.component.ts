import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'LEMA';

  constructor(private router: Router) { 
    console.log("app.component.");
  }

  redirectTo(place:string){
    this.router.navigate([`/${place}`]);
  }
  
}
