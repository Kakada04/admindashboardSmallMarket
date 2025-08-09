import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Adminservice } from '../../security/service/adminservice';

@Component({
  selector: 'app-customer',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class Customer {
  customerData: any[] = []; // Initialize as empty array
  filteredCustomerData: any[] = []; // Filtered data for display
  searchTerm: string = ''; // Search input value
  loading: boolean = false;
  customers: any[] = [];
  newCustomers: any[] = [];
  customersThisMonth: any[] = [];
  buyer: any[] = [];

  constructor(private adminService: Adminservice, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getAllCustomers();
    this.getUser();
    this.getUserthisMonth();
    this.getBuyer();
    this.getCustomerData();
  }

  // Filter customers based on search term
  filterCustomers() {
    if (!this.searchTerm.trim()) {
      this.filteredCustomerData = [...this.customerData]; // Show all if search is empty
    } else {
      const searchLower = this.searchTerm.toLowerCase().trim();
      this.filteredCustomerData = this.customerData.filter((customer) =>
        customer.name.toLowerCase().includes(searchLower)
      );
    }
    this.cdr.detectChanges(); // Trigger change detection
  }

  // Update search term and filter
  onSearchChange(searchValue: string) {
    this.searchTerm = searchValue;
    this.filterCustomers();
  }

  getAllCustomers() {
    this.adminService.getTotalCustomer().subscribe({
      next: (res) => {
        this.customers = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
      },
    });
  }

  getUser() {
    this.adminService.getCustomer('last_7_days').subscribe({
      next: (res) => {
        this.newCustomers = res.data;
        console.log('User data:', this.newCustomers);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      },
    });
  }

  getUserthisMonth() {
    this.adminService.getCustomer('this_month').subscribe({
      next: (res) => {
        this.customersThisMonth = res.data;
        console.log('User data:', this.customersThisMonth);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      },
    });
  }

  getBuyer() {
    this.adminService.getBuyer().subscribe({
      next: (res) => {
        this.buyer = res.data;
        console.log('Buyer data:', this.buyer);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching buyer:', err);
      },
    });
  }

  getCustomerData(): void {
    this.loading = true;
    this.adminService.getCustomerData().subscribe({
      next: (res) => {
        console.log('Processed customer data:', res);
        this.customerData = res || [];
        this.filteredCustomerData = [...this.customerData]; // Initialize filtered data
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error in component:', err);
        this.customerData = [];
        this.filteredCustomerData = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  editCustomer(customer: any): void {
    console.log('Edit customer:', customer);
  }

  deleteCustomer(customer: any): void {
    console.log('Delete customer:', customer);
  }
}



//  <div class="relative overflow-x-auto shadow-md sm:rounded-lg space-y-5">
//             <div class="flex md:flex-row max-sm:flex-col md:items-center  max-sm:space-y-4 md:justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
//                 <div class="w-full text-center">
//                     <label class="text-2xl max-sm:text-md font-semibold text-gray-900 dark:text-white">Customer List</label>
//                 </div>
//                 <div class="w-full">
//                     <input type="text" id="search"
//                         class="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                         placeholder="Search for Customer...">
//                 </div>
                
//             </div>
//             <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//                 <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                     <tr>
//                         <th scope="col" class="px-6 py-3">
//                            Name
//                         </th>
//                         <th scope="col" class="px-6 py-3">
//                             Gender
//                         </th>
//                         <th scope="col" class="px-6 py-3">
//                             Gmail
//                         </th>
//                         <th scope="col" class="px-6 py-3">
//                             Phone Number
//                         </th>
//                         <th scope="col" class="px-6 py-3">
//                             Location
//                         </th>
//                         <th scope="col" class="px-6 py-3">
//                             Registered Date
//                         </th>
//                         <th scope="col" class="px-6 py-3">
//                             Actions
//                         </th>
//                     </tr>
                    
//                 </thead>
//                 <tbody>
//                      <!-- Loading state -->
//     <tr *ngIf="loading" class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
//       <td colspan="7" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
//         <span class="inline-flex items-center">
//           <svg class="animate-spin h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
//             <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//           Loading...
//         </span>
//       </td>
//     </tr>
//     <!-- No data state -->
//     <tr *ngIf="!loading && (!customerData || customerData.length === 0)" class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
//       <td colspan="7" class="px-6 py-4 text-center">No data available</td>
//     </tr>
//     <!-- Data state -->
//     <ng-container *ngIf="!loading">
//       <tr
//         *ngFor="let customer of customerData"
//         class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
//       >
//         <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//           {{ customer.name }}
//         </th>
//         <td class="px-6 py-4">{{ customer.gender }}</td>
//         <td class="px-6 py-4">{{ customer.gmail }}</td>
//         <td class="px-6 py-4">{{ customer.phoneNumber }}</td>
//         <td class="px-6 py-4">{{ customer.location }}</td>
//         <td class="px-6 py-4">{{ customer.registeredDate }}</td>
//         <td class="px-6 py-4">
//           <button
//             class="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-700"
//             (click)="editCustomer(customer)"
//           >
//             Edit
//           </button>
//           <button
//             class="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-700 ml-4"
//             (click)="deleteCustomer(customer)"
//           >
//             Delete
//           </button>
//         </td>
//       </tr>
//     </ng-container>
//                     <tr
//                         class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
//                         <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                             Ung Kakada
//                             <img class="inline-block w-12 h-auto ml-2 rounded-full"
//                                 src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="User Image">
//                         </th>
//                         <td class="px-6 py-4">
//                             Male
//                         </td>
//                         <td class="px-6 py-4">
//                             kakadaGmail.com
//                         </td>
//                         <td class="px-6 py-4">
//                            0123456789
//                         </td>
//                         <td class="px-6 py-4">
//                             Phnom Penh
//                         </td>
//                         <td class="px-6 py-4">
//                             2023-10-01
//                         </td>
//                         <td class="px-6 py-4">
//                             <button class="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-700">
//                                 Edit
//                             </button>
//                             <button class="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-700 ml-4">
//                                 Delete
//                             </button>
//                         </td>
//                     </tr>
                    
//                 </tbody>
//             </table>
//         </div>