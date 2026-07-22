import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-order-status-widget',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card mb-0">
      <div class="flex items-center justify-between mb-6">
        <div class="font-semibold text-xl">Order Status Breakdown</div>
        <a routerLink="/orders" class="text-primary font-medium text-sm flex items-center gap-1.5 hover:underline cursor-pointer">
          View All
          <i class="pi pi-arrow-right text-xs"></i>
        </a>
      </div>

      <div class="flex flex-col gap-5">
        @for (item of statusList(); track item.status) {
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between text-sm font-semibold">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full inline-block" [ngClass]="item.dotClass"></span>
                <span class="text-surface-900 dark:text-surface-0 font-bold">{{ item.label }}</span>
              </div>
              <span class="text-surface-600 dark:text-surface-400 font-semibold">{{ item.count }}</span>
            </div>
            <div class="w-full bg-surface-100 dark:bg-surface-800 rounded-full h-2 overflow-hidden">
              <div [ngClass]="item.barClass" class="h-full rounded-full transition-all duration-500" [style.width.%]="item.percent"></div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class OrderStatusWidget {
  statusList = signal<any[]>([]);
  private _totalOrders = 0;

  @Input() set totalOrders(val: number) {
    this._totalOrders = val || 0;
    if (this.currentBreakdown) {
      this.buildStatusList(this.currentBreakdown);
    }
  }

  private currentBreakdown: any[] = [];

  @Input() set statusBreakdown(breakdown: any[]) {
    if (breakdown) {
      this.currentBreakdown = breakdown;
      this.buildStatusList(breakdown);
    }
  }

  buildStatusList(breakdown: any[]) {
    const statuses = [
      { status: 'PENDING', label: 'Pending', dotClass: 'bg-amber-500', barClass: 'bg-amber-500' },
      { status: 'IN_PROGRESS', label: 'In Progress', dotClass: 'bg-sky-500', barClass: 'bg-sky-500' },
      { status: 'COMPLETED', label: 'Completed', dotClass: 'bg-emerald-500', barClass: 'bg-emerald-500' },
      { status: 'DELIVERED', label: 'Delivered', dotClass: 'bg-slate-500', barClass: 'bg-slate-500' },
      { status: 'CANCELLED', label: 'Cancelled', dotClass: 'bg-red-500', barClass: 'bg-red-500' },
    ];

    // Compute total sum of all order statuses in the breakdown if _totalOrders is not provided
    const calculatedSum = breakdown.reduce((sum: number, b: any) => sum + (b.count || 0), 0);
    const total = this._totalOrders > 0 ? this._totalOrders : calculatedSum;

    const list = statuses.map((s) => {
      const found = breakdown.find((b: any) => b.status === s.status);
      const count = found ? found.count : 0;
      const percent = total > 0 ? Math.round((count / total) * 100) : 0;
      return {
        ...s,
        count,
        percent,
      };
    });

    this.statusList.set(list);
  }
}
