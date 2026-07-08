import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ButtonModule, TooltipModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h5>Demo</h5>
      </div>
      <div class="card-body">
        <p>Welcome to the UI Demo page!</p>
        <div class="button-grid">
          @for (item of routes; track $index) {
            <p-button [label]="item.label" [icon]="item.icon" [severity]="getSeverity($index)" (onClick)="navigateTo(item.path)"></p-button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .button-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
  `]
})
export class DemoComponent implements OnInit {
  routes = [
    { path: 'ui-demo/button', label: 'Button', icon: 'pi pi-box' },
    { path: 'ui-demo/charts', label: 'Charts', icon: 'pi pi-chart-bar' },
    { path: 'ui-demo/file', label: 'File', icon: 'pi pi-file' },
    { path: 'ui-demo/formlayout', label: 'Form Layout', icon: 'pi pi-th-large' },
    { path: 'ui-demo/input', label: 'Input', icon: 'pi pi-pencil' },
    { path: 'ui-demo/list', label: 'List', icon: 'pi pi-list' },
    { path: 'ui-demo/media', label: 'Media', icon: 'pi pi-image' },
    { path: 'ui-demo/message', label: 'Message', icon: 'pi pi-comment' },
    { path: 'ui-demo/misc', label: 'Misc', icon: 'pi pi-cog' },
    { path: 'ui-demo/panel', label: 'Panel', icon: 'pi pi-window-maximize' },
    { path: 'ui-demo/timeline', label: 'Timeline', icon: 'pi pi-clock' },
    { path: 'ui-demo/table', label: 'Table', icon: 'pi pi-table' },
    { path: 'ui-demo/overlay', label: 'Overlay', icon: 'pi pi-clone' },
    { path: 'ui-demo/tree', label: 'Tree', icon: 'pi pi-sitemap' },
    { path: 'ui-demo/menu', label: 'Menu', icon: 'pi pi-bars' }
  ];

  constructor(private router: Router) { }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  getSeverity(index: number): ButtonSeverity {
    const severities: ButtonSeverity[] = ['success', 'info', 'warn', 'danger', 'help', 'primary', 'secondary', 'contrast'];
    return severities[index % severities.length];
  }

  ngOnInit() {
  }

}
