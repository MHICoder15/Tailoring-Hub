import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-recent-measurement-widget',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card mb-8!">
      <div class="flex items-center justify-between mb-6">
        <div class="font-semibold text-xl">Recent Measurements</div>
        <a routerLink="/measurement" class="text-primary font-medium text-sm flex items-center gap-1.5 hover:underline cursor-pointer">
          View All
          <i class="pi pi-arrow-right text-xs"></i>
        </a>
      </div>

      <div class="flex flex-col">
        @for (m of measurements || []; track m._id; let isLast = $last) {
          <div class="flex items-center justify-between py-3.5" [class.border-b]="!isLast" [class.border-surface-200]="!isLast" [class.dark:border-surface-700]="!isLast">
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <span class="font-bold text-surface-900 dark:text-surface-0 text-base">{{ m.name }}</span>
                <span class="bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 text-xs font-semibold px-2 py-0.5 rounded-md">
                  {{ m.bookingNumber }}
                </span>
              </div>
              <span class="text-surface-500 text-sm font-normal">{{ m.phoneNumber }}</span>
            </div>

            <div class="flex flex-col items-end gap-1">
              <span class="font-bold text-surface-900 dark:text-surface-0 text-base">Rs. {{ m.totalCost | number: '1.0-0' }}</span>
              <span class="text-surface-500 text-sm font-normal">{{ m.dateOfBooking | date: 'dd/MM/yyyy' }}</span>
            </div>
          </div>
        }
        @if (!measurements || measurements.length === 0) {
          <div class="text-center py-6 text-slate-400">No measurements recorded yet.</div>
        }
      </div>
    </div>
  `,
})
export class RecentMeasurementsWidget {
  @Input() measurements: any[] = [];
}
