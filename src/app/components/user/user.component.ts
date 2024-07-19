import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';

interface Workout {
  type: string;
  minutes: number;
}

interface UserData {
  id: number;
  name: string;
  workouts: Workout[];
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'], // Fixed typo from styleUrl to styleUrls
})
export class UserComponent implements OnInit {
  user: UserData | null = null;
  basicData: any;
  basicOptions: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
    this.initializeChart();
  }

  private loadUserData(): void {
    const username = this.router.url.split('/')[1];
    const userData: UserData[] = JSON.parse(localStorage.getItem('userData') || '[]');
    this.user = userData.find(user => user.name === username) || null;
    console.log(this.user);
  }

  private initializeChart(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color').trim();
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary').trim();
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border').trim();

    if (this.user) {
      this.basicData = {
        labels: this.user.workouts.map(workout => workout.type),
        datasets: [
          {
            label: 'Minutes',
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1,
            data: this.user.workouts.map(workout => workout.minutes),
          },
        ],
      };
    }

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
}
