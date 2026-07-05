import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';

export interface ToastRef {
  close: () => void;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private vcr!: ViewContainerRef;

  setViewContainerRef(vcr: ViewContainerRef) {
    this.vcr = vcr;
  }

  show(message: string, type: 'success' | 'error' | 'warning' = 'success', duration = 3000): void {
    // Fallback to native DOM toasts if no VCR is set
    if (!this.vcr) {
      this.nativeToast(message, type, duration);
      return;
    }
    // Dynamic component toast can be implemented here
    this.nativeToast(message, type, duration);
  }

  private nativeToast(message: string, type: string, duration: number): void {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons: Record<string, string> = {
      success: 'fa-check-circle',
      error: 'fa-times-circle',
      warning: 'fa-exclamation-circle',
    };
    const colors: Record<string, string> = {
      success: 'border-l-green-500',
      error: 'border-l-red-500',
      warning: 'border-l-amber-500',
    };
    const iconColors: Record<string, string> = {
      success: 'text-green-500',
      error: 'text-red-500',
      warning: 'text-amber-500',
    };

    const el = document.createElement('div');
    el.className = `toast-enter bg-base-card border border-base-border ${colors[type]} border-l-[3px] rounded-xl px-5 py-3.5 flex items-center gap-3 text-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-[280px] max-w-[400px]`;
    el.innerHTML = `<i class="fas ${icons[type]} ${iconColors[type]}"></i><span>${message}</span>`;
    container.appendChild(el);

    setTimeout(() => {
      el.classList.remove('toast-enter');
      el.classList.add('toast-exit');
      setTimeout(() => el.remove(), 300);
    }, duration);
  }
}