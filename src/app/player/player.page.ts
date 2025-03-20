import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from './../services/player.service'; // ✅ Import PlayerService
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
  standalone: true,
  imports: [
    IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonInput, IonButton, IonLabel, IonItem,
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule
  ]
})
export class PlayerPage implements OnInit, AfterViewInit {
  @ViewChild('riskChart', { static: false }) riskChart!: ElementRef;
  playerId: number | null = null;
  player: any = null; // ✅ Now fetched from API
  chart: any;

  trainingData = {
    hours: 0,
    recoveryTime: 0,
  };
  calculatedRisk: string | null = null;

  constructor(private route: ActivatedRoute, private playerService: PlayerService) {}

  ngOnInit() {
    this.playerId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.playerId) {
      this.playerService.getPlayer(this.playerId).subscribe(
        (data) => {
          this.player = data;
          console.log('Fetched player:', this.player);
        },
        (error) => {
          console.error('Error fetching player:', error);
        }
      );
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.player) {
        this.createChart();
      }
    }, 300); // ✅ Ensures canvas is ready
  }

  createChart() {
    if (!this.riskChart || !this.riskChart.nativeElement) {
      console.error("Canvas element not found!");
      return;
    }

    console.log("Rendering chart for player:", this.player.name);
    console.log("Risk scores:", this.player.riskScores || []);

    this.chart = new Chart(this.riskChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        datasets: [{
          label: `${this.player.name} - Risk Score History`,
          data: this.player.riskScores || [], // ✅ Use fetched risk scores
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
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

  updateTrainingData(field: 'hours' | 'recoveryTime', event: any) {
    this.trainingData[field] = +event.target.value;
  }

  calculateRisk() {
    const { hours, recoveryTime } = this.trainingData;

    console.log('Training Hours:', hours);
    console.log('Recovery Time:', recoveryTime);

    if (hours < 5 && recoveryTime > 8) {
      this.calculatedRisk = 'Low';
    } else if (hours >= 5 && hours <= 8 && recoveryTime >= 5) {
      this.calculatedRisk = 'Moderate';
    } else {
      this.calculatedRisk = 'High';
    }

    console.log('Calculated Risk:', this.calculatedRisk);
  }
}
