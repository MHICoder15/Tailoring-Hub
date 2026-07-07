import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, MenuModule],
  template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" height="40pt" width="1650pt" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1650 700">
                  <g transform="translate(0.000000,640.000000) scale(0.100000,-0.100000)" fill="var(--primary-color)" stroke="none">
                    <path d="M8207 5087 c3 -14 -337 -367 -352 -367 -12 0 -358 344 -364 361 -2 6 79 93 179 194 l182 182 176 -179 c98 -99 178 -185 179 -191z m-1159 263 c2 -37 -4 -55 -31 -100 -46 -76 -528 -862 -677 -1105 -67 -110 -172 -281 -233 -380 -183 -299 -318 -520 -447 -730 -312 -509 -408 -670 -399 -673 26 -10 518 151 759 248 181 72 533 228 740 327 80 38 210 100 290 138 80 38 386 189 680 336 555 276 688 338 927 433 514 202 993 249 1434 140 60 -15 111 -25 113 -23 10 11 716 1190 716 1195 0 9 -963 3 -1090 -6 -437 -32 -714 -235 -854 -628 -22 -63 -33 -104 -62 -241 -4 -21 -9 -23 -47 -18 -23 3 -66 9 -94 12 l-53 7 0 146 c0 216 32 560 82 890 l12 82 1578 0 1578 0 0 -54 c0 -60 32 -4 -540 -946 -95 -157 -206 -341 -248 -410 -170 -283 -304 -500 -313 -506 -5 -3 -53 22 -107 55 -173 105 -387 196 -553 235 -228 55 -451 69 -666 41 -395 -51 -662 -148 -1398 -510 -860 -422 -1100 -535 -1460 -690 -583 -250 -1036 -407 -1451 -505 -92 -22 -171 -45 -176 -52 -4 -7 -24 -41 -43 -74 -22 -40 -43 -64 -57 -67 -94 -23 -358 -41 -598 -42 -268 0 -342 6 -337 28 1 8 -33 14 -116 19 -285 17 -549 78 -817 190 -167 69 -354 174 -714 401 -464 293 -728 368 -1041 296 -188 -44 -323 -119 -585 -327 -33 -25 -32 -24 14 35 149 191 355 339 559 402 155 47 390 46 561 -4 151 -44 278 -107 695 -347 403 -232 658 -329 1028 -393 187 -32 544 -54 556 -34 4 8 71 118 148 244 78 127 220 361 317 520 96 160 257 425 357 590 100 165 285 471 412 680 126 209 306 506 400 660 93 154 175 291 182 303 l13 24 -549 -5 c-582 -5 -592 -6 -758 -57 -248 -78 -424 -246 -536 -514 -40 -97 -89 -263 -89 -305 0 -22 -3 -23 -42 -18 -24 4 -69 9 -100 13 l-58 6 5 137 c12 292 36 562 70 786 9 55 19 121 22 148 l6 47 1541 -2 1541 -3 3 -45z m6615 -1608 c174 -63 291 -148 547 -397 269 -263 410 -371 595 -460 367 -176 799 -221 1200 -125 50 12 99 24 110 27 41 10 -18 -24 -120 -70 -110 -49 -231 -86 -370 -113 -139 -28 -433 -26 -588 4 -352 67 -618 211 -952 517 -339 309 -451 379 -630 392 -98 7 -176 -11 -291 -67 -125 -60 -189 -114 -484 -411 -297 -298 -356 -345 -502 -397 -89 -31 -237 -36 -303 -9 l-40 16 45 0 c67 2 166 19 229 41 135 48 267 173 481 455 289 381 383 475 563 561 108 51 180 64 327 60 95 -3 139 -8 183 -24z m-3342 -212 c126 -26 218 -59 349 -126 178 -91 330 -219 532 -449 352 -400 511 -525 711 -559 230 -40 416 32 726 283 52 42 128 103 170 135 42 33 82 65 89 73 24 24 125 88 206 132 213 114 441 125 625 31 31 -16 65 -35 76 -44 18 -14 15 -14 -30 -1 -167 51 -273 57 -397 26 -162 -42 -271 -119 -535 -380 -210 -207 -293 -280 -395 -349 -136 -92 -222 -125 -372 -143 -214 -26 -381 20 -595 163 -103 70 -170 135 -396 388 -221 246 -227 253 -355 349 -198 149 -396 220 -610 221 -350 0 -603 -90 -1455 -524 -491 -250 -748 -370 -1147 -536 -1167 -486 -2175 -709 -3114 -687 -438 10 -792 78 -1159 221 -250 98 -398 180 -751 417 -139 92 -286 188 -327 212 -168 100 -351 169 -532 201 l-80 14 62 1 c144 2 351 -50 525 -133 90 -43 302 -159 379 -209 73 -47 341 -193 440 -239 445 -211 1022 -314 1599 -287 575 27 1191 146 1835 355 635 207 1192 446 2127 911 785 391 954 461 1237 517 157 31 167 32 329 34 100 2 159 -3 233 -18z m-31 -440 c83 -20 212 -71 247 -98 l23 -17 -48 -80 c-27 -44 -106 -174 -176 -290 -71 -115 -184 -300 -251 -410 -387 -634 -546 -893 -616 -1005 -98 -158 -97 -156 -62 -164 15 -3 316 -4 668 -2 598 3 648 5 760 24 221 39 379 97 513 186 82 55 206 181 256 259 56 87 136 254 166 346 17 52 33 86 41 86 8 0 52 -4 97 -8 l84 -9 -6 -56 c-3 -31 -15 -156 -26 -277 -11 -121 -31 -338 -45 -482 -14 -145 -25 -272 -25 -283 0 -20 -5 -20 -1765 -20 l-1765 0 0 64 c0 72 -37 5 340 621 100 165 250 410 333 545 82 135 167 274 190 310 22 36 103 169 180 295 77 127 163 267 191 313 57 94 62 98 216 139 163 43 335 48 480 13z m-3415 -1332 c-5 -38 -19 -184 -70 -718 -9 -85 -18 -176 -21 -202 l-6 -48 -1681 0 -1682 0 2 66 c2 65 3 69 119 263 160 269 187 311 193 315 3 2 31 0 61 -5 227 -36 397 -51 603 -56 198 -5 227 -8 222 -21 -9 -23 -114 -201 -156 -263 l-38 -56 107 -7 c59 -4 325 -5 592 -2 377 3 508 8 590 21 307 47 483 122 642 274 84 79 182 216 239 334 31 62 37 69 74 78 22 6 76 23 120 38 44 16 83 29 87 30 4 0 5 -18 3 -41z m9340 -987 c16 -74 120" />
                  </g>
                </svg>
                <span>Zafar Tailor</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
                <div class="relative">
                    <button type="button" class="layout-topbar-action" (click)="menu.toggle($event)">
                        <i class="pi pi-user"></i>
                    </button>
                    <p-menu #menu [popup]="true" [model]="profileMenuItems" appendTo="body" styleClass="profile-menu"></p-menu>
                </div>
            </div>
        </div>
    </div>`,
  styles: [`
    ::ng-deep .profile-menu {
        margin-top: 10.5px !important;
    }
  `]
})
export class AppTopbar {
  items!: MenuItem[];
  profileMenuItems = [
    {
      label: 'Profile',
      icon: 'pi pi-user'
    },
    {
      label: 'Change Password',
      icon: 'pi pi-unlock'
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
    }
  ];

  layoutService = inject(LayoutService);

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme
    }));
  }
}
