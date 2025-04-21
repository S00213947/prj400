import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-select',
  templateUrl: './role-select.page.html',
  styleUrls: ['./role-select.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, CommonModule, FormsModule]
})
export class RoleSelectPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('You are on the role-select page');

  }

  selectRole(role: 'player' | 'coach') {
    localStorage.setItem('userRole', role);
    console.log(`[RoleSelectPage] Role selected: ${role}`);
    console.log('[RoleSelectPage] localStorage value:', localStorage.getItem('userRole'));
    
    const targetRoute = '/tabs/profile';
    if (this.router.url !== targetRoute) {
      this.router.navigate([targetRoute]);
  }
}
}
