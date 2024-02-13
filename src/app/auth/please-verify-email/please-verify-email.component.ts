import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-please-verify-email',
  templateUrl: './please-verify-email.component.html',
  styleUrls: ['./please-verify-email.component.scss']
})
export class PleaseVerifyEmailComponent implements OnInit {

  constructor( public authService: AuthenticationService) { }

  ngOnInit(): void {
  }

}
