import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
  selector: 'app-explore',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'], // Fixed typo from styleUrl to styleUrls
})
export class ExploreComponent implements OnInit {
  filterForm = new FormGroup({
    name: new FormControl(''),
    type: new FormControl('All'),
  });

  userData: UserData[] = [];

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    const storedData = localStorage.getItem('userData');
    this.userData = storedData ? JSON.parse(storedData) : [];
  }

  getWorkoutTypes(workouts: Workout[]): string {
    return workouts.map(workout => workout.type).join(', ');
  }

  getTotalMinutes(workouts: Workout[]): number {
    return workouts.reduce((total, workout) => total + workout.minutes, 0);
  }

  filteredUserData(): UserData[] {
    const { name, type } = this.filterForm.value;
    return this.userData.filter(user => 
      (!name || user.name.toLowerCase().includes(name.toLowerCase())) &&
      (type === 'All' || user.workouts.some(workout => workout.type === type))
    );
  }

  // Pagination
  currentPage = 1;
  itemsPerPage = 2;

  get totalPages(): number {
    return Math.ceil(this.filteredUserData().length / this.itemsPerPage);
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  changeItemsPerPage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(selectElement.value, 10);
  }

  get paginatedData(): UserData[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUserData().slice(startIndex, startIndex + this.itemsPerPage);
  }
}
