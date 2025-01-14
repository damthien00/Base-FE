import { FunctionService } from 'src/app/core/utils/function.utils';
import { NumberFormatPipe } from 'src/app/shared/pipes/numberFormat.pipe';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { NodeService } from 'src/app/core/services/node.service';
import { ProductService } from 'src/app/core/services/product.service';
import { OptionsFilterProduct } from 'src/app/core/models/options-filter-product';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { OptionsFilterProductVariant } from 'src/app/core/DTOs/stock-in/optionFilterProductVariant';
import { StockInService } from 'src/app/core/services/stock-in.service';
import { WarrantyPolicyService } from 'src/app/core/services/warranty-policy.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { BranchService } from 'src/app/core/services/branch.service';
import { HttpClient } from '@angular/common/http';
import { BillOfLadingService } from 'src/app/core/services/bill-of-lading.service';

export interface WarehouseReceipt {
  id?: number;
  code: string;
  warehouseId: number;
  warehouseName: string;
  productId: number;
  productName: string;
  quantity: number;
  note?: string;
  createdDate: Date;
  createdBy: string;
}

@Component({
  selector: 'app-branch-receiving',
  templateUrl: './branch-receiving.component.html',
  styleUrl: './branch-receiving.component.scss',
  providers: [MessageService]
})
export class BranchReceivingComponent {
  imageUrl: string = environment.imageUrl;
  @ViewChild('searchInput') searchInput!: ElementRef;
  items: MenuItem[] | undefined;
  datas: any;
  nodes!: any[];
  selectedNodes: any;
  treeCategory: any[] = [];
  branch: any[] = [];
  activeBarcode: boolean = false;
  stockInReceipt: any;
  // filteredDatas: any;
  showProducts = false;
  showImeiTable = false;
  isValidForm: boolean = true;
  temporaryDiscountRate: number = 0;
  temporaryDiscountUnit: string = 'VND';
  public userCurrent: any;
  selectedBranch: any;
  ladingId!: number;
  recipientNote!: string;
  totalQuantity!: number;
  totalQuantity2!: number;
  totalQuantityProduct!: number;
  displayConfirmation: boolean = false;
  displayConfirmation2: boolean = false;
  displayConfirmation3: boolean = false;

  displayDiscountModal = false;
  optionsFilterProduct: OptionsFilterProduct = new OptionsFilterProduct();
  frameNumber: any;
  engineNumber: any;
  displayedProducts: any;
  displayedProducts2: any;
  public url = environment.url;
  ladingData: any = {};
  groupedByProductId: any[] = [];
  groupedByProductVariantId: any[] = [];
  FromBranchId!: number;
  ToBranchId!: number;

  imeiData: any[] = [];
  frameEngineData: any[] = [];
  filteredDatas: any[] = [];
  isAccept: boolean = false;
  isRejected: boolean = false;
  showMoreMap: { [key: string]: boolean } = {};

  onBarcode: boolean = false;
  constructor(
    private nodeService: NodeService,
    private productService: ProductService,
    private stockInService: StockInService,
    public functionService: FunctionService,
    private messageService: MessageService,
    private warrantyService: WarrantyPolicyService,
    private billOfLadingService: BillOfLadingService,
    private authService: AuthService,
    private branchService: BranchService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.nodeService.getFiles().then((files) => (this.nodes = files));

    this.authService.userCurrent.subscribe((user) => {
      this.userCurrent = user;
    });
  }

  ngOnInit() {
    this.items = [
      { label: 'Kho hàng' },
      { label: 'Chuyển hàng', route: '/inputtext' }
    ];
    this.datas = [
      {
        id: 1,
        productImage:
          'http://static.sieuthimaynongnghiep.vn/w500/Uploaded/2018_06_20/p1177l4018slide_QQVH.jpg',
        productName: 'Máy Cắt Cỏ',
        inputValue: '',
        serialNumbers: ['SK212/SM18'],
        purchasePrice: null,
        unit: 'Cái',
        price: 1200000,
        inventory: 5,
        totalPrice: 6000000,
      },
      {
        id: 2,
        productImage:
          'http://static.sieuthimaynongnghiep.vn/w500/Uploaded/2018_06_20/p1177l4018slide_QQVH.jpg',
        productName: 'Máy Phun Thuốc',
        serialNumbers: [],
        purchasePrice: null,
        inputValue: '',
        unit: 'Bộ',
        price: 800000,
        inventory: 7,
        totalPrice: 5600000,
      },
      {
        id: 3,
        productImage:
          'http://static.sieuthimaynongnghiep.vn/w500/Uploaded/2018_06_20/p1177l4018slide_QQVH.jpg',
        productName: 'Máy Xới Đất',
        serialNumbers: ['SK314/SM28', 'SK315/SM29'],
        purchasePrice: null,
        inputValue: [],
        unit: 'Cái',
        inventory: 3,
        price: 1500000,
        totalPrice: 4500000,
      },
      {
        id: 4,
        productImage:
          'http://static.sieuthimaynongnghiep.vn/w500/Uploaded/2018_06_20/p1177l4018slide_QQVH.jpg',
        productName: 'Máy Bơm Nước',
        serialNumbers: [],
        purchasePrice: null,
        inputValue: '',
        unit: 'Cái',
        inventory: 2,
        price: 950000,
        totalPrice: 1900000,
      },
      {
        id: 5,
        productImage:
          'http://static.sieuthimaynongnghiep.vn/w500/Uploaded/2018_06_20/p1177l4018slide_QQVH.jpg',
        productName: 'Máy Nghiền Bột',
        serialNumbers: [],
        purchasePrice: null,
        inputValue: '',
        unit: 'Cái',
        inventory: 8,
        price: 2500000,
        totalPrice: 20000000,
      },
    ];
    this.stockInReceipt = {
      supplierId: '',
      // subquantity: '',
      // subtotal: '',
      note: '',
      inventoryStockInDetails: [],
      createdAt: new Date().toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),

      totalPrice: 0, // Tổng số tiền phải trả cho tất cả các sản phẩm/dịch vụ
      totalDiscountAmount: 0, // Tổng số tiền giảm giá đã được áp dụng
      totalAmountPaid: 0, // Tổng số tiền khách hàng đã thanh toán
      customerPayment: 0, // Số tiền mà khách hàng đã thanh toán trong lần giao dịch hiện tại
      moneyReturn: 0, // Số tiền phải trả lại cho khách hàng nếu họ thanh toán dư
      discountRate: 0, // Giá trị giảm giá (có thể là phần trăm (%) hoặc số tiền cụ thể)
      discountUnit: 'VND', // Đơn vị của giá trị giảm giá, ví dụ như 'VND' hoặc '%'
      paymentMethod: 'cash', // Phương thức thanh toán mà khách hàng sử dụng (ví dụ: 'cash', 'credit')
    };

    this.CallSnaphot();
    this.FillDataById();
  }

  CallSnaphot(): void {
    this.ladingId = +this.route.snapshot.paramMap.get('id')!;
  }

  showConfirmDialog(): void {
    this.displayConfirmation = true;
  }

  hideConfirmDialog(): void {
    this.displayConfirmation = false;
  }

  showConfirmDialog2(): void {
    this.displayConfirmation2 = true;
  }

  hideConfirmDialog2(): void {
    this.displayConfirmation2 = false;
  }

  showConfirmDialog3(): void {
    this.displayConfirmation3 = true;
  }

  hideConfirmDialog3(): void {
    this.displayConfirmation3 = false;
  }

  FillDataById(): void {
    const id = this.ladingId; // Lấy ID từ URL
    this.billOfLadingService.getLadingById(id)
      .subscribe((response: any) => {
        if (response && response.data) {
          this.ladingData = response.data;

          this.isAccept = this.ladingData.iAccepted === 'accept';
          this.isRejected = this.ladingData.iAccepted === 'reject';

          this.FromBranchId = this.ladingData?.fromBranchId;
          this.ToBranchId = this.ladingData?.toBranchId;

          const groupedProducts = this.groupProductsByVariant(this.ladingData?.inventoryStockDetailProductImeis);
          this.displayedProducts = groupedProducts;

          const groupedProducts2 = this.groupProductsByVariant2(this.ladingData?.productCodes);
          this.displayedProducts2 = groupedProducts2;

          this.totalQuantity = this.calculateTotalQuantity(groupedProducts);
          this.totalQuantity2 = this.calculateTotalQuantity(groupedProducts2);
          this.totalQuantityProduct = this.totalQuantity + this.totalQuantity2;
        }
      }, error => {
        console.error('Error fetching data:', error);
      });
  }

  displayedProductCodes(product: any): string[] {
    if (!product.productCode) return [];
    return product.productCode.slice(0, product.showAllCodes ? product.productCode.length : 3);
  }

  // Function to toggle code visibility
  toggleCodeVisibility(product: any): void {
    product.showAllCodes = !product.showAllCodes;
  }

  groupProductsByVariant(products: any[]): any[] {
    const productMap = new Map<string, any>();

    products.forEach(product => {
      const key = `${product.productId}-${product.productVariantId}`;
      if (productMap.has(key)) {
        const existingProduct = productMap.get(key);
        existingProduct.quantity += 1;
        existingProduct.totalAmountVariant = existingProduct.quantity * existingProduct.productVariantPrice;
        existingProduct.totalAmountProduct = existingProduct.quantity * existingProduct.productPrice;
        existingProduct.frameEngineNumbers.push(`${product.frameNumber} / ${product.engineNumber}`);
      }
      else {
        productMap.set(key, {
          productId: product.productId,
          productVariantId: product.productVariantId,
          productName: product.productName,
          productVariantName: product.productVariantName,
          productImage: product.productImage,
          productVariantImage: product.productVariantImage,
          productPrice: product.productPrice,
          productVariantPrice: product.productVariantPrice,
          totalAmountProduct: product.productPrice,
          totalAmountVariant: product.productVariantPrice,
          quantity: 1,
          frameEngineNumbers: [`${product.frameNumber} / ${product.engineNumber}`]
        });
      }
    });

    return Array.from(productMap.values()); // Convert map values to an array
  }

  // groupProductsByVariant2(products: any[]): any[] {
  //   const productMap = new Map<string, any>();

  //   products.forEach(product => {
  //     const key = `${product.productId}-${product.productVariantId}`;

  //     if (productMap.has(key)) {
  //       const existingProduct = productMap.get(key);
  //       existingProduct.quantity += 1;
  //       existingProduct.totalAmountVariant = existingProduct.quantity * existingProduct.productVariantPrice;
  //       existingProduct.totalAmountProduct = existingProduct.quantity * existingProduct.productPrice;

  //       // Check if the product's inventoryStockInDetailId is the same
  //       const inventoryKey = product.inventoryStockInDetailId;
  //       if (existingProduct.inventoryStockInDetailId === inventoryKey) {
  //         existingProduct.productCode.push(product.code);
  //       } else {
  //         // If inventoryStockInDetailId is different, start a new group
  //         existingProduct.productCode.push(product.code);
  //       }
  //     } else {
  //       // New product group
  //       productMap.set(key, {
  //         productId: product.productId,
  //         productVariantId: product.productVariantId,
  //         productName: product.productName,
  //         productVariantName: product.productVariantName,
  //         productImage: product.productImage,
  //         productVariantImage: product.productVariantImage,
  //         productPrice: product.productPrice,
  //         productVariantPrice: product.productVariantPrice,
  //         totalAmountProduct: product.productPrice,
  //         totalAmountVariant: product.productVariantPrice,
  //         quantity: 1,
  //         productCode: [product.code],
  //         inventoryStockInDetailId: product.inventoryStockInDetailId
  //       });
  //     }
  //   });

  //   return Array.from(productMap.values());
  // }

  groupProductsByVariant2(products: any[]): any[] {
    const productMap = new Map<string, any>();

    products.forEach(product => {
      const key = `${product.productId}-${product.productVariantId}`;
      if (productMap.has(key)) {
        const existingProduct = productMap.get(key);
        existingProduct.quantity += 1;
        existingProduct.totalAmountVariant = existingProduct.quantity * existingProduct.productVariantPrice;
        existingProduct.totalAmountProduct = existingProduct.quantity * existingProduct.productPrice;
        existingProduct.productCode.push(`${product.code}`);
      }
      else {
        productMap.set(key, {
          productId: product.productId,
          productVariantId: product.productVariantId,
          productName: product.productName,
          productVariantName: product.productVariantName,
          productImage: product.productImage,
          productVariantImage: product.productVariantImage,
          productPrice: product.productPrice,
          productVariantPrice: product.productVariantPrice,
          totalAmountProduct: product.productPrice,
          totalAmountVariant: product.productVariantPrice,
          quantity: 1,
          productCode: [`${product.code}`]
        });
      }
    });

    return Array.from(productMap.values());
  }

  calculateTotalQuantity(products: any[]): number {
    return products.reduce((total, product) => total + product.quantity, 0);
  }

  onConfirm(): void {
    this.ladingData.iAccepted = 'accept';
    this.onSubmitUpdate();
  }

 
  onReject(): void {
    this.ladingData.iAccepted = 'reject'; // Gán giá trị "reject" cho iAccepted
    this.onSubmitUpdate(false); // Chỉ gọi API đầu tiên khi reject
  }

  onSubmitUpdate(callSecondApi: boolean = true): void {
    // Prepare common data
    const rejectLadingData = {
      id: this.ladingId,
      iAccepted: this.ladingData.iAccepted,
      recipientNote: this.recipientNote,
      inventoryStockDetailProductImeis: this.ladingData.inventoryStockDetailProductImeis.map((item: any) => ({
        productId: item.productId,
        productVariantId: item.productVariantId,
        productName: item.productName,
        productVariantName: item.productVarriantName,
        inventoryStockDetailProductImeiId: item.id
      })),
      fromBranchId: this.ladingData.fromBranchId,
      toBranchId: this.ladingData.toBranchId,
      fromBranchName: this.ladingData.fromBranchName,
      toBranchName: this.ladingData.toBranchName,
      productCodeBills: this.ladingData.productCodes.map((item: any) => ({
        productId: item.productId,
        productVariantId: item.productVariantId,
        productName: item.productName,
        productVariantName: item.productVarriantName,
        productCodeId: item.id
      }))
    };

    if (callSecondApi) {
      // Call the update API
      this.billOfLadingService.updateLading(rejectLadingData).subscribe(
        (response1) => {
          console.log('Cập nhật bill of lading thành công', response1);
          this.hideConfirmDialog2();
          this.messageService.add({
            severity: 'success',
            summary: '',
            detail: 'Chuyển hàng thành công',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/pages/stock-transfer']);
          }, 2000);
        },
        (error1) => {
          console.error('Lỗi cập nhật bill of lading', error1);
        }
      );
    } else {
      // Call the reject API
      this.billOfLadingService.rejectLading(rejectLadingData).subscribe(
        (response2) => {
          console.log('Đã hủy đơn chuyển hàng', response2);
          if (this.userCurrent?.branchId === this.ToBranchId) {
            this.hideConfirmDialog3();
            this.messageService.add({
              severity: 'warn',
              summary: '',
              detail: 'Đơn nhận hàng đã bị hủy',
              life: 3000,
            });
            setTimeout(() => {
              this.router.navigate(['/pages/stock-receive']);
            }, 2000);
          }

          if (this.userCurrent?.branchId === this.FromBranchId) {
            this.hideConfirmDialog();
            this.messageService.add({
              severity: 'warn',
              summary: '',
              detail: 'Đơn chuyển hàng đã bị hủy',
              life: 3000,
            });
            setTimeout(() => {
              this.router.navigate(['/pages/stock-transfer']);
            }, 2000);
          }
        
        },
        (error2) => {
          console.error('Lỗi khi hủy đơn chuyển hàng', error2);
        }
      );
    }
  }

  
}
