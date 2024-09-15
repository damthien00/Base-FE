export class OptionsFilterStockIn {
    pageSize: number | null = 10;
    pageIndex: number | null = 1;
    CreatedById: number | null;
    StartDate: Date | null = null;
    Code: string | null = null;
    EndDate: Date | null = null;
    TrackingNumber: string | null;
}
