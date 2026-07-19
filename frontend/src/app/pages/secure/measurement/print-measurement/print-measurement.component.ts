import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NECK_TYPES, STITCHING_TYPES, CUFF_STYLES, BUTTON_HOLE_STYLES, BUTTON_HOLE_TYPES } from '../../../../core/models/measurement.model';

@Component({
  selector: 'app-print-measurement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print-measurement.component.html',
  styleUrls: ['./print-measurement.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PrintMeasurementComponent {
  @Input() p: any = null;

  readonly neckTypes = NECK_TYPES;
  readonly stitchingTypes = STITCHING_TYPES;
  readonly cuffStyles = CUFF_STYLES;
  readonly buttonHoleStyles = BUTTON_HOLE_STYLES;
  readonly buttonHoleTypes = BUTTON_HOLE_TYPES;

  getOptionUrdu(key: string | undefined, optionsList: { key: string; value: string }[]): string {
    if (!key) return '-';
    const found = optionsList.find((item) => item.key === key);
    if (!found) return key;
    const parts = found.value.split('/');
    return parts.length > 1 ? parts[1].trim() : found.value;
  }

  getNeckTypeUrdu(key: string | undefined): string {
    return this.getOptionUrdu(key, this.neckTypes);
  }

  getStitchingTypeUrdu(key: string | undefined): string {
    return this.getOptionUrdu(key, this.stitchingTypes);
  }

  getCuffStyleUrdu(key: string | undefined): string {
    return this.getOptionUrdu(key, this.cuffStyles);
  }

  getButtonHoleStyleUrdu(key: string | undefined): string {
    return this.getOptionUrdu(key, this.buttonHoleStyles);
  }

  getButtonHoleTypeUrdu(key: string | undefined): string {
    return this.getOptionUrdu(key, this.buttonHoleTypes);
  }

  isUrdu(val: any): boolean {
    if (!val) return false;
    const str = String(val);
    return /[\u0600-\u06FF]/.test(str);
  }
}
