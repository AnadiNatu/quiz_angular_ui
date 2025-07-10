import { Component, OnInit } from '@angular/core';
import { ResultDTO } from '../../models/admin-dtos';
import { ActivatedRoute } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-user-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-user-result.component.html',
  styleUrl: './all-user-result.component.css'
})
export class AllUserResultComponent implements OnInit{
  quizTitle: string = '';
  result: ResultDTO[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminServiceService
  ) {}

  ngOnInit(): void {
    this.quizTitle = this.route.snapshot.paramMap.get('quizTitle') || '';
    if (this.quizTitle) {
      this.adminService.getAllUserResults(this.quizTitle).subscribe({
        next: (res) => {
          this.result = res;
          this.loading = false;
        },
        error: () => {
          this.error = '❌ Failed to load result';
          this.loading = false;
        }
      });
    }
  }
}
