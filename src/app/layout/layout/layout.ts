import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../security/themeService/theme-service';
import { Adminservice } from '../../security/service/adminservice';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  menu_visable: boolean = false;
  isDarkMode:boolean= false;
  private router = inject(Router);
  private adminService = inject(Adminservice);
  constructor(private themeService: ThemeService) {}

  toggleMode() {
    this.themeService.toggleMode();
    this.isDarkMode = !this.isDarkMode;
  }

  menuVisable() {
    this.menu_visable = !this.menu_visable;
    console.log(this.menu_visable);
  }

  logout() {
    localStorage.removeItem('Token');
    localStorage.removeItem('isAdmin');
    
    this.router.navigate(['/']);
    alert('Logout Successful');
  }
  
}