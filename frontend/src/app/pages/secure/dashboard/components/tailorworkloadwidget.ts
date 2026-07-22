import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-tailor-workload-widget',
  imports: [CommonModule],
  template: `
    <div class="card mb-0">
      <div class="flex items-center justify-between mb-4">
        <div class="font-semibold text-xl">Tailor Workload</div>
        <span class="text-xs text-muted-color">Active production assignments</span>
      </div>

      <div class="flex flex-col gap-3">
        @for (item of tailorWorkload || []; track item.tailorName) {
          <div class="flex items-center justify-between text-sm py-1 border-b border-surface-100 dark:border-surface-800 last:border-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {{ item.tailorName.slice(0, 1).toUpperCase() }}
              </div>
              <span class="font-medium text-surface-900 dark:text-surface-0 text-base">{{ item.tailorName }}</span>
            </div>
            <span class="bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 font-bold px-3 py-1 rounded-full text-xs">{{ item.count }} active orders</span>
          </div>
        }
        @if (!tailorWorkload || tailorWorkload.length === 0) {
          <div class="text-xs text-muted-color py-4 text-center">No active tailor assignments.</div>
        }
      </div>
    </div>
  `,
})
export class TailorWorkloadWidget {
  @Input() tailorWorkload: any[] = [];
}
