import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { FunctionService } from 'src/app/core/utils/function.utils';
import {
  Component,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { Table } from 'primeng/table';
import { Brand } from 'src/app/core/models/brands';
import { BrandService } from 'src/app/core/services/brand.service';
import { CollectionService } from 'src/app/core/services/collection.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';
import { Products, ProductVariant } from 'src/app/core/models/product';
import { Router } from '@angular/router';
import { WarrantyPolicyService } from 'src/app/core/services/warranty-policy.service';

interface selected {
  id: number;
}

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
  providers: [MessageService]
})
export class CreateProductComponent implements OnInit{
  @ViewChild('dataTable', { static: true }) dataTable!: Table;
  @ViewChild('videoInput') videoInput!: ElementRef;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  items: MenuItem[] | undefined;
  cols!: any[];
  selectedUnit: any = null;
  error: any;
  selectedVideo: File | null = null;
  selectedParent: number = 0;
  showSubcategories: boolean = false;
  isVideoValid = true;
  videoUrl: any = null;
  videoDuration!: string | null;
  isFullScreen: boolean = false;
  isEditing: boolean = false;
  videoSelected: boolean = false;
  maxImages: number = 9;
  base64_FileVideo: string | null = null;
  base64_FileImage: string | null = null;
  base64_FileIamges: { file: File; preview: string }[] = [];
  productVariants: any[] = [];
  showPropertiesInput: boolean[] = [true];
  generateNewInput: boolean = false;
  isInputVisible = true;
  isInputVisible2 = true;
  formattedPrice: string | null = null;
  formattedPriceSale: string | null = null;
  isSerialProduct: boolean = false;

  productForm!: FormGroup;
  selectedCategory: TreeNode | null = null;
  parentCategories: TreeNode[] | null = null;
  categorieandchild: TreeNode[] = [];
  brands: Brand[] = [];
  selectedBrand: selected | null = null;
  selectedCollection: selected | null = null;
  messages: any[] = [];
  isCategorySelected: boolean = false;
  isTreeSelectFocused: boolean = false;
  showNameError: boolean = false;
  showNameError2: boolean = false;
  showNameError3: boolean = false;
  showNameError4: boolean = false;
  showNameError5: boolean = false;
  showNameError6: boolean = false;
  showNameError7: boolean = false;
  showNameError8: boolean = false;
  showNameError9: boolean = false;
  showNameError10: boolean = false;
  showNameError11: boolean = false;
  showNameError12 = false;
  showNameError13 = false;
  showNameError14 = false;
  showNameError15 = false;
  errorMessage = '';
  errorMessage2 = '';
  errorMessage3 = '';
  showNameErrorAll: any[] = [];
  isBrandSelected: boolean = false;
  addVariants: boolean = false;
  isSubmitting: boolean = false;
  imageSelected: boolean[] = [];
  validationMessage: string | null = null;
  addVariants2: boolean = false;
  buttonVariants: boolean = true;
  buttonVariants2: boolean = true
  showDescriptionEditor = false;
  data: any[] = [{}];
  isWarrantyApplied: boolean = false;  // Trạng thái công tắc
  warrantyOptions: any[] = [];

  units = [{ name: 'Kg' }, { name: 'Lít' }, { name: 'Cái' }];

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private collectionService: CollectionService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private warrantyService: WarrantyPolicyService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.productForm = this.fb.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(101),
          this.validateName.bind(this)
        ]),
      ],
      description: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(500),
        ]),
      ],
      sellingPrice: [null, [Validators.required, Validators.min(1)]],
      importPrice: [null, [Validators.required, Validators.min(1)]],
      totalQuantity: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      brandId: [null, [Validators.required]],
      collectionId: [null],
      barcode: [null],
      sku: [null],
      mass: [null, [Validators.required, Validators.min(0.01)]],
      width: [null, [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      hight: [null, [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      length: [
        null,
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      warrantyPolicyId: [null, [Validators.required]],
      productType: [0],
      base64_FileIamges: [[], [Validators.required]],
      base64_FileVideo: [null, []],
      propeties1: [null, Validators.required],
      propeties2: [null, Validators.required],
      valuePropeties1: this.fb.array([this.fb.control('')]),
      valuePropeties2: this.fb.array([this.fb.control('')]),
      globalPrice: [null, [Validators.required, Validators.min(0)]],
      globalWare: [null, Validators.required],
      base64_FileImage: ['', [Validators.required]],
      status: new FormControl<boolean>(true),
      unit: ['kg'],
      warning: [false],
      numberDay: [{ value: '', disabled: true }, Validators.required],
      unitName: [null]
    });

     // Thêm ô input price cho mỗi hàng của valueProperties1
     for (let i = 0; i < this.valueProperties1Array.length; i++) {
      this.productForm.addControl(
        `price${i}`,
        this.fb.control(0, [Validators.required, Validators.min(0)])
      );
      this.productForm.addControl(
        `quantity${i}`,
        this.fb.control(0, Validators.required)
      );
      this.productForm.addControl(`base64_FileImage${i}`, this.fb.control(''));
      for (let j = 0; j < this.valueProperties2Array.length; j++) {
        this.productForm.addControl(
          this.getPriceControlName(i, j),
          this.fb.control('', [Validators.required, Validators.min(0)])
        );
        this.productForm.addControl(
          this.getWareControlName(i, j),
          this.fb.control('', Validators.required)
        );
        this.productForm.addControl(
          this.getSkuControlName(i, j),
          this.fb.control('', Validators.required)
        );
        this.productForm.addControl(
          this.getBarcodeControlName(i, j),
          this.fb.control('', Validators.required)
        );
      }
    }

    this.updateProperties1Header();
    this.updateProperties2Header();
  }

  ngOnInit() {
    this.items = [
      { icon: 'pi pi-home', route: '/installation' },
      { label: 'Sản phẩm' },
      { label: 'Thêm mới' }
    ];
    this.getAllBrands();
    this.getCategoriesAndChild();

    this.productForm.get('sellingPrice')?.valueChanges.subscribe((newSellingPrice) => {
      if (this.addVariants) {
        this.updatePriceControls(newSellingPrice);
      }
    });

    this.productForm.get('totalQuantity')?.valueChanges.subscribe((newtotalQuantity) => {
      if (this.addVariants) {
        this.updateWareControls(newtotalQuantity);
      }
    });

    this.productForm.get('productType').valueChanges.subscribe((value) => {
      if (value === 1) {
        // Nếu chọn sản phẩm Serial/iMei thì đặt totalQuantity về null
        this.productForm.get('totalQuantity').setValue(null);
      }
    });
  }

  onInput1(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (input) {
      this.showNameError12 = false;  // Ẩn thông báo lỗi khi người dùng nhập dữ liệu
    }
  }

  onInput2(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (input) {
      this.showNameError14 = false;  // Ẩn thông báo lỗi khi người dùng nhập dữ liệu
    }
  }

  onInput3(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (input) {
      this.showNameError15 = false;  // Ẩn thông báo lỗi khi người dùng nhập dữ liệu
    }
  }
  

  onWarrantySwitchChange(event: any) {
    this.isWarrantyApplied = event.checked;

    if (this.isWarrantyApplied) {
      this.loadWarrantyPolicies();
    }
  }

  loadWarrantyPolicies() {
    this.warrantyService.getWarrantyPolicies().subscribe((response: any) => {
      this.warrantyOptions = response.data.items.map((option: any) => {
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

  updatePriceControls(newPrice: string) {
    if (!this.addVariants) {
      return;
    }

    this.valueProperties1Array.controls.forEach((control, i) => {
      this.valueProperties2Array.controls.forEach((subControl, j) => {
        const priceControlName = this.getPriceControlName(i, j);
        const priceControl = this.productForm.get(priceControlName);
  
        if (priceControl) {
          priceControl.setValue(newPrice);
        }
      });
    });
  }

  validateName(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value as string;
    let startIndex = 0;
    let endIndex = value.length - 1;

    while (
      startIndex < value.length &&
      (value[startIndex] === ' ' || value[startIndex] === '')
    ) {
      startIndex++;
    }

    while (
      endIndex >= 0 &&
      (value[endIndex] === ' ' || value[endIndex] === '')
    ) {
      endIndex--;
    }

    if (startIndex > endIndex) {
      return { invalidName: true };
    }

    const trimmedLength = endIndex - startIndex + 1;
    if (trimmedLength < 6 || trimmedLength > 101) {
      return { invalidLength: true };
    }

    return null;
  }

  updateWareControls(newWare: string) {
    if (!this.addVariants) {
      return;
    }

    this.valueProperties1Array.controls.forEach((control, i) => {
      this.valueProperties2Array.controls.forEach((subControl, j) => {
        const wareControlName = this.getWareControlName(i, j);
        const wareControl = this.productForm.get(wareControlName);
  
        if (wareControl) {
          wareControl.setValue(newWare);
        }
      });
    });
  }

  toggleDescriptionEditor() {
    this.showDescriptionEditor = !this.showDescriptionEditor;
  }

  preventNegative(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }
  
  onKeyPress(event: KeyboardEvent) {
    const inputChar = event.key;
    if (!this.isNumberOrDecimalKey(inputChar, event.target!)) {
      event.preventDefault();
    }
  }
  
  isNumberOrDecimalKey(inputChar: string, inputElement: EventTarget): boolean {
    const input = (inputElement as HTMLInputElement).value;
  
    // Allow digits and one decimal point, but prevent more than one decimal point
    if (inputChar === '.' && input.includes('.')) {
      return false;
    }
  
    // Allow digits and decimal point
    return /^[0-9.]$/.test(inputChar);
  }

  getAllBrands(): void {
    this.brandService.getAllBrands().subscribe(
      (brands: Brand[]) => {
        this.brands = brands;
        console.log('selectbrand', this.brands);
      },
      (error) => {
        console.error('Error fetching brands:', error);
      }
    );
  }

  getAllCols(): void {
    this.collectionService.getAllCols().subscribe(
      (cols) => {
        this.cols = cols;
        console.log('selectbrand', this.cols);
      },
      (error) => {
        console.error('Error fetching brands:', error);
      }
    );
  }

  getCategoriesAndChild() {
    this.categoryService.getCategoriesAndChild().subscribe((response) => {
      // Chuyển đổi dữ liệu API thành TreeNode
      this.categorieandchild = response;
    });
  }

  getAllSubcategoriesRecursive(parentCategory: TreeNode) {
    this.categoryService.getSubcategories(parentCategory.data.id).subscribe(
      (response) => {
        parentCategory.children = response.data.map((category: any) =>
          this.mapToTreeNode(category)
        );
        // Lặp lại cho tất cả các danh mục con
        if (parentCategory.children) {
          parentCategory.children.forEach((childCategory) => {
            this.getAllSubcategoriesRecursive(childCategory);
          });
        }
      },
      (error) => {
        console.error('Error fetching subcategories:', error);
      }
    );
  }

  mapToTreeNode(category: any): TreeNode {
    return {
      label: category.name,
      data: category,
      leaf: !category.children,
      children: undefined,
    };
  }

  onNodeSelect(event: any) {
    const selectedNode = event.node;
    this.selectedCategory = selectedNode;
    if (!selectedNode.data.parentId) {
      if (!selectedNode.children) {
        this.getAllSubcategoriesRecursive(selectedNode);
      }
    }
  }

  onNodeUnselect(event: any) {
    const unselectedNode = event.node;
    if (this.selectedCategory === unselectedNode) {
      this.selectedCategory = null;
    }
    unselectedNode.children = null;
  }
  
  onTreeSelectFocus() {
    this.isTreeSelectFocused = true;
  }

  addProperty1(): void {
    this.valueProperties1Array.push(this.fb.control(''));
    // Thêm ô input price cho giá trị mới của valueProperties1
    const index = this.valueProperties1Array.length - 1;
    this.productForm.addControl(
      `price${index}`,
      this.fb.control('', Validators.required)
    );
    this.productForm.addControl(
      `quantity${index}`,
      this.fb.control('', Validators.required)
    );
    this.productForm.addControl(
      `base64_FileImage${index}`,
      this.fb.control('')
    );

    const sampleImage = ''; // Dùng ảnh mẫu hoặc rỗng
    this.productForm.get(`base64_FileImage${index}`)!.setValue(sampleImage);
    // Thêm ô input price cho từng valueProperties2 của valueProperties1 mới
    for (let j = 0; j < this.valueProperties2Array.length; j++) {
      this.productForm.addControl(
        this.getPriceControlName(index, j),
        this.fb.control('', Validators.required)
      );
      this.productForm.addControl(
        this.getWareControlName(index, j),
        this.fb.control('', Validators.required)
      );
      this.productForm.addControl(
        this.getSkuControlName(index, j),
        this.fb.control('', Validators.required)
      );
      this.productForm.addControl(
        this.getBarcodeControlName(index, j),
        this.fb.control('', Validators.required)
      );
    }

    this.productForm.get('sellingPrice')?.valueChanges.subscribe((newSellingPrice) => {
      if (this.addVariants) {
        this.updatePriceControls(newSellingPrice);
      }
    });

    this.productForm.get('totalQuantity')?.valueChanges.subscribe((newtotalQuantity) => {
      if (this.addVariants) {
        this.updateWareControls(newtotalQuantity);
      }
    });
  }

  addProperty2(): void {
    this.valueProperties2Array.push(this.fb.control(''));
    // Thêm ô input price cho từng valueProperties1
    for (let i = 0; i < this.valueProperties1Array.length; i++) {
      this.productForm.addControl(
        this.getPriceControlName(i, this.valueProperties2Array.length - 1),
        this.fb.control('', Validators.required)
      );
      this.productForm.addControl(
        this.getWareControlName(i, this.valueProperties2Array.length - 1),
        this.fb.control('', Validators.required)
      );
      this.productForm.addControl(
        this.getSkuControlName(i, this.valueProperties2Array.length - 1),
        this.fb.control('', Validators.required)
      );
      this.productForm.addControl(
        this.getBarcodeControlName(i, this.valueProperties2Array.length - 1),
        this.fb.control('', Validators.required)
      );
    }
  }

  removeProperty1(index: number): void {
    this.valueProperties1Array.removeAt(index);
    this.imageSelected[index] = false;
    this.productForm.removeControl(`price${index}`);
    this.productForm.removeControl(`quantity${index}`);
    for (let j = 0; j < this.valueProperties2Array.length; j++) {
      this.productForm.removeControl(this.getPriceControlName(index, j));
      this.productForm.removeControl(this.getWareControlName(index, j));
    }
    for (let i = index; i < this.valueProperties1Array.length; i++) {
      const priceControl = this.productForm.get(`price${i + 1}`);
      const wareControl = this.productForm.get(`quantity${i + 1}`);
      this.productForm.removeControl(`price${i + 1}`);
      this.productForm.addControl(`price${i}`, priceControl);
      this.productForm.removeControl(`quantity${i + 1}`);
      this.productForm.addControl(`quantity${i}`, wareControl);
      for (let j = 0; j < this.valueProperties2Array.length; j++) {
        const control1 = this.productForm.get(
          this.getPriceControlName(i + 1, j)
        );
        const control2 = this.productForm.get(
          this.getWareControlName(i + 1, j)
        );
        this.productForm.removeControl(this.getPriceControlName(i + 1, j));
        this.productForm.addControl(this.getPriceControlName(i, j), control1);
        this.productForm.removeControl(this.getWareControlName(i + 1, j));
        this.productForm.addControl(this.getWareControlName(i, j), control2);
      }
    }
  }

  removeProperty2(index: number): void {
    this.valueProperties2Array.removeAt(index);
    // Xóa ô input price của từng valueProperties1
    for (let i = 0; i < this.valueProperties1Array.length; i++) {
      this.productForm.removeControl(this.getPriceControlName(i, index));
      this.productForm.removeControl(this.getWareControlName(i, index));
    }
    // Sau khi xóa, cập nhật lại các key của input price
    for (let i = 0; i < this.valueProperties1Array.length; i++) {
      for (let j = index; j < this.valueProperties2Array.length; j++) {
        const control1 = this.productForm.get(
          this.getPriceControlName(i, j + 1)
        );
        const control2 = this.productForm.get(
          this.getWareControlName(i, j + 1)
        );
        this.productForm.removeControl(this.getPriceControlName(i, j + 1));
        this.productForm.addControl(this.getPriceControlName(i, j), control1);
        this.productForm.removeControl(this.getWareControlName(i, j + 1));
        this.productForm.addControl(this.getWareControlName(i, j), control2);
      }
    }
  }

  updateProperties1Header(): void {
    let properties1Value = this.productForm.get('propeties1')!.value;
    if (!properties1Value) {
      properties1Value = 'Giá trị thuộc tính 1';
    }
    const properties1HeaderElement =
      document.getElementById('propeties1Header');
    if (properties1HeaderElement) {
      properties1HeaderElement.innerText = properties1Value;
    }
  }

  updateProperties2Header(): void {
    let properties2Value = this.productForm.get('propeties2')!.value;
    if (!properties2Value) {
      properties2Value = 'Giá trị thuộc tính 2';
    }
    const properties2HeaderElement =
      document.getElementById('propeties2Header');
    if (properties2HeaderElement) {
      properties2HeaderElement.innerText = properties2Value;
    }
  }

  onImageSelected(event: any): void {
    const maxFileSize = 3 * 1024 * 1024;
    const maxAllowedImages = 9;

    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.showNameError = false;
    }

    const totalImages = this.base64_FileIamges.length + files.length;

    if (totalImages > maxAllowedImages) {
      this.messages = [
        {
          severity: 'warn',
          summary: 'Số lượng ảnh vượt quá giới hạn',
          detail: `Chỉ được phép tải lên tối đa ${maxAllowedImages} ảnh`,
          life: 3000,
        },
      ];
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxFileSize) {
        this.messages = [
          {
            severity: 'warn',
            summary: 'Ảnh > 3MB',
            detail: 'Ảnh tải lên không được lớn hơn 3MB',
            life: 3000,
          },
        ];
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.base64_FileIamges.push({ file, preview: base64String });
        this.productForm
          .get('base64_FileIamges')
          ?.setValue(
            this.base64_FileIamges.map((image) => image.preview.split(',')[1])
          );
      };
      reader.readAsDataURL(file);
    }
    this.imageInput.nativeElement.value = '';
  }

  removeImage(index: number): void {
    this.base64_FileIamges.splice(index, 1);
    this.productForm
      .get('base64_FileIamges')
      ?.setValue(
        this.base64_FileIamges.map((image) => image.preview.split(',')[1])
      );
  }

  onSwitchChange(event: any) {
    if (event.checked) {
      this.productForm.get('numberDay')?.enable();
    } else {
      this.productForm.get('numberDay')?.disable();
    }
  }

  get valueProperties1Array(): FormArray {
    return this.productForm.get('valuePropeties1') as FormArray;
  }

  get valueProperties2Array(): FormArray {
    return this.productForm.get('valuePropeties2') as FormArray;
  }

  getPriceControlName(i: number, j: number): string {
    return `price${i}-${j}`;
  }

  getWareControlName(i: number, j: number): string {
    return `quantity${i}-${j}`;
  }

  getBarcodeControlName(i: number, j: number): string {
    return `barcode${i}-${j}`;
  }
  
  getSkuControlName(i: number, j: number): string {
    return `sku${i}-${j}`;
  }
  
  applyGlobalPrice(): void {
    // Lấy giá trị của globalPrice từ biểu mẫu
    const globalPrice = this.productForm.get('globalPrice')!.value;
    const globalWare = this.productForm.get('globalWare')!.value;

    // Đặt giá trị của globalPrice vào tất cả các ô input price
    for (let i = 0; i < this.valueProperties1Array.length; i++) {
      for (let j = 0; j < this.valueProperties2Array.length; j++) {
        this.productForm.get(this.getPriceControlName(i, j))!.setValue(globalPrice);
        this.productForm.get(this.getWareControlName(i, j))!.setValue(globalWare);
      }
    }
  }

  openAddVariants() {
    this.addVariants = true;
    this.buttonVariants = false;
    this.productForm.get('price')?.setValue(null);
    this.productForm.get('totalQuantity')?.setValue(null);
    this.productForm.get('sellingPrice')?.valueChanges.subscribe((newSellingPrice) => {
      if (this.addVariants) {
        this.updatePriceControls(newSellingPrice);
      }
    });

    this.productForm.get('totalQuantity')?.valueChanges.subscribe((newtotalQuantity) => {
      if (this.addVariants) {
        this.updateWareControls(newtotalQuantity);
      }
    });
    // this.productForm.get('price')?.setValue(0);
    // this.productForm.get('totalQuantity')?.setValue(0);
  }

  openAddVariants2() {
    this.addVariants2 = true;
    this.buttonVariants2 = false;
  }

  closeAddVariants() {
    this.addVariants = false;
    this.productForm.get('propeties1')?.reset();
    this.productForm.get('valuePropeties1')?.reset();
    this.productForm.get('globalPrice')?.reset();
    this.productForm.get('globalWare')?.reset();
    this.productForm.get('base64_FileImage')?.reset();
    this.productForm.get('price')?.reset();
    this.productForm.get('totalQuantity')?.reset();
    this.valueProperties1Array.clear();
    this.addProperty1();
    this.buttonVariants = true;
  }

  closeAddVariants2() {
    this.addVariants2 = false;
    this.productForm.get('propeties2')?.reset();
    this.productForm.get('valuePropeties2')?.reset();
    this.productForm.get('globalPrice')?.reset();
    this.productForm.get('globalWare')?.reset();
    this.productForm.get('base64_FileImage')?.reset();
    this.productForm.get('price')?.reset();
    this.productForm.get('totalQuantity')?.reset();
    this.valueProperties2Array.clear();
    this.addProperty2();
    this.buttonVariants2 = true;
  }

  getBase64Image(index: number): string | null {
    const control = this.productForm.get(`base64_FileImage${index}`);
    return control ? control.value : null;
  }


  getPriceControlError(i: number, j: number) {
    const control = this.productForm.get(this.getPriceControlName(i, j));
    if (control && control.errors) {
      // if (control.errors.required) {
      //   return 'Giá không được để trống';
      // }
      if (control.errors?.['min']) {
        return 'Giá không thể nhỏ hơn 1000';
      }
    }
    return '';
  }
  
  onImageVariant(event: any, index: number): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.base64_FileImage = base64String;
        // this.productForm.get('base64_FileIamges')?.setValue(base64String.split(',')[1]);
        this.valueProperties1Array
          .at(index)
          .get('base64_FileIamge')
          ?.setValue(base64String.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  }

  handleFileInput(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.readFileAsBase64(file).then((result) => {
        this.productForm.get(`base64_FileImage${index}`)!.setValue(result);
        this.imageSelected[index] = true;
      });
    }
  }

  readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString();
        if (base64String) {
          resolve(base64String.split(',')[1]);
        } else {
          reject('Failed to read file as base64.');
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  removeImageVariant(index: number): void {
    this.productForm.get(`base64_FileImage${index}`)!.setValue(null);
    this.imageSelected[index] = false;
    const fileInput = document.getElementById(
      `fileInput${index}`
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  checkAndOnSubmit() {
    // Tạo một danh sách các promises để kiểm tra mã vạch
    const promises: Promise<boolean>[] = [];
  
    // Thêm kiểm tra mã vạch sản phẩm vào danh sách
    promises.push(this.checkBarcodeAndCreateProduct());
  
    // Thêm kiểm tra mã vạch biến thể vào danh sách
    for (let i = 0; i < this.valueProperties1Array.length; i++) {
      for (let j = 0; j < this.valueProperties2Array.length; j++) {
        promises.push(this.checkBarcodeVariantAndCreateProduct(i, j));
        promises.push(this.checkSkuAndCreateProduct(i, j));
      }
    }
  
    // Đợi tất cả kiểm tra hoàn thành
    Promise.all(promises).then((results) => {
      // Nếu tất cả các kiểm tra đều trả về true (không có lỗi), gọi this.onSubmit()
      if (results.every(result => result === true)) {
        this.onSubmit();
      } else {
        // console.log('Không thể submit vì có mã vạch bị trùng.');
        this.messages = [
          {
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Mã đã tồn tại. Vui lòng kiểm tra lại.',
            life: 3000,
          },
        ];
      }
    }).catch((error) => {
      console.error('Lỗi trong quá trình kiểm tra mã vạch:', error);
    });
  }
  

  checkBarcodeAndCreateProduct(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const barcode = this.productForm.get('barcode')!.value;
      this.showNameError12 = false; // Reset lỗi trước khi kiểm tra
    
      this.productService.CheckBarcode(barcode).subscribe(
        (response) => {
          if (response.data) {
            this.showNameError12 = true;
            this.errorMessage = 'Mã vạch đã tồn tại. Vui lòng kiểm tra lại.';

            resolve(false); // Báo rằng có lỗi và không được submit
          } else {
            resolve(true); // Báo rằng không có lỗi
          }
        },
        (error) => {
          console.error('Lỗi khi kiểm tra mã vạch:', error);
          reject(error); // Báo lỗi nếu không kiểm tra được
        }
      );
    });
  }
  
  checkBarcodeVariantAndCreateProduct(i: number, j: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const barcodeControlName = this.getBarcodeControlName(i, j);
      const barcode = this.productForm.get(barcodeControlName)?.value;
      this.showNameError14 = false; // Reset lỗi trước khi kiểm tra
      
      if (barcode) {
        this.productService.CheckBarcodeVariant(barcode).subscribe(
          (response) => {
            if (response.data) {
              // this.showNameError14 = true;
              // this.errorMessage2 = 'Mã vạch đã tồn tại.';
              // // this.messages = [
              // //   {
              // //     severity: 'error',
              // //     summary: 'Lỗi',
              // //     detail: 'Mã vạch đã tồn tại. Vui lòng kiểm tra lại.',
              // //     life: 3000,
              // //   },
              // // ];
              resolve(false); // Báo rằng có lỗi
            } else {
              resolve(true); // Báo rằng không có lỗi
            }
          },
          (error) => {
            console.error('Lỗi khi kiểm tra mã vạch:', error);
            reject(error); // Báo lỗi nếu không kiểm tra được
          }
        );
      } else {
        console.error('Không tìm thấy giá trị mã vạch.');
        resolve(true); // Nếu không có mã vạch, tiếp tục quá trình mà không báo lỗi
      }
    });
  }
  

  checkSkuAndCreateProduct(i: number, j: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const skuControlName = this.getSkuControlName(i, j);
      const sku = this.productForm.get(skuControlName)?.value;
      this.showNameError15 = false; // Reset lỗi trước khi kiểm tra
      
      if (sku) {
        this.productService.CheckBarcodeSku(sku).subscribe(
          (response) => {
            if (response.data) {
              // this.showNameError15 = true;
              // this.errorMessage3 = 'Mã sku đã tồn tại.';
              // this.messages = [
              //   {
              //     severity: 'error',
              //     summary: 'Lỗi',
              //     detail: 'Mã vạch đã tồn tại. Vui lòng kiểm tra lại.',
              //     life: 3000,
              //   },
              // ];
              resolve(false); // Báo rằng có lỗi
            } else {
              resolve(true); // Báo rằng không có lỗi
            }
          },
          (error) => {
            console.error('Lỗi khi kiểm tra mã sku:', error);
            reject(error); // Báo lỗi nếu không kiểm tra được
          }
        );
      } else {
        console.error('Không tìm thấy giá trị mã sku.');
        resolve(true); // Nếu không có mã vạch, tiếp tục quá trình mà không báo lỗi
      }
    });
  }

  onSubmit(): void {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    const productData = this.productForm.value;

    let hasError = false;

    if (!productData.name || productData.name.length === 0) {
      this.showNameError2 = true;
      hasError = true;
    }

    if (
      !productData.name ||
      productData.name.trim().length < 6 ||
      productData.name.trim().length > 100
    ) {
      this.showNameError10 = true;
      hasError = true;
    }

    if (
      !productData.name ||
      (productData.name.length > 0 && productData.name.trim().length === 0)
    ) {
      this.showNameError11 = true;
      hasError = true;
    }


    if (!productData.categoryId || productData.categoryId.length === 0) {
      this.showNameError4 = true;
      hasError = true;
    }

    // if (this.addVariants) {
    //   this.showNameError5 = false;
    //   this.showNameError7 = false;
    //   hasError = false;
    // } else {
    //   if (!productData.price || productData.price.length === 0) {
    //     this.showNameError5 = true;
    //     hasError = true;
    //   }

    //   if (!productData.price || productData.price <= 0) {
    //     this.showNameError7 = true;
    //     hasError = true;
    //   }
    // }

    // if (!productData.importPrice || productData.importPrice.length === 0) {
    //   this.showNameError9 = true;
    //   hasError = true;
    // }

    // if (!productData.importPrice || productData.importPrice <= 0) {
    //   this.showNameError9 = true;
    //   hasError = true;
    // }

    // const price = this.productForm.get('price')?.value;
    // if (price === '0' || price === 0) {
    //   this.showNameError14 = true;
    //   hasError = true;
    // } else {

    // }

    // const importPrice = this.productForm.get('importPrice')?.value;
    // if (importPrice === '0' || importPrice === 0) {
    //   this.showNameError15 = true;
    //   hasError = true;
    // }

    if (hasError) {
      this.messages = [
        {
          severity: 'error',
          summary: 'Không thể lưu vì:',
          detail: 'Sản phẩm đang có lỗi cần được chỉnh sửa',
          life: 3000,
        },
      ];
      this.isSubmitting = false;
      return;
    }

    const product: Products = {
      name: productData.name,
      description: productData.description,
      content: productData.content,
      categoryId: this.selectedCategory?.data.id || 0,
      brandId: productData.brandId,
      collectionId: productData.collectionId || 0,
      warrantyPolicyId: productData.warrantyPolicyId,
      sellingPrice: productData.sellingPrice || 0,
      importPrice: productData.importPrice || 0,
      sku: productData.sku,
      barcode: productData.barcode || productData.sku,
      totalQuantity: productData.totalQuantity || 0,
      mass: productData.mass || 0,
      width: productData.width,
      hight: productData.hight,
      length: productData.length,
      base64_FileIamges: productData.base64_FileIamges,
      base64_FileVideo: productData.base64_FileVideo,
      propeties1: productData.propeties1,
      propeties2: productData.propeties2,
      productVariants: [],
      status: productData.status ? 1 : 0,
      warning: productData.warning ? 1 : 0,
      unitName: productData.unitName,
      numberDay: productData.numberDay,
      productType: productData.productType
    };

    let hasVariants = false;
    for (let i = 0; i < productData.valuePropeties1.length; i++) {
      const value1 = productData.valuePropeties1[i];
      const base64_FileImage = productData[`base64_FileImage${i}`];

      for (let j = 0; j < productData.valuePropeties2.length; j++) {
        const value2 = productData.valuePropeties2[j] || null;
        const prices = productData[this.getPriceControlName(i, j)] || 0;
        const quantity = productData[this.getWareControlName(i, j)] || 0;
        const sku = productData[this.getSkuControlName(i, j)] || null;
        const barcode = productData[this.getBarcodeControlName(i, j)] || null;
        // if (!prices && prices <= 1000) {
        //   this.showNameError8 = true;
        //   return
        // }

        if (prices !== null) {
          hasVariants = true;
          const variant: ProductVariant = {
            sku: sku,
            barcode: barcode || sku,
            price: prices || 0,
            quantity: quantity || 0,
            propeties1: product.propeties1,
            valuePropeties1: value1,
            propeties2: product.propeties2,
            valuePropeties2: value2,
            base64_FileImage: base64_FileImage,
          };
          product.productVariants.push(variant);
        }
      }
    }

    if (!hasVariants) {
      product.productVariants = [];
    }
    this.validationMessage = null;
    this.productService.createProduct(product).subscribe(
      (response) => {
        // console.log(product)
        this.validationMessage = null;
        console.log('Sản phẩm đã được thêm thành công:', response);
        this.messages = [
          {
            severity: 'success',
            summary: 'Thành công',
            detail: 'Sản phẩm đã được thêm thành công',
            life: 1000,
          },
        ];
        setTimeout(() => {
          this.router.navigate(['/products/show-product']);
          this.isSubmitting = false;
        }, 1000);
      },
      (error) => {
        console.error('Lỗi khi thêm sản phẩm:', error);
        this.isSubmitting = false;
        // Xử lý lỗi
      }
    );
  }

}
