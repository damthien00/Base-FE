export class OptionsFilterStockIn {
    pageSize: number | null = 100;
    pageIndex: number | null = 1;
    CreatedById: number | null;
    StartDate: Date | null = null;
    EndDate: Date | null = null;
    TrackingNumber: string | null;
}
