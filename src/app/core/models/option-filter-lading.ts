// template.interface.ts
export class OptionsFilterLading {
    PageSize: number = 30;
    PageIndex: number = 1;
    fromBranchId: number;
    bromBranchId: number;
    fromBranchName?: string;
    toBranchName?: string;
    iAccepted?: number;
}
  