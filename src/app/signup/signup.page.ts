import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSelect, IonSelectOption]
})
export class SignupPage implements OnInit {
 
  signUpData = {
    name: '',
    email: '',
    role: '',
    password: '',
  };
  
  constructor(private router: Router) {}

  ngOnInit() {
    console.log("SignUp Page Initialized");
  }

  signUp() {
    console.log('User signed up:', this.signUpData);

    if (!this.signUpData.name || !this.signUpData.email || !this.signUpData.role || !this.signUpData.password) {
      console.error("All fields are required!");
      return;
    }

    // Redirect based on role selection
    if (this.signUpData.role === 'player') {
      this.router.navigate(['/tabs/player']);
    } else if (this.signUpData.role === 'coach') {
      this.router.navigate(['/tabs/coach']);
    }
  }
}
