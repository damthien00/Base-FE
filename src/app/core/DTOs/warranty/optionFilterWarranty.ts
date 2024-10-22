export class OptionsFilterWarranty {
    pageSize: number | null = 10;
    pageIndex: number | null = 1;
    Imei: string | null = '';
    ProductName: string | null;
    CustomerKeyword: string | null;
    BranchId: string | null;
    FrameNumber: string | null;
    EngineNumber: string | null;
}

export class OptionsFilterWarrantyClaims {
    pageSize: number | null = 10;
    pageIndex: number | null = 1;
    StartDate: Date | null = null;
    EndDate: Date | null = null;
    CustomerKeyword: string | null;
    Status: number | null = null;

    // FrameNumber: string | null;
    // EngineNumber: string | null;
}
