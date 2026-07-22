import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { StatsService } from '@/app/core/services/stats.service';
import { StatsWidget } from './components/stats-widget';
import { RecentOrdersWidget } from './components/recent-orders-widget';
import { RecentMeasurementsWidget } from './components/recent-measurements-widget';
import { RevenueStreamWidget } from './components/revenue-stream-widget';
import { OrderStatusWidget } from './components/order-status-widget';
import { TailorWorkloadWidget } from './components/tailorworkloadwidget';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, SelectModule, FormsModule, StatsWidget, RecentOrdersWidget, RecentMeasurementsWidget, RevenueStreamWidget, OrderStatusWidget, TailorWorkloadWidget],
  template: `
    <div class="flex flex-col gap-6">
      <!-- Dashboard Top Header Bar with Controls -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-0 m-0">Dashboard</h3>
          <p class="text-surface-500 text-sm m-0">Real-time tailoring workshop analytics and production controls</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Date Filter Dropdown -->
          <p-select [options]="rangeOptions" [(ngModel)]="selectedRange" (onChange)="onRangeChange()" optionLabel="label" optionValue="value" placeholder="Select Range" class="w-40"></p-select>

          <!-- Quick Action Buttons -->
          <button pButton label="New Measurement" icon="pi pi-user-plus" class="p-button-primary p-button-sm" routerLink="/measurement"></button>
          <button pButton label="New Order" icon="pi pi-plus" class="p-button-primary p-button-sm" routerLink="/orders"></button>
        </div>
      </div>

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-12 gap-8">
        <app-stats-widget [stats]="stats()" class="contents" />
        <div class="col-span-12 xl:col-span-6">
          <app-recent-orders-widget [orders]="stats()?.recentOrders" />
          <app-recent-measurement-widget [measurements]="stats()?.recentMeasurements" />
          <app-tailor-workload-widget [tailorWorkload]="stats()?.tailorWorkload" />
        </div>
        <div class="col-span-12 xl:col-span-6">
          <app-revenue-stream-widget [ordersByDay]="stats()?.ordersByDay" [stats]="stats()" />
          <app-order-status-widget [statusBreakdown]="stats()?.statusBreakdown" [totalOrders]="stats()?.totalOrders" />
        </div>
      </div>
    </div>
  `,
})
export class Dashboard implements OnInit {
  statsService = inject(StatsService);
  stats = signal<any>(null);

  selectedRange = 'all';
  rangeOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'This Month', value: 'month' },
    { label: 'This Week', value: 'week' },
    { label: 'Today', value: 'today' },
  ];

  ngOnInit() {
    this.loadStats();
  }

  loadStats(forceRefresh: boolean = false) {
    this.statsService.getStats(this.selectedRange, forceRefresh).subscribe({
      next: (resp) => {
        if (resp && resp.data) {
          this.stats.set(resp.data);
        }
      },
      error: (err) => console.error('Error fetching dashboard stats:', err),
    });
  }

  onRangeChange() {
    this.loadStats(true);
  }
}
