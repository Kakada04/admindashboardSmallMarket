import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { signal } from '@angular/core';
import { DeleteConfirmation } from '../../reusablecomponent/delete-confirmation/delete-confirmation';
import { Adminservice, Product } from '../../security/service/adminservice';
import {ProductDetails} from '../../reusablecomponent/product-details/product-details'

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, DeleteConfirmation,ProductDetails],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class Inventory implements OnInit {
  categorys: any[] = [];
  originalCategories: any[] = [];
  products: Product[] = [];
  product_by_category: any[] = [];
  filteredProducts: any[] = [];
  selectedCategoryType: string = '';
  searchTerm: string = '';
  newProduct: Partial<Product> = {
    category: { type: '' },
    product_name: '',
    quantity: undefined,
    cost_price: undefined,
    sell_price: undefined,
    description: ''
  };
  imageUrl: string = 'https://smallmarketbackendlaravel-production.up.railway.app/storage/';
  selectedFile: File | null = null;
  addNewModals: boolean = false;
  loading: boolean = true;
  isUpdateMode: boolean = false;
  currentProductId: number | null = null;
  display_by_category: boolean = false;

  categoryList: boolean = false;
  categoryModal: boolean = false;

  showConfirmModal = signal(false);
  alert_deleted = signal(false);
  private timeoutId: number | null = null;
  private productIdToDelete = signal<number | null>(null);
  totalproducts: any = {
    'status': true,
    'message': '',
    'data': 0
  };
  totalproductsSaled: any = {};
  totalOrder: any = {};
  totalRevenue: any = {};

  constructor(
    private productDataApi: Adminservice,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategory();
    this.loadtotalproduct();
    this.loadProductsSaled();
    this.loadTotalOrder();
    this.loadTotalRevenue();
  }

  loadtotalproduct() {
    this.productDataApi.getTotalProduct('today').subscribe({
      next: (res) => {
        this.totalproducts = res;
        console.log('Total Products:', this.totalproducts);
        this.cd.detectChanges();
      }
    });
  }

  loadProductsSaled() {
    this.productDataApi.getTotalProductSaled().subscribe({
      next: (res) => {
        this.totalproductsSaled = res;
        console.log('Total Products Saled:', this.totalproductsSaled);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading total products saled:', err);
      }
    });
  }

  loadTotalOrder() {
    this.productDataApi.getTotlOrder('today').subscribe({
      next: (res) => {
        this.totalOrder = res;
        console.log('Total Order:', this.totalOrder);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading total order:', err);
      }
    });
  }

loadCategory(): void {
  this.loading = true;
  this.productDataApi.getCategory().subscribe({
    next: (res) => {
     this.categorys = res;
      this.originalCategories = [...this.categorys];
      this.loading = false;
      console.log('Categories loaded:', this.categorys);
      this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Error loading categories:', err);
      this.loading = false;
      this.categorys = [];
      this.originalCategories = [];
      this.cd.detectChanges();
    }
  });
}

  loadTotalRevenue() {
    this.productDataApi.getTotalRevenue('today').subscribe({
      next: (res) => {
        this.totalRevenue = res;
        console.log('Total Revenue:', this.totalRevenue);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading total revenue:', err);
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productDataApi.getProducts().subscribe({
      next: (res: Product[]) => {
        this.products = res;
        this.filteredProducts = res;
        this.loading = false;
        console.log('Products loaded:', this.products);
         this.loadtotalproduct()
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.loading = false;
        this.filteredProducts = [];
        this.cd.detectChanges();
      }
    });
  }

  sortCateType(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const cateID = selectElement.selectedOptions[0]?.getAttribute('data-id');
    this.selectedCategoryType = selectElement.value;
    console.log('Selected category:', this.selectedCategoryType, 'ID:', cateID);

    if (!cateID || this.selectedCategoryType === '') {
      this.display_by_category = false;
      this.product_by_category = [];
      this.filteredProducts = [...this.products];
    } else {
      this.display_by_category = true;
      this.loadProductsBycategory(cateID);
    }
    this.searchTerm = '';
    this.cd.detectChanges();
  }

  loadProductsBycategory(cateID: string) {
    this.loading = true;
    this.productDataApi.getProductbyCategory(cateID).subscribe({
      next: (res) => {
        this.product_by_category = res;
        this.filteredProducts = [...this.product_by_category];
        this.loading = false;
        console.log('Products by category:', this.product_by_category);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading products by category:', err);
        this.product_by_category = [];
        this.filteredProducts = [];
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  filterProducts() {
    console.log('Filtering with categoryList:', this.categoryList, 'searchTerm:', this.searchTerm);
    if (!this.categoryList) {
      const source = this.display_by_category ? this.product_by_category : this.products;
      if (!this.searchTerm.trim()) {
        this.filteredProducts = [...source];
      } else {
        const searchLower = this.searchTerm.toLowerCase();
        this.filteredProducts = source.filter(product =>
          product.product_name?.toLowerCase().includes(searchLower)
        );
      }
    } else {
      if (!this.searchTerm.trim()) {
        this.categorys = [...this.originalCategories];
      } else {
        const searchLower = this.searchTerm.toLowerCase();
        this.categorys = this.originalCategories.filter(category =>
          category.type?.toLowerCase().includes(searchLower)
        );
      }
      this.filteredProducts = [];
    }
    console.log('Filtered products:', this.filteredProducts, 'Filtered categories:', this.categorys);
    this.cd.detectChanges();
  }

newCategory: { type: string, image: File | string | null } = { type: '', image: null };
  isUpdateCategoryMode: boolean = false;
  currentCategoryId: number | null = null;

  initiateDeleteCategory(id: number) {
    this.productIdToDelete.set(id);
    this.showConfirmModal.set(true);
  }

  initiateDelete(id: any) {
    this.productIdToDelete.set(id);
    this.showConfirmModal.set(true);
  }

  onConfirmDelete() {
    const id = this.productIdToDelete();
    if (id) {
        if (this.categoryList) {
            this.deleteCategory(id); // Call deleteCategory for categories
        } else {
            this.onDelete(id); // Call onDelete for products
        }
    }
    this.showConfirmModal.set(false);
    this.productIdToDelete.set(null);
}

 deleteCategory(id: number) {
    this.productDataApi.deleteCategory(id).subscribe({
        next: () => {
            this.loadCategory();
            this.loadProducts(); // Refresh products to reflect deleted products
            this.display_by_category = false; // Reset category filter
            this.selectedCategoryType = ''; // Clear selected category
            this.filteredProducts = [...this.products]; // Reset filtered products
            this.deletedAlert();
        },
        error: (err) => {
            console.error('Delete category failed:', err);
            this.showErrorToast();
        }
    });
}

 openUpdateCategoryModal(category: any): void {
  this.isUpdateCategoryMode = true;
  this.currentCategoryId = category.id;
  this.newCategory = {
    type: category.type,
    image: category.full_banner_url || null
  };
  this.categoryModal = true;
  console.log('Opening update category modal:', this.newCategory);
  this.cd.detectChanges();
}

  onCategoryFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.newCategory.image = input.files[0];
  }
}
  addCategory(): void {
  if (!this.newCategory.type.trim()) {
    alert('Category name is required.');
    return;
  }
  if (!this.newCategory.image) {
    alert('Category image is required.');
    return;
  }

  const formData = new FormData();
  formData.append('type', this.newCategory.type);
  if (this.newCategory.image instanceof File) {
    formData.append('category_image', this.newCategory.image);
  }

  console.log('Adding category:', this.newCategory);
  this.productDataApi.addCategory(formData).subscribe({
    next: () => {
      this.loadCategory();
      this.resetCategoryForm();
      this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Failed to add category:', err);
      alert('Failed to add category: ' + (err.error?.message || 'Unknown error'));
    }
  });
}

 updateCategory(): void {
  if (!this.currentCategoryId || !this.newCategory.type.trim()) {
    alert('Category name is required.');
    return;
  }

  const formData = new FormData();
  formData.append('type', this.newCategory.type);
  if (this.newCategory.image instanceof File) {
    formData.append('category_image', this.newCategory.image);
  }

  console.log('Updating category:', {
    id: this.currentCategoryId,
    payload: this.newCategory
  });
  this.productDataApi.updateCategory(this.currentCategoryId, formData).subscribe({
    next: (res) => {
      console.log('Category updated successfully:', res);
      this.loadCategory();
      this.resetCategoryForm();
      this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Failed to update category:', err);
      alert('Failed to update category: ' + (err.error?.message || 'Unknown error'));
    }
  });
}

  resetCategoryForm() {
    console.log('Resetting category form');
    this.newCategory = { type: '',image:'' };
    this.isUpdateCategoryMode = false;
    this.currentCategoryId = null;
    this.categoryModal = false;
    this.cd.detectChanges();
  }

  onCategorySubmit() {
    if (this.isUpdateCategoryMode) {
      this.updateCategory();
    } else {
      this.addCategory();
    }
  }

  onCancelDelete() {
    this.showConfirmModal.set(false);
    this.productIdToDelete.set(null);
  }

  onDelete(id: number) {
    this.productDataApi.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
        if (this.display_by_category) {
          this.loadProductsBycategory(this.categorys.find(c => c.type === this.selectedCategoryType)?.id);
        }
        this.deletedAlert();
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.showErrorToast();
      }
    });
  }

  modalVisable(): void {
    this.addNewModals = !this.addNewModals;
    if (!this.addNewModals) {
      this.resetForm();
    }
  }

  openUpdateModal(product: Product): void {
    this.isUpdateMode = true;
    this.currentProductId = product.id || null;
    this.newProduct = {
      category: { type: product.category?.type || '' },
      product_name: product.product_name,
      quantity: product.quantity,
      cost_price: product.cost_price,
      sell_price: product.sell_price,
      description: product.description
    };
    this.selectedFile = null;
    this.addNewModals = true;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.isUpdateMode && this.currentProductId) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  addProduct(): void {
    if (
      !this.newProduct.category?.type ||
      !this.newProduct.product_name ||
      !this.newProduct.quantity ||
      !this.newProduct.cost_price ||
      !this.newProduct.sell_price ||
      !this.newProduct.description ||
      !this.selectedFile
    ) {
      alert('Please fill out all fields and select an image.');
      return;
    }
    const formData = new FormData();
    formData.append('category_type', this.newProduct.category!.type);
    formData.append('product_name', this.newProduct.product_name!);
    formData.append('quantity', String(this.newProduct.quantity));
    formData.append('cost_price', String(this.newProduct.cost_price));
    formData.append('sell_price', String(this.newProduct.sell_price));
    formData.append('description', this.newProduct.description!);
    formData.append('banner_img', this.selectedFile!);
    this.productDataApi.addProduct(formData).subscribe({
      next: (res) => {
        this.loadProducts();
        if (this.display_by_category && this.selectedCategoryType === this.newProduct.category!.type) {
          this.loadProductsBycategory(this.categorys.find(c => c.type === this.selectedCategoryType)?.id);
        }
        this.modalVisable();
      },
      error: (err) => {
        console.error('Failed to add product:', err);
        if (err.status === 422 && err.error.errors) {
          alert('Validation Error:\n' + Object.values(err.error.errors).join('\n'));
        }
      }
    });
  }

  updateProduct(): void {
    if (!this.currentProductId) {
      alert('No product selected for update.');
      return;
    }
    const formData = new FormData();
    if (this.newProduct.category?.type) formData.append('category_type', this.newProduct.category.type);
    if (this.newProduct.product_name) formData.append('product_name', this.newProduct.product_name);
    if (this.newProduct.quantity !== undefined) formData.append('quantity', String(this.newProduct.quantity));
    if (this.newProduct.cost_price !== undefined) formData.append('cost_price', String(this.newProduct.cost_price));
    if (this.newProduct.sell_price !== undefined) formData.append('sell_price', String(this.newProduct.sell_price));
    if (this.newProduct.description) formData.append('description', this.newProduct.description);
    if (this.selectedFile) formData.append('banner_img', this.selectedFile);
    console.log('FormData contents:');
    for (let [key, value] of (formData as any).entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }
    this.productDataApi.updateProduct(this.currentProductId, this.newProduct, this.selectedFile || undefined).subscribe({
      next: (res) => {
        this.loadProducts();
        if (this.display_by_category) {
          this.loadProductsBycategory(this.categorys.find(c => c.type === this.selectedCategoryType)?.id);
        }
        this.modalVisable();
      },
      error: (err) => {
        console.error('Failed to update product:', err);
        if (err.status === 422 && err.error.errors) {
          alert('Validation Error:\n' + Object.values(err.error.errors).join('\n'));
        } else if (err.status === 404) {
          alert('Category or product not found.');
        }
      }
    });
  }

  resetForm(): void {
    this.newProduct = {
      category: { type: '' },
      product_name: '',
      quantity: undefined,
      cost_price: undefined,
      sell_price: undefined,
      description: ''
    };
    this.selectedFile = null;
    this.isUpdateMode = false;
    this.currentProductId = null;
  }

  deletedAlert() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.alert_deleted.set(true);
    this.timeoutId = setTimeout(() => {
      this.alert_deleted.set(false);
      this.timeoutId = null;
    }, 3000);
  }

  closeToast() {
    this.alert_deleted.set(false);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  showErrorToast() {
    alert('Failed to delete product. Please try again.');
  }


  showDetails = false;
  productDetail:any;
  openModal(item:any) {
    this.showDetails = true;
    this.productDetail = item;

  }

  handleClose() {
    this.showDetails = false;
  }

  
}
