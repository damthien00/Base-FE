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
import { Router } from '@angular/router';
import { OptionsFilterProductVariant } from 'src/app/core/DTOs/stock-in/optionFilterProductVariant';
import { StockInService } from 'src/app/core/services/stock-in.service';
import { WarrantyPolicyService } from 'src/app/core/services/warranty-policy.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { BranchService } from 'src/app/core/services/branch.service';

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
  selector: 'app-branch-transfer',
  templateUrl: './branch-transfer.component.html',
  styleUrl: './branch-transfer.component.scss',
  providers: [MessageService],
})
export class BranchTransferComponent implements OnInit {
  imageUrl: string = environment.imageUrl;
  @ViewChild('searchInput') searchInput!: ElementRef;
  items1: MenuItem[] | undefined;
  datas: any;
  nodes!: any[];
  selectedNodes: any;
  treeCategory: any[] = [];
  branch: any[] = [];
  activeBarcode: boolean = false;
  stockInReceipt: any;
  filteredDatas: any;
  showProducts = false;
  showImeiTable = false;
  isValidForm: boolean = true;
  temporaryDiscountRate: number = 0;
  temporaryDiscountUnit: string = 'VND';
  public userCurrent: any;
  selectedBranch: any;
  items!: any[];
  items2!: any[];
  totalRecords!: number;
  totalRecords2!: number;
  branchError: boolean = false;
  productCodeSearchTerm: string = '';

  displayDiscountModal = false;
  optionsFilterProduct: OptionsFilterProduct = new OptionsFilterProduct();
  frameNumber: any;
  engineNumber: any;
  availableQuantity: any;
  showProductCodesDialog: boolean = false;
  showFrameEnginDialog: boolean = false;
  selectedProduct: any = null;
  selectedFrameEngin: any = null;

  imeiData: any[] = [];
  frameEngineData: any[] = [];

  onBarcode: boolean = false;
  constructor(
    private nodeService: NodeService,
    private productService: ProductService,
    private stockInService: StockInService,
    public functionService: FunctionService,
    private messageService: MessageService,
    private warrantyService: WarrantyPolicyService,
    private merchandiseService: MerchandiseService,
    private authService: AuthService,
    private branchService: BranchService,
    private router: Router
  ) {
    this.nodeService.getFiles().then((files) => (this.nodes = files));

    this.authService.userCurrent.subscribe((user) => {
      this.userCurrent = user;
    });
  }

  ngOnInit() {
    this.items1 = [
      { label: 'Kho hàng' },
      { label: 'Chuyển hàng', route: '/inputtext' },
      { label: 'Tạo phiếu chuyển hàng', route: '/inputtext' },
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

    this.loadWarrantyPolicies()
  }

  loadWarrantyPolicies() {
    this.branchService.getBranchsAll().subscribe((response: any) => {
      this.branch = response.data.items
        .filter((option: any) =>
          option.id !== this.userCurrent?.branchId && option.isActive !== 0 // Filter out the current branch and inactive branches
        )
        .map((option: any) => {
          return {
            ...option,
            shortenedName: this.shortenName(option.name, 30) // Giới hạn độ dài tên
          };
        });
    });
  }

  shortenName(name: string, maxLength: number): string {
    if (name.length > maxLength) {
      return name.slice(0, maxLength) + '...'; // Cắt ngắn và thêm ...
    }
    return name;
  }

  async onProductSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();
    if (this.onBarcode) {
      this.optionsFilterProduct.pageIndex = 1;
      this.optionsFilterProduct.pageSize = 1;
      this.optionsFilterProduct.KeyWord = '';
      this.optionsFilterProduct.Barcode = searchTerm.toLowerCase();
      try {
        const response =
          await this.stockInReceipt.FilterProductVariants(
            this.optionsFilterProduct
          );
        if (response.data.length > 0) {
          console.log(response.data);
          this.addToCart(response.data[0]);
        } else {
          // Hiển thị thông báo sản phẩm không tồn tại
          this.messageService.add({
            severity: 'success',
            summary: '',
            detail: 'Sản phẩm không tồn tại',
          });
        }
      } finally {
      }
    } else {
      this.optionsFilterProduct.pageIndex = 1;
      this.optionsFilterProduct.pageSize = 10;
      this.optionsFilterProduct.KeyWord = searchTerm.toLowerCase();
      this.optionsFilterProduct.Barcode = null;
      try {
        // const response =
        //     await this.productService.SearchProductVariants(
        //         this.optionsFillerProduct
        //     );
        // this.filteredDatas = response.data;
        this.loadProducts();
      } finally {
      }
    }
  }

  showProductList(): void {
    if (this.onBarcode) {
      this.showProducts = false;
    } else {
      this.showProducts = true;
      this.loadProducts();
    }
  }

  toggleEdit(data: any, saveChanges: boolean = false): void {
    if (saveChanges) {
      this.validateQuantity(data); // Validate the entered quantity
    }
    data.isEditing = !data.isEditing;
  }

  toggleEdit2(data: any, saveChanges: boolean = false): void {
    if (saveChanges) {
      this.validateQuantity(data); // Validate the entered quantity
    }
    data.isEditing2 = !data.isEditing2;
  }

  validateQuantity(data: any): void {
    if (data.quantity > data.availableQuantity) {
      data.isValid = true; // Trigger the error message
      data.isValidMessageQuantity = `Số lượng không được vượt quá ${data.availableQuantity}`;
      // data.quantity = this.availableQuantity; // Reset quantity to availableQuantity
    } else {
      data.isValid = false;
      data.isValidMessageQuantity = null;
    }
  }

  async loadProducts() {
    this.optionsFilterProduct.pageIndex = 1;
    this.optionsFilterProduct.pageSize = 100000;
    let response = await this.productService.FilterProductView(
      this.optionsFilterProduct
    );

    let listP = [];

    response.data.forEach((item: any) => {
      if (item.productVariants && item.productVariants.length > 0) {
        item.productVariants.forEach((itemVariant) => {
          listP.push({
            productId: item.id,
            productImage: itemVariant.linkImage, // Lấy hình ảnh từ itemVariant
            productVariantId: itemVariant.id,
            name: item.name,
            productName:
              item.name +
              '-' +
              (itemVariant.valuePropeties1 || '') +
              '-' +
              (itemVariant.valuePropeties2 || ''),
            productType: item.productType,
            warrantyPolicyId: item.warrantyPolicyId,
            quantity: item.productType === 1 ? 0 : 1,
            productCode: itemVariant.code || '', // Đảm bảo mã sản phẩm
            price: itemVariant.price,
            unit: item.unitName,
            mass: itemVariant.quantity
              ? itemVariant.quantity
              : 0,
            total:
              item.productType === 1 ? 0 : itemVariant.price * 1,
            frameNumber: '',
            engineNumber: '',
          });
        });
      } else {
        listP.push({
          productId: item.id,
          productImage:
            item.productImages && item.productImages.length > 0
              ? item.productImages[0].link
              : null,
          productName: item.name,
          productType: item.productType,
          warrantyPolicyId: item.warrantyPolicyId,
          quantity: item.productType === 1 ? 0 : 1,
          productCode: item.code || '', // Đảm bảo mã sản phẩm
          price: item.sellingPrice,
          unit: item.unitName,
          mass: item.totalQuantity,
          total: item.productType === 1 ? 0 : item.sellingPrice * 1,
          frameNumber: '',
          engineNumber: '',
        });
      }
    });
    console.log(listP);

    this.filteredDatas = listP;

    // console.log(this.filteredDatas);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const searchContainer = document.querySelector('.box-search');
    if (searchContainer && !searchContainer.contains(target)) {
      this.showProducts = false;
    }
  }

  onProductListClick(event: MouseEvent): void {
    this.showProducts = true; // Prevent the click event from hiding the product list
  }

  onNodeSelect(event: any) {
    console.log(event);
    // this.optionsFillerProduct.CategoryId = this.selectedNodes?.id;
    let label = document.querySelector(
      '.category-select .p-treeselect-label'
    );
    if (label) {
      label.innerHTML = this.selectedNodes?.name || '';
    }
  }

  onClear() {
    // this.optionsFillerProduct.CategoryId = null;
    let label = document.querySelector(
      '.supplier-select .p-treeselect-label'
    );
    if (label) {
      label.innerHTML = 'Chọn danh mục';
    }
  }

  onBranchChange() {
    // Ẩn thông báo lỗi khi chi nhánh được chọn
    this.branchError = !this.selectedBranch; // Nếu không chọn chi nhánh, hiển thị lỗi
  }

  onEnter(dataId: number) {
    const data = this.datas.find((p: any) => p.id === dataId);
    console.log(data);
    if (data && data.inputValue.trim()) {
      data.serialNumbers.push(data.inputValue.trim());
      data.inputValue = ''; // Clear input value for that product
    }
  }

  createWarehouseReceipt(receipt: WarehouseReceipt): void {
    // Gọi API để tạo phiếu nhập kho ở đây
    console.log('Phiếu nhập kho:', receipt);
    // Bạn có thể sử dụng HttpClient để gửi dữ liệu lên server
    // this.http.post('/api/warehouse-receipts', receipt).subscribe(response => {
    //   console.log('Tạo phiếu nhập kho thành công:', response);
    // }, error => {
    //   console.error('Lỗi khi tạo phiếu nhập kho:', error);
    // });
  }

  openProductCodesDialog(data: any): void {
    this.selectedProduct = data;
    this.showProductCodesDialog = true;
  }

  openProductFrameEnginDialog(data: any): void {
    this.selectedFrameEngin = data;
    this.showFrameEnginDialog = true;
  }

  async fetchProductImeiData(productId: number, productVariantId: number, branchId: number) {
    try {
      const response = await this.merchandiseService.getProductDetails(productId, productVariantId, branchId).toPromise();
      this.items = response.data.items;
      this.totalRecords = response.data.totalRecords;

      // Find the product in the cart and add its frame/engine data
      const productInCart = this.stockInReceipt.inventoryStockInDetails.find(
        (detail) => detail.productId === productId && detail.productVariantId === productVariantId
      );
      if (productInCart) {
        productInCart.frameEngineData = this.items; // Store the frame/engine data specific to this product
      }

      return response; // Return the response object
    } catch (error) {
      console.error('Error fetching product IMEI data', error);
    }
  }

  searchByProductCode() {
    const { productId, productVariantId } = this.selectedProduct;

    this.merchandiseService.getProductCode(productId, productVariantId, this.userCurrent?.branchId, 0, 0, 1000, 1, this.productCodeSearchTerm)
      .subscribe(response => {
        this.selectedProduct.productCodeData = response.data.items;
        this.totalRecords2 = response.data.totalRecords;
      }, error => {
        console.error('Error fetching product code data', error);
      });
  }

  async fetchProductCodeData(productId: number, productVariantId: number, branchId: number) {
    try {
      const response = await this.merchandiseService.getProductCode(productId, productVariantId, branchId).toPromise();
      this.items2 = response.data.items;
      this.totalRecords2 = response.data.totalRecords;

      // Find the product in the cart and add its frame/engine data
      const productInCart = this.stockInReceipt.inventoryStockInDetails.find(
        (detail) => detail.productId === productId && detail.productVariantId === productVariantId
      );
      if (productInCart) {
        productInCart.productCodeData = this.items2; // Store the product code data specific to this product
      }

      return response; // Return the response object
    } catch (error) {
      console.error('Error fetching product code data', error);
    }
  }

  async fetchAvailableQuantity(productId: number, productVariantId: number, branchId: number) {
    try {
      const response = await this.merchandiseService.getCheckQuantity(productId, productVariantId, branchId).toPromise();
      return response?.data?.quantity || 0; // Trả về số lượng có sẵn
    } catch (error) {
      console.error('Error fetching available quantity', error);
      return 0;
    }
  }

  addToCart(item: any): void {
    console.log(item);

    // Check if the product already exists in the cart
    const existingDetail = this.stockInReceipt.inventoryStockInDetails.find(
      (detail: any) => {
        const isProductVariantIdExist =
          detail.productVariantId !== undefined &&
          item.productVariantId !== undefined;
        return (
          detail.productId === item.productId &&
          (!isProductVariantIdExist ||
            detail.productVariantId === item.productVariantId)
        );
      }
    );

    if (existingDetail) {
      // If the product already exists, update the quantity and total price
      this.messageService.add({
        severity: 'warn',
        summary: 'Chú ý',
        detail: 'Sản phẩm đã có trong danh sách',
      });
    } else {
      // If the product doesn't exist, add a new entry
      const newDetail = {
        productId: item.productId,
        productImage: item.productImage,
        name: item.name,
        productName: item.productName,
        productVariantId: item.productVariantId,
        warrantyPolicyId: item.warrantyPolicyId,
        productType: item.productType,
        quantity: item.productType === 1 ? (item.frameEngineData && item.frameEngineData.length > 0 ? 0 : 1) : 1,
        productCode: item.productCode ? '' : '',
        price: item.price,
        unit: item.unit,
        total: item.productType === 1 ? 0 : item.price * 1,
        frameNumber: '',
        engineNumber: '',
        branchId: this.userCurrent?.branchId,
        branchName: this.userCurrent?.branchName,
        frameEngineData: [],
        totalRecords: 0,  // Add totalRecords here
        totalRecords2: 0   // Add totalRecords2 here
      };

      this.stockInReceipt.inventoryStockInDetails.push(newDetail);

      // Use Promise.all to fetch both data
      Promise.all([
        // this.fetchProductImeiData(item.productId, item.productVariantId, this.userCurrent?.branchId),
        this.fetchProductCodeData(item.productId, item.productVariantId, this.userCurrent?.branchId)
      // ]).then(([imeiResponse, codeResponse]) => {
      ]).then(([imeiResponse]) => {
        const productInCart = this.stockInReceipt.inventoryStockInDetails.find(
          (detail) => detail.productId === item.productId && detail.productVariantId === item.productVariantId
        );

        if (productInCart) {
          // Update totalRecords and totalRecords2 from the respective responses
          productInCart.totalRecords = imeiResponse.data.totalRecords;
          // productInCart.totalRecords2 = codeResponse.data.totalRecords;

          // Update quantity based on the frameEngineData
          productInCart.quantity = productInCart.frameEngineData && productInCart.frameEngineData.length > 0 ? 0 : 0;
        }

        // Update related values and refresh UI
        this.updatePaymentInfo();
        this.showProducts = false;
        this.searchInput.nativeElement.value = '';
        console.log(this.stockInReceipt);
      }).catch(error => {
        console.error('Error fetching product data', error);
      });
    }
  }


  updateTotal(data: any) {
    data.total = data.price * data.quantity || data.price;
    this.checkValidity();
    this.updatePaymentInfo();
  }

  updatePaymentInfo(): void {
    // Tính tổng số tiền
    const totalPrice = this.stockInReceipt.inventoryStockInDetails.reduce(
      (sum, detail) => sum + detail.total,
      0
    );

    // Cập nhật totalPrice
    this.stockInReceipt.totalPrice = totalPrice;

    // Giả sử bạn có logic tính chiết khấu dựa trên totalPrice
    // const discountAmount = this.calculateDiscount(totalPrice);

    // Cập nhật chiết khấu và tổng số tiền
    this.stockInReceipt.totalAmountPaid =
      totalPrice - this.stockInReceipt.totalDiscountAmount;

    // Tính toán số tiền hoàn trả nếu khách hàng trả dư
    this.stockInReceipt.moneyReturn =
      this.stockInReceipt.customerPayment -
      this.stockInReceipt.totalAmountPaid;

    this.checkValidity();
  }

  calculateDiscount(totalPrice: number): number {
    // Giả sử bạn có logic tính chiết khấu, ví dụ 10% chiết khấu nếu totalPrice > 1000
    // if (totalPrice > 1000) {
    //     return totalPrice * 0.1; // 10% chiết khấu
    // }
    return 0;
  }

  removeProduct(index: number) {
    this.stockInReceipt.inventoryStockInDetails.splice(index, 1);
    this.updatePaymentInfo();
    console.log(this.stockInReceipt);
  }

  onDiscountOptionClick(unit: string) {
    this.temporaryDiscountUnit = unit;
  }

  openDiscountModal() {
    this.temporaryDiscountRate = this.stockInReceipt.discountRate;
    this.temporaryDiscountUnit = this.stockInReceipt.discountUnit;
    this.displayDiscountModal = true;
  }

  calculateTotalDiscount(): number {
    this.stockInReceipt.discountRate = this.temporaryDiscountRate;
    this.stockInReceipt.discountUnit = this.temporaryDiscountUnit;
    // Giả định bạn muốn tính toán giảm giá dựa trên tỷ lệ hoặc giá trị
    if (this.stockInReceipt.discountUnit === '%') {
      return (
        (this.stockInReceipt.totalPrice *
          this.stockInReceipt.discountRate) /
        100
      );
    } else {
      return this.stockInReceipt.discountRate;
    }
  }

  saveDiscount() {
    this.stockInReceipt.totalDiscountAmount = this.calculateTotalDiscount();
    console.log(this.stockInReceipt.totalDiscountAmount);
    console.log(this.stockInReceipt);
    this.updatePaymentInfo();
    this.displayDiscountModal = false;
  }

  onEnterTest(product: any) {
    const imeiItem = {
      frameNumber: product.frameNumber,
      engineNumber: product.engineNumber,
    };
    // Nếu mảng productImeis chưa tồn tại, khởi tạo nó
    if (!product.productImeis) {
      product.productImeis = [];
    }

    // Đẩy đối tượng mới vào mảng productImeis
    product.productImeis.push(imeiItem);
    product.quantity = product.productImeis.length;
    product.total = product.quantity * product.price;
    this.updatePaymentInfo();
    // Xóa giá trị trong form sau khi đẩy vào mảng
    product.frameNumber = '';
    product.engineNumber = '';
    this.checkValidity();
  }

  removeImeiItem(product: any, index: number) {
    product.productImeis.splice(index, 1);
    product.quantity = product.productImeis.length;
    product.total = product.quantity * product.price;
    this.updatePaymentInfo();
  }

  updateQuantity(data: any) {
    // Calculate the number of selected checkboxes
    const checkedCount = data.frameEngineData.filter((frame: any) => frame.isChecked).length;

    // Update the quantity based on the selected checkboxes
    data.quantity = checkedCount;

    // Check if no checkboxes are selected and the quantity is 0 or less
    if (data.quantity <= 0) {
      data.isValid = true;
      data.isValidMessage = 'Vui lòng chọn ít nhất một Số khung/Số máy';
      data.isValidMessage2 = 'Số lượng > 0';
    } else {
      data.isValid = false;
      data.isValidMessage = '';
      data.isValidMessage2 = '';
    }

    this.updateTotal(data);
  }

  updateQuantity2(data: any) {
    // Calculate the number of selected checkboxes
    const checkedCountCode = data.productCodeData.filter((code: any) => code.isChecked).length;

    // Update the quantity based on the selected checkboxes
    data.quantity = checkedCountCode;

    // Check if no checkboxes are selected and the quantity is 0 or less
    if (data.quantity <= 0) {
      data.isValid1 = true;
      data.isValidMessage3 = 'Vui lòng chọn ít nhất một mã code';
      data.isValidMessage4 = 'Số lượng > 0';
    } else {
      data.isValid1 = false;
      data.isValidMessage3 = '';
      data.isValidMessage4 = '';
    }

    this.updateTotal(data);
  }

  preventInput(event: KeyboardEvent) {
    event.preventDefault();
  }

  onSubmit() {
    if (!this.selectedBranch) {
      this.branchError = true;
      return
    }
    let hasError = false;

    this.stockInReceipt.inventoryStockInDetails.forEach((product) => {
      if (product.quantity == 0) {
        product.isValid = true;
        product.isValidMessage = 'Vui lòng chọn ít nhất một Số khung/Số máy';
        product.isValidMessage2 = 'Số lượng > 0';
        hasError = true;
      } else {
        product.isValid = false;
        delete product.isValidMessage; // Loại bỏ isValidMessage nếu không còn lỗi
        delete product.isValidMessage2; // Loại bỏ isValidMessage nếu không còn lỗi
      }
    });

    if (hasError) {
      this.messageService.add({
        severity: 'error',
        summary: 'Không thể lưu vì:',
        detail: 'Thông tin đang có lỗi cần được chỉnh sửa',
      });
      return; // Prevents calling the actual onSubmit logic
    }
    this.checkValidity();
    const inventoryStockDetailProductImeis = this.stockInReceipt.inventoryStockInDetails
      .filter(product => product.productType === 1) // Only include products with productType === 1
      .flatMap(product =>
        product.frameEngineData
          .filter(frameEngine => frameEngine.isChecked) // Only take selected frame/engine
          .map(frameEngine => ({
            inventoryStockDetailProductImeiId: frameEngine.id, // frameEngine ID
            productId: product.productId, // Add productId
            productVariantId: product.productVariantId, // Add productVariantId
            productName: product.name || product.productName, // Add productName
            productVariantName: product.productName // Add productVariantName
          }))
      );

    const productCodeBills = this.stockInReceipt.inventoryStockInDetails
      .filter(product => product.productType === 0 || product.productType === 1)
      .flatMap(product =>
        product.productCodeData
          .filter(code => code.isChecked)
          .map((code) => ({
            productId: product.productId,
            productVariantId: product.productVariantId,
            productName: product.name || product.productName,
            productVariantName: product.productName,
            productCodeId: code.id,
          }))
      );

    const selectedBranch = this.branch.find(option => option.id === this.selectedBranch);
    const toBranchId = selectedBranch ? selectedBranch.id : 0; // Replace with actual logic if needed
    const toBranchName = selectedBranch ? selectedBranch.name : 'string';

    const formData = {
      fromBranchId: this.userCurrent?.branchId, // Get fromBranchId from the current user
      fromBranchName: this.userCurrent?.branchName, // Get fromBranchName from the current user
      toBranchId: toBranchId,
      toBranchName: toBranchName,
      totalCount: this.stockInReceipt.inventoryStockInDetails.length, // Number of items
      note: this.stockInReceipt.note || '',
      isDeleted: 0,
      iAccepted: 'waiting',
      recipientNote: 'string',
      inventoryStockDetailProductImeis: inventoryStockDetailProductImeis,
      productCodeBills: productCodeBills,
    };

    this.merchandiseService.createladingIn(formData).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Thêm phiếu chuyển hàng thành công',
        });

        setTimeout(() => {
          this.router.navigate(['/pages/stock-transfer']);
        }, 1000); // Thời gian trễ 2 giây
      },
      (error) => {
        // Xử lý khi lỗi
        console.error('Error creating inventoryStockIn:', error);
      }
    );
  }

  checkValidity() {
    if (this.stockInReceipt.inventoryStockInDetails.length == 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Chú ý',
        detail: 'Phiếu chuyển hàng chưa có sản phẩm',
      });
      this.isValidForm = false;
      return;
    }

    // Kiểm tra giá trị thanh toán và tổng giảm giá
    if (
      this.stockInReceipt.customerPayment ===
      this.stockInReceipt.totalAmountPaid
    ) {
      this.nodeService.getFiles().then((files) => (this.nodes = files));
    }
  }

  onBarcodeClick() {
    this.activeBarcode = !this.activeBarcode;
    if (this.onBarcode) {
      this.messageService.add({
        severity: 'success',
        summary: '',
        detail: 'Chuyển sang chế độ thường',
      });
    } else {
      this.messageService.add({
        severity: 'success',
        summary: '',
        detail: 'Chuyển sang chế độ barcode',
      });
    }
    this.onBarcode = !this.onBarcode;
  }
  // onToggleActiveBarcode() {}
}
