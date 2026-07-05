import { Component, OnInit, signal, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '@/app/pages/service/product.service';
import { MeasurementService } from '@/app/core/services/measurement.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastService } from '@/app/core/services/toast.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { STITCHING_TYPES, WAIST_TYPES, NECK_TYPES, POCKET_OPTIONS, SLEEVE_TYPES, CUFF_STYLES, BUTTON_HOLE_STYLES, BUTTON_HOLE_TYPES, CUFF_PATTI_BUTTONS, } from '@/app/core/models/measurement.model';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-measurement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    ToggleSwitchModule
  ],
  templateUrl: './measurement.component.html',
  styleUrls: ['./measurement.component.css'],
  providers: [MessageService, ProductService, ConfirmationService]
})
export class MeasurementComponent implements OnInit, OnDestroy {
  productDialog: boolean = false;
  product!: Product;
  selectedProducts!: Product[] | null;
  submitted: boolean = false;
  statuses!: any[];
  @ViewChild('dt') dt!: Table;
  exportColumns!: ExportColumn[];
  cols!: Column[];

  measurementsList = signal<any[]>([]);

  form!: FormGroup;
  currentStep = 0;
  isEditing = false;
  editingId: string | null = null;
  submitting: boolean = false;

  // Step definitions
  readonly steps = [
    { title: 'Customer Info', icon: 'pi pi-user' },
    { title: 'Kameez', icon: 'pi pi-address-book' },
    { title: 'Shalwar', icon: 'pi pi-box' },
    { title: 'Stitching', icon: 'pi pi-pencil' },
    { title: 'Expenses', icon: 'pi pi-wallet' }
  ];

  // Controls mapped to each step for step-level validation
  readonly stepControls: string[][] = [
    ['name', 'bookingNumber', 'phoneNumber', 'dateOfBooking', 'deliveryDate'],
    ['kameezLength', 'sleeve', 'shoulder', 'neck', 'chest', 'waist'],
    ['shalwarLength', 'ankleOpening', 'shalwarPocket', 'shalwarWaist', 'crotchDepth'],
    [
      'stitchingType', 'waistType', 'neckType', 'frontPocket',
      'frontPocketWidth', 'frontPocketHeight', 'sidePockets',
      'frontPattiLength', 'frontPattiWidth', 'ArmholeWidth',
      'sleeveWidth', 'sleeveType', 'cuffLength', 'cuffWidth',
      'cuffFit', 'cuffStyle', 'cuffButtonHoleStyle',
      'cuffButtonHoleType', 'cuffPattiButton',
    ],
    ['PreviousBalance', 'TotalCost', 'AdvancePayment', 'RemainingBalance'],
  ];

  // Select options
  readonly stitchingTypes = STITCHING_TYPES;
  readonly waistTypes = WAIST_TYPES;
  readonly neckTypes = NECK_TYPES;
  readonly pocketOptions = POCKET_OPTIONS;
  readonly sleeveTypes = SLEEVE_TYPES;
  readonly cuffStyles = CUFF_STYLES;
  readonly buttonHoleStyles = BUTTON_HOLE_STYLES;
  readonly buttonHoleTypes = BUTTON_HOLE_TYPES;
  readonly cuffPattiButtons = CUFF_PATTI_BUTTONS;

  // Field labels for error messages
  readonly labels: Record<string, string> = {
    name: 'Customer name',
    bookingNumber: 'Booking number',
    phoneNumber: 'Phone number',
    dateOfBooking: 'Date of booking',
    deliveryDate: 'Delivery date',
    kameezLength: 'Kameez length',
    sleeve: 'Sleeve length',
    shoulder: 'Shoulder width',
    neck: 'Neck circumference',
    chest: 'Chest circumference',
    waist: 'Waist circumference',
    shalwarLength: 'Shalwar length',
    ankleOpening: 'Ankle opening',
    shalwarPocket: 'Shalwar pocket',
    shalwarWaist: 'Shalwar waist',
    crotchDepth: 'Crotch depth',
    stitchingType: 'Stitching type',
    waistType: 'Waist type',
    neckType: 'Neck type',
    frontPocket: 'Front pocket',
    frontPocketWidth: 'Front pocket width',
    frontPocketHeight: 'Front pocket height',
    sidePockets: 'Side pockets',
    frontPattiLength: 'Front patti length',
    frontPattiWidth: 'Front patti width',
    armholeWidth: 'Armhole width',
    sleeveWidth: 'Sleeve width',
    sleeveType: 'Sleeve type',
    cuffLength: 'Cuff length',
    cuffWidth: 'Cuff width',
    cuffFit: 'Cuff fit',
    cuffStyle: 'Cuff style',
    cuffButtonHoleStyle: 'Cuff button hole style',
    cuffButtonHoleType: 'Cuff button hole type',
    cuffPattiButton: 'Cuff patti button',
    previousBalance: 'Previous balance',
    totalCost: 'Total cost',
    advancePayment: 'Advance payment',
    remainingBalance: 'Remaining balance',
  };

  private destroy$ = new Subject<void>();

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private measurementService: MeasurementService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadMeasurementData();
    this.initForm();
    this.setupValueChanges();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  loadMeasurementData() {
    this.measurementsList.set([]);
    this.measurementService.getMeasurements().subscribe((resp) => {
      console.log("🚀 ~ MeasurementComponent ~ loadMeasurementData ~ resp:", resp)
      if (resp.success === true) {
        this.measurementsList.set(resp.data);
      }
    });

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'bookingNumber', header: 'Booking Number' },
      { field: 'phoneNumber', header: 'Phone Number' },
      { field: 'TotalCost', header: 'Total Cost' },
      { field: 'RemainingBalance', header: 'Remaining Balance' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // ─── Form Initialization ─────────────────────────────────────────

  private initForm(): void {
    this.form = this.fb.group({
      // Customer Info
      name: ['', [Validators.required]],
      bookingNumber: [{ value: '', disabled: false }, [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      dateOfBooking: [this.toDateString(new Date()), [Validators.required]],
      deliveryDate: [this.toDateString(new Date(new Date().setDate(new Date().getDate() + 14))), [Validators.required]],

      // Kameez
      kameezLength: [38, [Validators.required, Validators.min(0)]],
      sleeve: [22, [Validators.required, Validators.min(0)]],
      shoulder: [18, [Validators.required, Validators.min(0)]],
      neck: [15, [Validators.required, Validators.min(0)]],
      chest: [23, [Validators.required, Validators.min(0)]],
      waist: [24, [Validators.required, Validators.min(0)]],

      // Shalwar
      shalwarLength: [37, [Validators.required, Validators.min(0)]],
      ankleOpening: [9, [Validators.required, Validators.min(0)]],
      shalwarPocket: [false, [Validators.required]],
      shalwarWaist: [23, [Validators.required, Validators.min(0)]],
      crotchDepth: [19, [Validators.required, Validators.min(0)]],

      // // Kameez
      // kameezLength: [null, [Validators.required, Validators.min(0)]],
      // sleeve: [null, [Validators.required, Validators.min(0)]],
      // shoulder: [null, [Validators.required, Validators.min(0)]],
      // neck: [null, [Validators.required, Validators.min(0)]],
      // chest: [null, [Validators.required, Validators.min(0)]],
      // waist: [null, [Validators.required, Validators.min(0)]],

      // // Shalwar
      // shalwarLength: [null, [Validators.required, Validators.min(0)]],
      // ankleOpening: [null, [Validators.required, Validators.min(0)]],
      // shalwarPocket: [false, [Validators.required]],
      // shalwarWaist: [null, [Validators.required, Validators.min(0)]],
      // crotchDepth: [null, [Validators.required, Validators.min(0)]],

      // Stitching
      stitchingType: ['Single', [Validators.required]],
      waistType: ['Round', [Validators.required]],
      neckType: ['Collar', [Validators.required]],
      frontPocket: ['Single', [Validators.required]],
      frontPocketWidth: [{ value: 5, disabled: true }, [Validators.required, Validators.min(0)]],
      frontPocketHeight: [{ value: 5.5, disabled: true }, [Validators.required, Validators.min(0)]],
      sidePockets: ['Single', [Validators.required]],
      frontPattiLength: [13, [Validators.required, Validators.min(0)]],
      frontPattiWidth: [1, [Validators.required, Validators.min(0)]],
      armholeWidth: [null, [Validators.required, Validators.min(0)]],
      sleeveWidth: [null, [Validators.required, Validators.min(0)]],
      sleeveType: ['Single', [Validators.required]],
      cuffLength: [9.5, [Validators.required, Validators.min(0)]],
      cuffWidth: [2.5, [Validators.required, Validators.min(0)]],
      cuffFit: [false, [Validators.required]],
      cuffStyle: ['Round', [Validators.required]],
      cuffButtonHoleStyle: ['Horizontal', [Validators.required]],
      cuffButtonHoleType: ['Double Side', [Validators.required]],
      cuffPattiButton: ['None', [Validators.required]],
      description: [''],

      // Expenses
      previousBalance: [0, [Validators.required, Validators.min(0)]],
      totalCost: [0, [Validators.required, Validators.min(0)]],
      advancePayment: [0, [Validators.required, Validators.min(0)]],
      remainingBalance: [{ value: 0, disabled: true }],
      remarks: [''],
    });
  }

  // ─── Reactive Value Changes ──────────────────────────────────────

  private setupValueChanges(): void {
    // Auto-calculate RemainingBalance
    combineLatest([
      this.form.get('previousBalance')!.valueChanges,
      this.form.get('totalCost')!.valueChanges,
      this.form.get('advancePayment')!.valueChanges,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([prev, total, advance]) => {
        const remaining = Math.max(0, (prev || 0) + (total || 0) - (advance || 0));
        this.form.get('remainingBalance')?.setValue(remaining, { emitEvent: false });
      });

    // Conditional: show/hide front pocket dimensions
    this.form
      .get('frontPocket')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        const show = val && val !== 'None';
        const fwCtrl = this.form.get('frontPocketWidth')!;
        const fhCtrl = this.form.get('frontPocketHeight')!;

        if (show) {
          fwCtrl.enable({ emitEvent: false });
          fhCtrl.enable({ emitEvent: false });
        } else {
          fwCtrl.disable({ emitEvent: false });
          fhCtrl.disable({ emitEvent: false });
          fwCtrl.setValue(0, { emitEvent: false });
          fhCtrl.setValue(0, { emitEvent: false });
        }
      });
  }

  // ─── Edit Mode ───────────────────────────────────────────────────

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.editingId = id;
      const measurement = this.measurementService.getById(id);
      if (measurement !== null && measurement !== undefined) {
        this.form.patchValue(measurement);
        // Re-trigger the async validator with the exclude ID
        // this.form.get('bookingNumber')!.setAsyncValidators(
        //   uniqueBookingNumber(this.measurementService, id)
        // );
        this.form.get('bookingNumber')!.updateValueAndValidity();
      } else {
        this.toast.show('Measurement not found', 'error');
        this.router.navigate(['/']);
      }
    } else {
      // New mode — set defaults
      // this.form.get('bookingNumber')?.setValue(uniqueBookingNumber(this.measurementService));
      this.form.get('dateOfBooking')?.setValue(this.toDateString(new Date()));
      const delivery = new Date();
      delivery.setDate(delivery.getDate() + 14);
      this.form.get('deliveryDate')?.setValue(this.toDateString(delivery));
    }
  }

  // ─── Step Navigation ─────────────────────────────────────────────

  get step(): number {
    return this.currentStep;
  }

  get isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

  get isFirstStep(): boolean {
    return this.currentStep === 0;
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  goToStep(index: number): void {
    // Only allow going to completed steps or the next one
    if (index <= this.currentStep) {
      this.currentStep = index;
    }
  }

  /** Validate only the controls belonging to the current step */
  private validateCurrentStep(): boolean {
    const controls = this.stepControls[this.currentStep];
    let valid = true;

    controls.forEach((name) => {
      const ctrl = this.form.get(name);
      if (ctrl) {
        // Skip disabled controls (e.g. frontPocketWidth when frontPocket is None)
        if (ctrl.disabled) return;
        ctrl.markAsTouched();
        ctrl.markAsDirty();
        if (ctrl.invalid) {
          valid = false;
        }
      }
    });

    if (!valid) {
      this.toast.show('Please fix the highlighted errors', 'error');
    }
    return valid;
  }

  /** Full validation across all steps */
  private validateAll(): boolean {
    // Enable all controls temporarily for full validation
    const wasDisabled: { name: string; wasDisabled: boolean }[] = [];

    ['frontPocketWidth', 'frontPocketHeight'].forEach((name) => {
      const ctrl = this.form.get(name);
      if (ctrl?.disabled) {
        wasDisabled.push({ name, wasDisabled: true });
        ctrl.enable({ emitEvent: false });
      }
    });

    this.form.markAllAsTouched();
    const valid = this.form.valid;

    // Restore disabled state
    wasDisabled.forEach(({ name }) => {
      this.form.get(name)?.disable({ emitEvent: false });
    });

    if (!valid) {
      // Navigate to the first step that has errors
      for (let i = 0; i < this.stepControls.length; i++) {
        const hasError = this.stepControls[i].some((name) => {
          const ctrl = this.form.get(name);
          return ctrl && !ctrl.disabled && ctrl.invalid;
        });
        if (hasError) {
          this.currentStep = i;
          break;
        }
      }
      this.toast.show('Please fix all errors before saving', 'error');
    }
    return valid;
  }

  // ─── Submit ──────────────────────────────────────────────────────

  onSubmit(): void {
    if (!this.validateAll()) return;

    this.submitting = true;
    this.cdr.markForCheck();
    const formValue = this.form.getRawValue(); // includes disabled controls
    console.log("🚀 ~ MeasurementComponent ~ onSubmit ~ formValue:", formValue)

    // return
    try {
      if (this.isEditing && this.editingId) {
        // this.measurementService.update(this.editingId, formValue);
        this.toast.show('Measurement updated successfully', 'success');
      } else {
        this.measurementService.createMeasurement(formValue).subscribe((resp: any) => {
          this.toast.show('Measurement saved successfully', 'success');
          this.hideDialog();
          this.loadMeasurementData();
          this.currentStep = 0;
          this.form.reset();
          this.initForm();
        });
      }
    } catch {
      this.toast.show('Something went wrong. Please try again.', 'error');
    } finally {
      this.submitting = false;
    }
  }

  // ─── Error Helpers ───────────────────────────────────────────────

  getError(controlName: string): string | null {
    const ctrl = this.form.get(controlName);
    if (!ctrl || !ctrl.touched || !ctrl.invalid) return null;

    if (ctrl.errors?.['required']) return `${this.labels[controlName] || controlName} is required`;
    if (ctrl.errors?.['min']) return 'Value must be 0 or greater';
    if (ctrl.errors?.['uniqueBookingNumber']) return 'This booking number already exists';
    return 'Invalid value';
  }

  hasError(controlName: string): boolean {
    const ctrl = this.form.get(controlName);
    return !!(ctrl && ctrl.touched && ctrl.invalid);
  }

  // ─── Utility ─────────────────────────────────────────────────────

  /** Whether to show front pocket dimension fields */
  get showPocketDimensions(): boolean {
    const val = this.form.get('frontPocket')?.value;
    return val && val !== 'None';
  }

  private toDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.products.set(this.products().filter((val) => val.id !== product.id));
        this.product = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000
        });
      }
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    // for (let i = 0; i < this.products().length; i++) {
    //   if (this.products()[i].id === id) {
    //     index = i;
    //     break;
    //   }
    // }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  saveProduct() {
    this.submitted = true;
    let _products = [...this.measurementsList()];
    // let _products = this.products();
    if (this.product.name?.trim()) {
      if (this.product.id) {
        _products[this.findIndexById(this.product.id)] = this.product;
        // this.products.set([..._products]);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000
        });
      } else {
        this.product.id = this.createId();
        this.product.image = 'product-placeholder.svg';
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000
        });
        // this.products.set([..._products, this.product]);
      }

      this.productDialog = false;
      this.product = {};
    }
  }
}




// function uniqueBookingNumber(measurementService: MeasurementService, id?: string): import("@angular/forms").AsyncValidatorFn {
//   return (control: import('@angular/forms').AbstractControl) => {
//     const val = control.value;
//     if (!val) return Promise.resolve(null);

//     try {
//       // Support synchronous lookup returning an item or null
//       const res = (measurementService as any).getByBookingNumber?.(val);
//       if (res !== undefined) {
//         const exists = res && (!id || res.id !== id);
//         return Promise.resolve(exists ? { uniqueBookingNumber: true } : null);
//       }

//       // Support async lookup returning Promise or Observable
//       const maybePromise = (measurementService as any).isBookingNumberTaken?.(val) || (measurementService as any).existsBookingNumber?.(val);
//       if (maybePromise && typeof maybePromise.then === 'function') {
//         return maybePromise.then((taken: any) => (taken ? { uniqueBookingNumber: true } : null));
//       }

//       // As a last resort, assume unique
//       return Promise.resolve(null);
//     } catch {
//       return Promise.resolve(null);
//     }
//   };
// }