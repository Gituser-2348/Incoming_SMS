export interface validation {
    typeId?: any; // 0: No Validation; 1:number; 2:text; 3:datetime; 4:e-mail; 5:web URL
    number?: numberType;
    dateTime?: datetime;
    text?: textType;
}

export class datetime {
    showDatePicker?: boolean;
    formatId?: string;
    fromDate?: any;
    toDate?: any;
}

export class numberType {
    fromLength?: any;
    toLength?: any;
    fromRange?: any;
    toRange?: any;
    exactValue?: any;
}

class textType {
    caseSensitive?: boolean
    selectedTypeId?: any;
    fromLength?: any;
    toLength?: any;
    criteriaList?: Array<criteria>;
    exactValue?: any;
}

class criteria {
    selectedId?: number;
    value?: string;
}
