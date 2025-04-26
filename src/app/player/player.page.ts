import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonIcon, IonBadge, IonNote } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from './../services/player.service'; 
import Chart from 'chart.js/auto';
import { informationCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({
  'information-circle-outline': informationCircleOutline
});

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
  standalone: true,
  imports: [IonNote, IonBadge, IonIcon, IonText, 
    IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonInput, IonButton, IonLabel, IonItem,
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule
  ]
})
export class PlayerPage implements OnInit, AfterViewInit {
  @ViewChild('riskChart', { static: false }) riskChart!: ElementRef;
  playerId: string | null = null;
  player: any = null; 
  chart: any;

 
  calculatedRisk: string | null = null;

  constructor(private route: ActivatedRoute, private playerService: PlayerService) {
      addIcons({informationCircleOutline});}

 


  ngOnInit() {
    this.playerId = localStorage.getItem('userId');

    if (!this.playerId) {
      console.error('❌ No userId found in localStorage!');
      return;
    }
  
    console.log('✅ Player Page Loaded | userId:', this.playerId);
  
    this.playerService.getPlayer(this.playerId).subscribe(
      (data) => {
        this.player = data;
      },
      (error) => {
        console.error('❌ Failed to load player:', error);
      }
    );
  }





  ngAfterViewInit() {
    setTimeout(() => {
      if (this.player) {
        this.createChart();
      }
    }, 1000); // 1 second
  }
  
  createChart() {
    if (!this.riskChart?.nativeElement || !this.player?.riskScores?.length) {
      console.warn('⚠️ Chart skipped: Missing canvas or data.');
      return;
    }
  
    // Get the most recent 7 scores
    const recentScores = this.player.riskScores.slice(-7);
    const lastScore = recentScores[recentScores.length - 1];
  
    let borderColor = 'gray';
    let backgroundColor = 'rgba(128,128,128,0.2)';
  
    if (lastScore < 12) {
      borderColor = 'green';
      backgroundColor = 'rgba(0, 200, 0, 0.2)';
    } else if (lastScore < 18) {
      borderColor = 'orange';
      backgroundColor = 'rgba(255, 165, 0, 0.2)';
    } else {
      borderColor = 'red';
      backgroundColor = 'rgba(255, 0, 0, 0.2)';
    }
  
    // Destroy old chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }
  
    const ctx = this.riskChart.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: recentScores.map((_: any, i: number) => `Entry ${this.player.riskScores.length - recentScores.length + i + 1}`),
        datasets: [{
          label: `${this.player.name} - Risk Score History`,
          data: recentScores,
          borderColor,
          backgroundColor,
          borderWidth: 2,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  
    console.log('✅ Chart rendered with backend data');
  }
  
  
  

  trainingHistory: { date: string, duration: number, rpe: number, load: number }[] = [];


  session = {
    duration: 0,
    rpe: 0,
    hrv: null as number | null
  };


  submitSession() {
    if (this.session.rpe < 1 || this.session.rpe > 10) {
      alert('RPE must be between 1 and 10.');
      return;
    }
  
    const fakeDate = new Date();
  fakeDate.setDate(fakeDate.getDate() - this.trainingHistory.length * 7);
  const dateStr = fakeDate.toISOString().split('T')[0];
  const load = this.session.duration * this.session.rpe;

  this.trainingHistory.push({
    date: dateStr,
    duration: this.session.duration,
    rpe: this.session.rpe,
    load: load
  });

  console.log('New training entry:', this.trainingHistory);

  this.calculateRisk(); // includes chart + score logging

  // updated risk scores to backend
  if (this.player?._id && this.player.riskScores) {
    this.playerService.updatePlayerRiskScores(this.player._id, this.player.riskScores).subscribe({
      next: () => console.log('✅ Risk scores saved to backend'),
      error: err => console.error('❌ Failed to save risk scores:', err)
    });
  }
  
}
  

  calculateACWR() {
    const now = new Date();
  
    const last7Days = this.trainingHistory.filter(entry => {
      const date = new Date(entry.date);
      return (now.getTime() - date.getTime()) / (1000 * 3600 * 24) <= 7;
    });
  
    const last28Days = this.trainingHistory.filter(entry => {
      const date = new Date(entry.date);
      return (now.getTime() - date.getTime()) / (1000 * 3600 * 24) <= 28;
    });
  
    const acute = last7Days.reduce((sum, e) => sum + e.load, 0);
    const chronic = last28Days.reduce((sum, e) => sum + e.load, 0) / (last28Days.length || 1);
    const acwr = chronic > 0 ? acute / chronic : 0;
    
    console.log('ACWR:', acwr.toFixed(2));
  
    const latestRPE = this.session.rpe;
    const riskScore = (4 * acwr) + (2 * latestRPE);
  
    if (riskScore < 12) {
      this.calculatedRisk = 'Low';
    } else if (riskScore < 18) {
      this.calculatedRisk = 'Moderate';
    } else {
      this.calculatedRisk = 'High';
    }
  
    console.log('Risk Score:', riskScore.toFixed(2));

    this.session = {
      duration: 0,
      rpe: 0,
      hrv: null
    };
  }

  clampRPE() {
    if (this.session.rpe < 1) this.session.rpe = 1;
    if (this.session.rpe > 10) this.session.rpe = 10;
  }
  

  showInfo(field: string) {
    let message = '';
    switch (field) {
      case 'rpe':
        message = ` RPE (Rate of Perceived Exertion):

This is a scale from 1 to 10 that tells how intense the session felt **to you**.

- 1 = Very light (e.g., a slow walk)
- 5 = Moderate (e.g., a regular jog)
- 10 = Max effort (e.g., sprinting or intense lifting)

 RPE helps measure internal load. A higher RPE increases your injury risk if not managed properly.`;
        break;
      case 'duration':
        message = 'Duration in minutes of your training session.';
        break;
      case 'hrv':
        message = ` HRV (Heart Rate Variability):\nThis is optional but helps improve accuracy.\nA high HRV generally means you're well recovered.\nIf you don't provide HRV, the app still works but with slightly less precision.`;
        break;
    }
  
    alert(message);  
  }



  calculateRisk() {
  const rpe = this.session.rpe;
  const hrv = this.session.hrv;

  const now = new Date();
  const last7Days = this.trainingHistory.filter(entry => {
    const date = new Date(entry.date);
    return (now.getTime() - date.getTime()) / (1000 * 3600 * 24) <= 7;
  });

  const last28Days = this.trainingHistory.filter(entry => {
    const date = new Date(entry.date);
    return (now.getTime() - date.getTime()) / (1000 * 3600 * 24) <= 28;
  });

  const acute = last7Days.reduce((sum, e) => sum + e.load, 0);
  const chronic = last28Days.reduce((sum, e) => sum + e.load, 0) / (last28Days.length || 1);

  const acwr = chronic > 0 ? acute / chronic : 0;

  let riskScore: number;

  if (hrv !== null && !isNaN(hrv)) {
    const normalizedHRV = 100 - hrv;
    riskScore = (4 * acwr) + (2 * rpe) + (1.5 * normalizedHRV / 10);
  } else {
    riskScore = (4 * acwr) + (2 * rpe);
  }

  if (riskScore < 12) {
    this.calculatedRisk = 'Low';
  } else if (riskScore < 18) {
    this.calculatedRisk = 'Moderate';
  } else {
    this.calculatedRisk = 'High';
  }

  console.log('Risk Score:', riskScore.toFixed(2), '| Level:', this.calculatedRisk);

  // ad new risk score to the player's history
  if (!this.player.riskScores) {
    this.player.riskScores = [];
  }
  this.player.riskScores.push(Number(riskScore.toFixed(2)));

  // Re-draw the chart
  this.updateChart();
}



  updateChart() {
    if (!this.riskChart || !this.riskChart.nativeElement || !this.player?.riskScores?.length) return;

    const recentScores = this.player.riskScores.slice(-7);
    const lastScore = recentScores[recentScores.length - 1];
  
    let borderColor = 'gray';
    let backgroundColor = 'rgba(128,128,128,0.2)';
  
    if (lastScore < 12) {
      borderColor = 'green';
      backgroundColor = 'rgba(0, 200, 0, 0.2)';
    } else if (lastScore < 18) {
      borderColor = 'orange';
      backgroundColor = 'rgba(255, 165, 0, 0.2)';
    } else {
      borderColor = 'red';
      backgroundColor = 'rgba(255, 0, 0, 0.2)';
    }
  
    if (this.chart) {
      this.chart.destroy();
    }
  
    this.chart = new Chart(this.riskChart.nativeElement, {
      type: 'line',
      data: {
        labels: recentScores.map((_: number, i: number) => `Entry ${i + 1}`),
        datasets: [{
          label: `${this.player.name} - Risk Score History`,
          data: recentScores,
          borderColor,
          backgroundColor,
          borderWidth: 2,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
  

}

