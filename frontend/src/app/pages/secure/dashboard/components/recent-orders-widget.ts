import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ORDER_STATUSES, getStatusStyle } from '@/app/core/models/order.model';

@Component({
  standalone: true,
  selector: 'app-recent-orders-widget',
  imports: [CommonModule, RouterLink, TagModule, ButtonModule],
  template: `
    <div class="card mb-8!">
      <div class="flex items-center justify-between mb-6">
        <div class="font-semibold text-xl">Recent Orders</div>
        <a routerLink="/orders" class="text-primary font-medium text-sm flex items-center gap-1.5 hover:underline cursor-pointer">
          View All
          <i class="pi pi-arrow-right text-xs"></i>
        </a>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-surface-200 dark:border-surface-700">
              <th class="py-3 px-2 font-bold text-surface-900 dark:text-surface-0 text-sm">Order #</th>
              <th class="py-3 px-2 font-bold text-surface-900 dark:text-surface-0 text-sm">Customer</th>
              <th class="py-3 px-2 font-bold text-surface-900 dark:text-surface-0 text-sm">Delivery Date</th>
              <th class="py-3 px-2 font-bold text-surface-900 dark:text-surface-0 text-sm">Status</th>
              <th class="py-3 px-2 font-bold text-surface-900 dark:text-surface-0 text-sm">Notify</th>
            </tr>
          </thead>
          <tbody>
            @for (order of orders || []; track order._id; let isLast = $last) {
              <tr [class.border-b]="!isLast" [class.border-surface-200]="!isLast" [class.dark:border-surface-700]="!isLast">
                <td class="py-3.5 px-2">
                  <p-tag [value]="order.orderNumber" [rounded]="true" severity="success"></p-tag>
                </td>
                <td class="py-3.5 px-2 font-bold text-surface-900 dark:text-surface-0 text-sm">
                  {{ order.measurementId?.name || '-' }}
                </td>
                <td class="py-3.5 px-2 text-surface-600 dark:text-surface-300 text-sm">
                  {{ order.expectedDeliveryDate | date: 'dd/MM/yyyy' }}
                </td>
                <td class="py-3.5 px-2">
                  <p-tag
                    [value]="getStatusLabel(order.status)"
                    [ngStyle]="getStatusStyle(order.status)"
                    styleClass="font-bold text-xs px-3 py-1 rounded-md border-0"
                  ></p-tag>
                </td>
                <td class="py-3.5 px-2">
                  <button
                    pButton
                    type="button"
                    icon="pi pi-whatsapp"
                    class="p-button-rounded p-button-success p-button-text p-button-sm"
                    (click)="sendWhatsAppNotify(order)"
                    title="Send WhatsApp Update to Customer"
                  ></button>
                </td>
              </tr>
            }
            @if (!orders || orders.length === 0) {
              <tr>
                <td colspan="5" class="text-center py-6 text-slate-400">No orders placed yet.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class RecentOrdersWidget {
  @Input() orders: any[] = [];
  getStatusStyle = getStatusStyle;

  getStatusLabel(status: string): string {
    const found = ORDER_STATUSES.find((s) => s.key === status);
    return found ? found.value : status;
  }

  sendWhatsAppNotify(order: any): void {
    const phone = order.measurementId?.phoneNumber || '';
    const name = order.measurementId?.name || 'Customer';
    const statusLabel = this.getStatusLabel(order.status);
    const message = `Hello ${name}, your tailoring order ${order.orderNumber} status is currently "${statusLabel}". Thank you for choosing Tailoring Hub!`;

    // Strip non-numeric characters
    let cleanPhone = phone.replace(/\D/g, '');

    // Format local Pakistani numbers starting with 0 (e.g., 03001234567 -> 923001234567)
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '92' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('92') && cleanPhone.length === 10) {
      cleanPhone = '92' + cleanPhone;
    }

    const encodedText = encodeURIComponent(message);
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
      : `https://api.whatsapp.com/send?text=${encodedText}`;

    window.open(url, '_blank');
  }
}
