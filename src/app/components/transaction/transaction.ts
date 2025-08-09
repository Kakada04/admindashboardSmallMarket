import { Component, ChangeDetectorRef } from '@angular/core';
import { Adminservice } from '../../security/service/adminservice';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ordersDetails {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string;
  created_at: string;
  updated_at: string;
}

interface user {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  gmail: string;
  phone_number: string;
  is_admin: number;
  location_id: number;
  reg_date: string;
  created_at: string;
  updated_at: string;
}

interface transactions {
  id: number;
  user_id: number;
  total_price: string;
  created_at: string;
  updated_at: string;
  payment_status: string,
  total_product: number;
  order_details: ordersDetails[];
  user: user;
}

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css'
})
export class Transaction {
  transactions: transactions[] = [];
  filteredTransactions: transactions[] = [];
  searchvalue: string = '';
  selectedPeriod: string = 'all';
  periods: string[] = [
    'all',
    'today',
    'last_7_days',
    'this_month',
    'year',
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec'
  ];

  constructor(
    private adminService: Adminservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadTransaction()
    this.loadTransactionByPeriod()
  }

  loadTransaction() {
    this.adminService.getTransaction().subscribe({
      next: (res: any) => {
        this.transactions = res.data
        console.log('First transaction:', this.transactions[0]);
        console.log('Total product:', this.transactions[0].total_product);
        debugger

       
      }
    }); this.cdr.detectChanges()
  }
  searchQuery(value: string) {
    if (this.searchvalue == "") {
      return this.loadTransaction()
    }
    this.adminService.getTransactionByusername(value).subscribe({
      next: (res: any) => {
        this.transactions = res.data
        console.log(this.transactions)
      }
    })
  }
  loadTransactionByUserName() {

  }

  loadTransactionByPeriod(): void {
    this.adminService.getTransactionByPeriod(this.selectedPeriod).subscribe({
      next: (res: any) => {
        this.transactions = res.data;
        this.cdr.detectChanges()

      },
      error: (error) => {
        console.error('Error fetching transactions:', error);

      }
    });
  }

  onPeriodChange(): void {
    if (this.selectedPeriod === 'All') {
      this.loadTransaction();
    } else {
      this.loadTransactionByPeriod();
    }
  }
}