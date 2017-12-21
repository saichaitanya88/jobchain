import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { CredentialsModel } from '../../models/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials: CredentialsModel = new CredentialsModel();

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) 
      this.redirectToHomepage();
  }

  login() {
    this.authService.login(this.credentials).subscribe(result => {
      if (result) {
        this.redirectToHomepage()
      }
    });
  }

  redirectToHomepage() {
    if (this.authService.isPerson())
      this.router.navigate(["profile"]);
    else
      this.router.navigate(["organization"]);
  }
}
