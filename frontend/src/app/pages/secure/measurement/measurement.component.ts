import { Component, OnInit, signal, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MeasurementService } from '@/app/core/services/measurement.service';
import { combineLatest, Subject, Subscription, startWith, takeUntil } from 'rxjs';
import { STITCHING_TYPES, WAIST_TYPES, NECK_TYPES, POCKET_OPTIONS, SLEEVE_TYPES, CUFF_STYLES, BUTTON_HOLE_STYLES, BUTTON_HOLE_TYPES, Measurement } from '@/app/core/models/measurement.model';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';

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
    TableModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    ToggleSwitchModule,
    MessageModule,
    InputMaskModule,
    DatePickerModule,
  ],
  templateUrl: './measurement.component.html',
  styleUrls: ['./measurement.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class MeasurementComponent implements OnInit, OnDestroy {
  measurementDialog: boolean = false;
  @ViewChild('dt') dt!: Table;
  exportColumns!: ExportColumn[];
  cols!: Column[];
  measurementsList = signal<any[]>([]);
  form!: FormGroup;
  private valueChangesSub?: Subscription;
  currentStep = 0;
  isEditing = false;
  editingId?: string = '';
  isSubmitted: boolean = false;
  measurement!: Measurement;

  // Step definitions
  readonly steps = [
    { title: 'Customer Info', icon: 'pi pi-user' },
    { title: 'Kameez', icon: 'pi pi-address-book' },
    { title: 'Shalwar', icon: 'pi pi-box' },
    { title: 'Stitching', icon: 'pi pi-pencil' },
    { title: 'Expenses', icon: 'pi pi-wallet' },
  ];

  // Controls mapped to each step for step-level validation
  readonly stepControls: string[][] = [
    ['name', 'bookingNumber', 'phoneNumber', 'dateOfBooking', 'deliveryDate'],
    ['kameezLength', 'sleeve', 'shoulder', 'neck', 'chest', 'waist', 'armholeWidth', 'sleeveWidth'],
    ['shalwarLength', 'ankleOpening', 'shalwarPocket', 'shalwarWaist', 'crotchDepth'],
    [
      'stitchingType',
      'waistType',
      'neckType',
      'frontPocket',
      'frontPocketWidth',
      'frontPocketHeight',
      'sidePockets',
      'frontPattiLength',
      'frontPattiWidth',
      'sleeveType',
      'cuffLength',
      'cuffWidth',
      'cuffFit',
      'cuffStyle',
      'cuffButtonHoleStyle',
      'cuffButtonHoleType',
      'cuffPattiButton',
    ],
    ['previousBalance', 'totalCost', 'advancePayment', 'remainingBalance'],
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
    sleeveType: 'Cuff type',
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
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMeasurementData();
    this.initForm();
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
      if (resp.success === true) {
        this.measurementsList.set(resp.data);
        if (this.form && !this.isEditing) {
          this.form.get('bookingNumber')?.setValue(this.getNextBookingNumber(), { emitEvent: false });
        }
      }
    });

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'bookingNumber', header: 'Booking Number' },
      { field: 'phoneNumber', header: 'Phone Number' },
      { field: 'previousBalance', header: 'Previous Balance' },
      { field: 'totalCost', header: 'Total Cost' },
      { field: 'remainingBalance', header: 'Remaining Balance' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  // ─── Form Initialization ─────────────────────────────────────────

  private initForm(): void {
    const nextBookingNum = this.isEditing ? '' : this.getNextBookingNumber();
    this.form = this.fb.group({
      // Customer Info
      name: ['', [Validators.required]],
      bookingNumber: [{ value: nextBookingNum, disabled: true }, [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      dateOfBooking: [new Date(), [Validators.required]],
      deliveryDate: [new Date(new Date().setDate(new Date().getDate() + 14)), [Validators.required]],

      // // Kameez
      kameezLength: [null, [Validators.required, Validators.min(0)]],
      sleeve: [null, [Validators.required, Validators.min(0)]],
      shoulder: [null, [Validators.required, Validators.min(0)]],
      neck: [null, [Validators.required, Validators.min(0)]],
      chest: [null, [Validators.required, Validators.min(0)]],
      waist: [null, [Validators.required, Validators.min(0)]],
      armholeWidth: [null, [Validators.required, Validators.min(0)]],
      sleeveWidth: [null, [Validators.required, Validators.min(0)]],

      // Shalwar
      shalwarLength: [null, [Validators.required, Validators.min(0)]],
      ankleOpening: [null, [Validators.required, Validators.min(0)]],
      shalwarPocket: [false, [Validators.required]],
      shalwarWaist: [null, [Validators.required, Validators.min(0)]],
      crotchDepth: [null, [Validators.required, Validators.min(0)]],

      // Stitching
      stitchingType: ['Single', [Validators.required]],
      waistType: ['Round', [Validators.required]],
      neckType: ['Collar', [Validators.required]],
      frontPocket: [true, [Validators.required]],
      frontPocketWidth: [5, [Validators.required, Validators.min(0)]],
      frontPocketHeight: [5.5, [Validators.required, Validators.min(0)]],
      sidePockets: [false, [Validators.required]],
      frontPattiLength: [13, [Validators.required, Validators.min(0)]],
      frontPattiWidth: [1, [Validators.required, Validators.min(0)]],
      sleeveType: [false, [Validators.required]],
      cuffLength: [9.5, [Validators.required, Validators.min(0)]],
      cuffWidth: [2.5, [Validators.required, Validators.min(0)]],
      cuffFit: [false, [Validators.required]],
      cuffStyle: ['Round', [Validators.required]],
      cuffButtonHoleStyle: ['Horizontal', [Validators.required]],
      cuffButtonHoleType: ['Double Side', [Validators.required]],
      cuffPattiButton: [false, [Validators.required]],
      description: [''],

      // Expenses
      previousBalance: [0, [Validators.required, Validators.min(0)]],
      totalCost: [null, [Validators.required, Validators.min(0)]],
      advancePayment: [0, [Validators.required, Validators.min(0)]],
      remainingBalance: [{ value: 0, disabled: true }],
      remarks: [''],
    });
    this.setupValueChanges();
  }

  getNextBookingNumber(): string {
    const list = this.measurementsList();
    if (!list || list.length === 0) {
      return 'BK-01';
    }

    const latestItem = list[0];
    let latestNum = 0;
    if (latestItem && latestItem.bookingNumber) {
      const digits = latestItem.bookingNumber.toString().replace(/\D/g, '');
      const num = parseInt(digits, 10);
      if (!isNaN(num)) {
        latestNum = num;
      }
    }

    const nextNum = latestNum + 1;
    const padded = nextNum.toString().padStart(2, '0');
    return `BK-${padded}`;
  }

  // ─── Submit ──────────────────────────────────────────────────────

  onSubmit(): void {
    if (!this.validateAll()) return;

    this.isSubmitted = true;
    this.cdr.markForCheck();
    const formValue = this.form.getRawValue(); // includes disabled controls

    if (this.isEditing && this.editingId) {
      this.measurementService.updateMeasurement(formValue, this.editingId).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.messageService.add({ severity: 'success', summary: 'Success Message', detail: resp.message || 'Measurement updated successfully' });
            this.hideMessageDialog();
            this.loadMeasurementData();
            this.currentStep = 0;
            this.form.reset();
            this.initForm();
          }
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: err.error.message || 'Failed to update measurement' });
          this.isSubmitted = false;
          this.cdr.markForCheck();
        },
      });
    } else {
      this.measurementService.createMeasurement(formValue).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.messageService.add({ severity: 'success', summary: 'Success Message', detail: resp.message || 'Measurement saved successfully' });
            this.hideMessageDialog();
            this.loadMeasurementData();
            this.currentStep = 0;
            this.form.reset();
            this.initForm();
          }
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: err.error.message || 'Failed to save measurement' });
          this.isSubmitted = false;
          this.cdr.markForCheck();
        },
      });
    }
  }

  editMeasurement(measurement: Measurement) {
    this.measurement = { ...measurement };
    const patchedValues = {
      ...measurement,
      dateOfBooking: measurement.dateOfBooking ? new Date(measurement.dateOfBooking) : null,
      deliveryDate: measurement.deliveryDate ? new Date(measurement.deliveryDate) : null,
    };
    this.form.patchValue(patchedValues);
    this.measurementDialog = true;
    this.isEditing = true;
    this.editingId = measurement._id;
    this.currentStep = 4;
  }

  deleteMeasurement(measurement: Measurement) {
    const deletingId = measurement._id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the measurement?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        try {
          if (deletingId) {
            this.measurementService.deleteMeasurement(deletingId).subscribe({
              next: (resp) => {
                this.messageService.add({ severity: 'success', summary: 'Success Message', detail: resp.message || 'Measurement deleted successfully' });
                this.loadMeasurementData();
              },
              error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error Message', detail: err.error.message || 'Failed to delete measurement' });
                return;
              },
            });
          }
        } catch {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Something went wrong. Please try again.' });
        }
      },
    });
  }

  openNewMessageDialog() {
    this.currentStep = 0;
    this.form.reset();
    this.isEditing = false;
    this.initForm();
    this.isSubmitted = false;
    this.measurementDialog = true;
  }

  hideMessageDialog() {
    this.measurementDialog = false;
    this.isSubmitted = false;
  }

  // ─── Reactive Value Changes ──────────────────────────────────────

  private setupValueChanges(): void {
    // Unsubscribe from previous subscription to avoid leaks
    this.valueChangesSub?.unsubscribe();

    // Auto-calculate RemainingBalance
    const prev$ = this.form.get('previousBalance')!.valueChanges.pipe(startWith(this.form.get('previousBalance')!.value));
    const total$ = this.form.get('totalCost')!.valueChanges.pipe(startWith(this.form.get('totalCost')!.value));
    const advance$ = this.form.get('advancePayment')!.valueChanges.pipe(startWith(this.form.get('advancePayment')!.value));

    this.valueChangesSub = combineLatest([prev$, total$, advance$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([prev, total, advance]) => {
        const remaining = Math.max(0, (prev || 0) + (total || 0) - (advance || 0));
        this.form.get('remainingBalance')?.setValue(remaining, { emitEvent: false });
      });
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
    if (this.isEditing) {
      this.currentStep = index;
      return;
    }
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
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please fix the highlighted errors.' });
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
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please fix all errors before saving.' });
    }
    return valid;
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
    return !!this.form.get('frontPocket')?.value;
  }
}
