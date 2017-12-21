import { Component } from '@angular/core';
import { Router } from '@angular/router';


import { NavLink } from './models/ui/NavLink';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private authService: AuthService) {

  }

  get navLinks() {
    let links = [];
    if (this.authService.isLoggedIn()) {
      if (this.authService.isPerson()) {
        links.push(new NavLink("Profile", () => { this.router.navigate(["profile"]) }));
      }
      else {
        links.push(new NavLink("Org", () => { this.router.navigate(["organization"]) }));
      }
      links.push(new NavLink("Logout", () => { 
        this.authService.logout(); 
        this.router.navigate(["login"]);
      }));
    }
    else {
      links = [
        new NavLink("Login", () => { this.router.navigate(["login"]) }),
        new NavLink("Register", () => { this.router.navigate(["register"]) }),
      ];
    }



    return links;
  }
}
