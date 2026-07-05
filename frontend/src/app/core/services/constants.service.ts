import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})


export class ConstantsService {
    superAdminId = 1
    constructor(
    ) {
    }
    public static DEFAULT_COUNTRY_ID = 16

    public static USER_ROLES = {
        MANAGER: 'manager',
        ADMIN: 'admin',
        EMPLOYEE: 'employee',
        HR: 'hr'
    }
    static DAYS = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]
    public BANK_TYPE = [{
        key: 'bank',
        name: 'Bank'
    },
    {
        key: 'cash',
        name: 'Cash'

    }]

    public MONTHSDATA = [
        {
            name: 'January',
            short: 'Jan',
            number: 1,
            days: 31
        },
        {
            name: 'February',
            short: 'Feb',
            number: 2,
            days: 28
        },
        {
            name: 'March',
            short: 'Mar',
            number: 3,
            days: 31
        },
        {
            name: 'April',
            short: 'Apr',
            number: 4,
            days: 30
        },
        {
            name: 'May',
            short: 'May',
            number: 5,
            days: 31
        },
        {
            name: 'June',
            short: 'Jun',
            number: 6,
            days: 30
        },
        {
            name: 'July',
            short: 'Jul',
            number: 7,
            days: 31
        },
        {
            name: 'August',
            short: 'Aug',
            number: 8,
            days: 31
        },
        {
            name: 'September',
            short: 'Sep',
            number: 9,
            days: 30
        },
        {
            name: 'October',
            short: 'Oct',
            number: 10,
            days: 31
        },
        {
            name: 'November',
            short: 'Nov',
            number: 11,
            days: 30
        }, {
            name: 'December',
            short: 'Dec',
            number: 12,
            days: 31
        }
    ];

    static SUBSCRIPTION_PLANS = [
        {
            title: 'Platinum',
            listings: 5,
            price: 5,
            image: '/assets/images/plan-one.png'
        },
        {
            title: 'Gold',
            listings: 10,
            price: 10,
            image: '/assets/images/plan-two.png'
        },
        {
            title: 'Diamond',
            listings: 15,
            price: 15,
            image: '/assets/images/plan-three.png'
        }
    ]
    public static AMENITY_CATEGORIES = {
        security: 'SECURITY',
        property: 'PROPERTY'
    }

    public static STATUSES = {
        active: 'Active',
        inactive: 'InActive'
    }

    public static BANNER_TYPE = {
        top: 'Top Banner',
        bottom: 'Bottom Banner'
    }


    public static BANNER_OPEN_IN = {
        same: 'Same Window',
        new: 'New Window'
    }

    public static PROPERTY_STATUS = {
        active: 'New Listing',
        offerInProgress: 'Offer in Progress',
        rental: 'Rental',
        rentalSale: 'Rental/Sale',
        auction: 'Auction',
        showHouse: 'Show House',
        reduced: 'Reduced',
        notTransferDuties: 'Not Transfer Duties'
    }

    public static PROPERTY_STATUS_ADMIN = {
        active: 'New Listing',
        offerInProgress: 'Offer in Progress',
        rental: 'Rental',
        rentalSale: 'Rental/Sale',
        auction: 'Auction',
        showHouse: 'Show House',
        reduced: 'Reduced',
        notTransferDuties: 'Not Transfer Duties'
    }

    public static OPERATIONS = {
        sale: 'Sale',
        rent: 'Rent',
        'sale&rent': 'Sale & Rent'
    }

    public static ARTICLE_STATUSES = {
        publish: 'PUBLISH',
        draft: 'DRAFT'
    }

    public static ARTICLE_TYPES = {
        Blog: 'BLOG',
        News: 'NEWS',
        Articles: 'ARTICLES'
    }


    public static BANNER_PLANS = {
        30: '30 days',
        60: '60 days',
        90: '90 days',
        120: '120 days'
    }

    public static BUILDING_SIZE_UNIT = {
        square_meter: 'Square Meter',
        square_feet: 'Square Feet',
    }

    public static PROPERTY_SIZE_UNIT = {
        acre: 'Acre',
        hectare: 'Hectare',
        square_meter: 'Square Meter'
    }

    public LANGUAGES = {
        en: 'English',
        ch: '中文',
        fr: 'French'
    }

    public FOLLOWUP_STATUSES = [
        {
            title: 'Pending',
            key: 'pending'
        },
        {
            title: 'Triggered',
            key: 'triggered'
        },
        {
            title: 'Done',
            key: 'done'
        }
    ];

    public DATE_TIME_FORMAT = {
        CHAR_DATE: 'MMM DD, YYYY',
        SHORT_DATE: 'DD-MM-YYYY',
        DATE: 'dddd, MMMM DD, YYYY',
        TIME: 'HH:mm',
        DATE_TIME: 'dddd, MMMM DD, YYYY hh:mm A',
        AM_PM: 'HH:mm A',
        DOC_DATE: 'DD MMM, YYYY',
        DATE_AMPM: 'DD MMM, YYYY, h a'
    }

    public static EDITOR_CONFIG = {
        editable: true,
        spellcheck: false,
        height: 'auto',
        minHeight: '500',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Enter your Content Here',
        defaultParagraphSeparator: '',
        defaultFontName: 'calibri',
        defaultFontSize: '12',
        fonts: [
            { class: 'arial', name: 'Arial' },
            { class: 'times-new-roman', name: 'Times New Roman' },
            { class: 'calibri', name: 'Calibri' },
            { class: 'comic-sans-ms', name: 'Comic Sans MS' }
        ],
        // uploadUrl: 'v1/image',
        uploadWithCredentials: false,
        sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            [
                'customClasses',
                'insertVideo',
                'insertHorizontalRule',
                'removeFormat',
                'fontName'
                // 'toggleEditorMode'
            ]
        ]
    }
}
