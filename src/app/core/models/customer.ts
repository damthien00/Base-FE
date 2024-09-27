export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Customer {
    id?: number;
    name?: string;
    country?: Country;
    company?: string;
    date?: string;
    status?: string;
    activity?: number;
    representative?: Representative;
}

export class OptionsFilterCustomer {
    pageSize: number | null = 100;
    pageIndex: number | null = 1;

    nameOrPhoneNumber: string | null = null;
    // sortOrder: string | null = "desc";
    // KeyWord: string  | null = null;
    // CategoryId: number | null = null;
    // StartPrice: number | null = null;
    // EndPrice: number | null = null;
    // Status: number | null = null;
}
