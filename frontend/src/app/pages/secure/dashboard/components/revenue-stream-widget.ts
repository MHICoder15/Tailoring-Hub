import { afterNextRender, Component, effect, inject, Input, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { LayoutService } from '@/app/layout/service/layout.service';

@Component({
  standalone: true,
  selector: 'app-revenue-stream-widget',
  imports: [ChartModule, CommonModule],
  template: `
    <div class="card mb-8!">
      <div class="flex items-center justify-between mb-4">
        <div class="font-semibold text-xl">Revenue Stream & Receivables</div>
      </div>

      <div class="grid grid-cols-12 gap-6">
        <!-- Bar Chart -->
        <div class="col-span-12 lg:col-span-7">
          <p class="text-sm text-muted-color mb-3 font-semibold">Weekly Order Activity</p>
          <p-chart type="bar" [data]="chartData()" [options]="chartOptions()" class="h-80" />
        </div>

        <!-- Donut Chart for Receivables Breakdown -->
        <div class="col-span-12 lg:col-span-5 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-surface-200 dark:border-surface-700 pt-4 lg:pt-0 lg:pl-6">
          <p class="text-sm text-muted-color mb-3 font-semibold w-full text-left">Receivables Breakdown</p>
          @if (doughnutData()) {
            <p-chart type="doughnut" [data]="doughnutData()" [options]="doughnutOptions()" class="h-64 w-full" />
          }
        </div>
      </div>
    </div>
  `
})
export class RevenueStreamWidget {
  layoutService = inject(LayoutService);

  ordersByDaySignal = signal<any[]>([]);
  statsSignal = signal<any>(null);

  chartData = signal<any>(null);
  chartOptions = signal<any>(null);
  doughnutData = signal<any>(null);
  doughnutOptions = signal<any>(null);

  @Input() set ordersByDay(data: any[]) {
    if (data) {
      this.ordersByDaySignal.set(data);
      this.initChart();
    }
  }

  @Input() set stats(data: any) {
    if (data) {
      this.statsSignal.set(data);
      this.initDoughnut();
    }
  }

  constructor() {
    afterNextRender(() => {
      setTimeout(() => {
        this.initChart();
        this.initDoughnut();
      }, 150);
    });

    effect(() => {
      this.layoutService.layoutConfig().darkTheme;
      setTimeout(() => {
        this.initChart();
        this.initDoughnut();
      }, 150);
    });
  }

  initChart() {
    const orders = this.ordersByDaySignal();
    if (!orders || orders.length === 0) return;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
    const borderColor = documentStyle.getPropertyValue('--surface-border') || '#dee2e6';
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';

    const labels = orders.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });
    const collectedData = orders.map((d) => d.collected || 0);
    const outstandingData = orders.map((d) => d.outstanding || 0);

    this.chartData.set({
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: 'Collected Payments',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-400') || '#34D399',
          data: collectedData,
          barThickness: 24,
        },
        {
          type: 'bar',
          label: 'Outstanding Balance',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-200') || '#A7F3D0',
          data: outstandingData,
          borderRadius: {
            topLeft: 8,
            topRight: 8,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: false,
          barThickness: 24,
        },
      ],
    });

    this.chartOptions.set({
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textMutedColor,
          },
          grid: {
            color: 'transparent',
            borderColor: 'transparent',
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: textMutedColor,
          },
          grid: {
            color: borderColor,
            borderColor: 'transparent',
            drawTicks: false,
          },
        },
      },
    });
  }

  initDoughnut() {
    const s = this.statsSignal();
    if (!s) return;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';

    this.doughnutData.set({
      labels: ['Collected Payments', 'Outstanding Balance'],
      datasets: [
        {
          data: [s.totalCollected || 0, s.totalOutstanding || 0],
          backgroundColor: ['#10B981', '#F43F5E'],
          hoverBackgroundColor: ['#059669', '#E11D48'],
        },
      ],
    });

    this.doughnutOptions.set({
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            usePointStyle: true,
          },
        },
      },
    });
  }
}
