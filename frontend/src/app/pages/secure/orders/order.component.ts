import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

import { OrderService } from '@/app/core/services/order.service';
import { MeasurementService } from '@/app/core/services/measurement.service';
import { Order, ORDER_STATUSES, ORDER_PRIORITIES, OrderStatus, OrderPriority, getStatusStyle } from '@/app/core/models/order.model';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    ConfirmDialogModule,
    ToastModule,
    ToggleSwitchModule,
    TooltipModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  ordersList = signal<Order[]>([]);
  measurementsList = signal<any[]>([]);
  loading = signal<boolean>(false);
  selectedOrderForInvoice = signal<Order | null>(null);

  orderDialog: boolean = false;
  deleteOrderDialog: boolean = false;
  submitted: boolean = false;
  editingId: string | null = null;

  orderForm!: FormGroup;

  orderStatuses = ORDER_STATUSES;
  orderPriorities = ORDER_PRIORITIES;

  selectedStatusFilter: string = '';

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private measurementService: MeasurementService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadOrders();
    this.loadMeasurements();
  }

  initForm(): void {
    this.orderForm = this.fb.group({
      orderNumber: [{ value: '', disabled: true }, [Validators.required]],
      measurementId: ['', [Validators.required]],
      status: ['PENDING', [Validators.required]],
      priority: ['NORMAL', [Validators.required]],
      orderDate: [new Date(), [Validators.required]],
      expectedDeliveryDate: [new Date(), [Validators.required]],
      assignedTailor: [''],
      fabricProvided: [false],
      fabricDetails: [''],
      specialInstructions: [''],
      numberOfSuits: [1, [Validators.required, Validators.min(1)]],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      amountPaid: [0, [Validators.required, Validators.min(0)]],
      balance: [{ value: 0, disabled: true }],
    });

    // Auto-recalculate balance when totalAmount or amountPaid changes
    this.orderForm.get('totalAmount')?.valueChanges.subscribe(() => this.calculateBalance());
    this.orderForm.get('amountPaid')?.valueChanges.subscribe(() => this.calculateBalance());
  }

  calculateBalance(): void {
    const total = Number(this.orderForm.get('totalAmount')?.value || 0);
    const paid = Number(this.orderForm.get('amountPaid')?.value || 0);
    const balance = total - paid;
    this.orderForm.patchValue({ balance }, { emitEvent: false });
  }

  loadOrders(): void {
    this.loading.set(true);
    this.orderService.getOrders().subscribe({
      next: (resp) => {
        if (resp && resp.data) {
          this.ordersList.set(resp.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed to load orders' });
        this.loading.set(false);
      },
    });
  }

  loadMeasurements(): void {
    this.measurementService.getMeasurements().subscribe({
      next: (resp) => {
        if (resp && resp.data) {
          this.measurementsList.set(resp.data);
        }
      },
      error: (err) => {
        console.error('Failed to load measurements list', err);
      },
    });
  }

  getNextOrderNumber(): string {
    const list = this.ordersList();
    if (list && list.length > 0) {
      const firstItem = list[0];
      if (firstItem && firstItem.orderNumber) {
        const match = firstItem.orderNumber.match(/\d+/);
        if (match) {
          const nextNum = parseInt(match[0], 10) + 1;
          return `ORD-${nextNum.toString().padStart(2, '0')}`;
        }
      }
    }
    return 'ORD-01';
  }

  openNew(): void {
    this.editingId = null;
    this.submitted = false;
    this.orderForm.reset();

    const nextOrderNum = this.getNextOrderNumber();
    const defaultDelivery = new Date();
    defaultDelivery.setDate(defaultDelivery.getDate() + 7);

    this.orderForm.patchValue({
      orderNumber: nextOrderNum,
      status: 'PENDING',
      priority: 'NORMAL',
      orderDate: new Date(),
      expectedDeliveryDate: defaultDelivery,
      fabricProvided: false,
      numberOfSuits: 1,
      totalAmount: 0,
      amountPaid: 0,
      balance: 0,
    });

    this.orderDialog = true;
  }

  onMeasurementSelected(event: any): void {
    const selectedId = event.value;
    if (selectedId) {
      const measurement = this.measurementsList().find((m) => m._id === selectedId);
      if (measurement) {
        const patchData: any = {};
        if (measurement.dateOfBooking) {
          patchData.orderDate = new Date(measurement.dateOfBooking);
        }
        if (measurement.deliveryDate) {
          patchData.expectedDeliveryDate = new Date(measurement.deliveryDate);
        }
        if (measurement.totalCost !== undefined) {
          patchData.totalAmount = measurement.totalCost;
        }
        if (measurement.advancePayment !== undefined) {
          patchData.amountPaid = measurement.advancePayment;
        }
        this.orderForm.patchValue(patchData);
        this.calculateBalance();
      }
    }
  }

  editOrder(order: Order): void {
    this.editingId = order._id || null;
    this.submitted = false;

    this.orderForm.patchValue({
      orderNumber: order.orderNumber,
      measurementId: order.measurementId?._id || order.measurementId,
      status: order.status,
      priority: order.priority,
      orderDate: order.orderDate ? new Date(order.orderDate) : new Date(),
      expectedDeliveryDate: order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate) : new Date(),
      assignedTailor: order.assignedTailor || '',
      fabricProvided: Boolean(order.fabricProvided),
      fabricDetails: order.fabricDetails || '',
      specialInstructions: order.specialInstructions || '',
      numberOfSuits: order.numberOfSuits || 1,
      totalAmount: order.totalAmount || 0,
      amountPaid: order.amountPaid || 0,
      balance: order.balance || 0,
    });

    this.orderDialog = true;
  }

  hideDialog(): void {
    this.orderDialog = false;
    this.submitted = false;
  }

  printInvoice(order: Order): void {
    this.selectedOrderForInvoice.set(order);
    this.cdr.detectChanges();
    setTimeout(() => {
      window.print();
      this.selectedOrderForInvoice.set(null);
      this.cdr.detectChanges();
    }, 150);
  }

  saveOrder(): void {
    this.submitted = true;
    this.orderForm.markAllAsTouched();
    Object.keys(this.orderForm.controls).forEach((key) => {
      const ctrl = this.orderForm.get(key);
      if (ctrl) {
        ctrl.markAsTouched();
        ctrl.markAsDirty();
      }
    });

    if (this.orderForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please fix the highlighted errors before saving.' });
      return;
    }

    const formValue = this.orderForm.getRawValue();

    if (this.editingId) {
      this.orderService.updateOrder(formValue, this.editingId).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Updated Successfully' });
          this.loadOrders();
          this.orderDialog = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed to update order' });
        },
      });
    } else {
      this.orderService.createOrder(formValue).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Created Successfully' });
          this.loadOrders();
          this.orderDialog = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed to create order' });
        },
      });
    }
  }

  confirmDelete(order: Order): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete order ${order.orderNumber}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (order._id) {
          this.orderService.deleteOrder(order._id).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Order deleted successfully' });
              this.loadOrders();
            },
            error: (err) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed to delete order' });
            },
          });
        }
      },
    });
  }

  getStatusSeverity(status: string): 'contrast' | 'secondary' | 'info' | 'warn' | 'success' | 'danger' {
    const found = this.orderStatuses.find((s) => s.key === status);
    return found ? found.severity : 'info';
  }

  getStatusStyle = getStatusStyle;

  getStatusLabel(status: string): string {
    const found = this.orderStatuses.find((s) => s.key === status);
    return found ? found.value : status;
  }

  getPrioritySeverity(priority: string): 'contrast' | 'secondary' | 'info' | 'warn' | 'success' | 'danger' {
    const found = this.orderPriorities.find((p) => p.key === priority);
    return found ? found.severity : 'info';
  }

  getPriorityLabel(priority: string): string {
    const found = this.orderPriorities.find((p) => p.key === priority);
    return found ? found.value : priority;
  }

  updateQuickStatus(order: Order, newStatus: string): void {
    if (order._id && order.status !== newStatus) {
      this.orderService.updateOrderStatus(newStatus, order._id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Updated', detail: `Order status changed to ${this.getStatusLabel(newStatus)}` });
          this.loadOrders();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed to update status' });
        },
      });
    }
  }

  hasError(controlName: string): boolean {
    const ctrl = this.orderForm.get(controlName);
    return !!(ctrl && (ctrl.touched || this.submitted) && ctrl.invalid);
  }

  getError(controlName: string): string | null {
    const ctrl = this.orderForm.get(controlName);
    if (!ctrl || (!ctrl.touched && !this.submitted) || !ctrl.invalid) return null;

    if (ctrl.errors?.['required']) {
      const labels: { [key: string]: string } = {
        measurementId: 'Customer measurement',
        status: 'Order status',
        priority: 'Priority',
        orderDate: 'Booking date',
        expectedDeliveryDate: 'Expected delivery date',
        totalAmount: 'Total amount',
        amountPaid: 'Amount paid',
        numberOfSuits: 'Number of suits',
      };
      return `${labels[controlName] || controlName} is required`;
    }
    if (ctrl.errors?.['min'] && ctrl.errors['min'].min === 1) return 'Value must be a positive integer';
    if (ctrl.errors?.['min']) return 'Value must be 0 or greater';
    return 'Invalid value';
  }
}
