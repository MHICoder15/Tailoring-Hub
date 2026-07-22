import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-stats-widget',
  imports: [CommonModule],
  template: `
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4">Measurements</span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats?.totalMeasurements || 0 }}</div>
          </div>
          <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-pencil text-blue-500 text-xl!"></i>
          </div>
        </div>
        <span class="text-primary font-medium">Profiles&nbsp;</span>
        <span class="text-muted-color">Registered in Database</span>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4">Active Orders</span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats?.pendingOrders || 0 }}</div>
          </div>
          <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-shopping-bag text-cyan-500 text-xl!"></i>
          </div>
        </div>
        <span class="text-red-500 font-semibold">{{ stats?.urgentOrders || 0 }}&nbsp;</span>
        <span class="text-muted-color">Urgent Priority</span>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4">Revenue</span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">Rs. {{ stats?.totalRevenue | number: '1.0-0' }}</div>
          </div>
          <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-dollar text-orange-500 text-xl!"></i>
          </div>
        </div>
        <span class="text-primary font-medium">Rs. {{ stats?.totalCollected | number: '1.0-0' }}&nbsp;</span>
        <span class="text-muted-color">Payments Collected</span>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4">Outstanding</span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">Rs. {{ stats?.totalOutstanding | number: '1.0-0' }}</div>
          </div>
          <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-wallet text-purple-500 text-xl!"></i>
          </div>
        </div>
        <span class="text-primary font-medium">Uncollected&nbsp;</span>
        <span class="text-muted-color">Balance</span>
      </div>
    </div>
  `,
})
export class StatsWidget {
  @Input() stats: any = null;
}
