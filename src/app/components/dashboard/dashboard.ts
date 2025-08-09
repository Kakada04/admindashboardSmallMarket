import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend,
  ApexXAxis
} from "ng-apexcharts";
export type pieChart = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  dataLabels?: {
    enabled: boolean;
    style: {
      colors: string[];
    };
  };
  legend?: ApexLegend; // Add this line to support legend configuration
};

import { ThemeService } from '../../security/themeService/theme-service';
import { Subscription } from 'rxjs';
import { Adminservice } from '../../security/service/adminservice';
import {CommonModule} from'@angular/common';
import {FormsModule} from '@angular/forms';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors: string[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgApexchartsModule,FormsModule,CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  public pieCharts: Partial<pieChart>;
  textGraphColors: string = "#fff";
  private themeSubscription!: Subscription;
  totalproducts: any = {
    'status': true,
    'message': '',
    'data': 0
  };
    totalproductsSaled: any = {};
  totalOrder: any = {};
  totalRevenue: any = {};

  constructor(private themeService: ThemeService, private cdr: ChangeDetectorRef,private productDataApi: Adminservice,) {
    this.pieCharts = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  loadProductsSaled() {
    this.productDataApi.getTotalProductSaled().subscribe({
      next: (res) => {
        this.totalproductsSaled = res;
        console.log('Total Products Saled:', this.totalproductsSaled);
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading total order:', err);
      }
    });
  }
  loadTotalRevenue() {
    this.productDataApi.getTotalRevenue('today').subscribe({
      next: (res) => {
        this.totalRevenue = res;
        console.log('Total Revenue:', this.totalRevenue);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading total revenue:', err);
      }
    });
  }
  ngOnInit() {
    this.loadtotalproduct();
    this.getAllCustomers();
    this.getCustomerData();
    this.loadProductsSaled();
    this.loadTotalRevenue();
    this.loadTotalOrder();
    this.loadWeeklyChartSale();
    // Set initial text color and initialize chart
    this.updateTextColor(this.themeService.getIsDarkMode());
    this.initializeChartOptions();
    this.pie_Chart();

    setTimeout(() => {
        this.pie_Chart();
    }, 200);

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDarkMode => {
      console.log('Theme changed to:', isDarkMode ? 'dark' : 'light', 'Color:', this.textGraphColors);
      const previousColor = this.textGraphColors;
      this.updateTextColor(isDarkMode);
      if (previousColor !== this.textGraphColors) {
        this.updateChartOptions();
        this.pie_Chart()
      }
      this.cdr.detectChanges();
    });
  }

  private updateTextColor(isDarkMode: boolean) {
    this.textGraphColors = isDarkMode ? "#fff" : "#111827"; // white for dark mode, gray-900 for light mode
    console.log('Updated textGraphColors:', this.textGraphColors);
  }

  loadWeeklyChartSale(){
    this.productDataApi.getWeeklychartData('quantity').subscribe({
      next:(res:any)=>{
        console.log('dd'+res.data.series)
         if(res.status && res.data?.series) {
        // Update only the series data, keep all other chart options
        this.chartOptions = {
          ...this.chartOptions,
          series: res.data.series
        };
        this.cdr.detectChanges()
        // Optional: Store summary data for display
        // this.chartSummary = res.data.summary;
        
        console.log('Chart updated successfully');
        console.log('Total Revenue:', res.data.summary?.total);
        console.log('Average:', res.data.summary?.average);
      }
      }
    })
  }
// Add this ViewChild for pie chart
@ViewChild("pieChart") pieChart!: ChartComponent;

// Completely rebuild the pie chart configuration
private pie_Chart() {
  const isDarkMode = this.themeService.getIsDarkMode();
  const labelColor = isDarkMode ? "#fff" : "#000";
  
  console.log('Loading pie chart data...');
  
  // Load real data from API
  this.productDataApi.getPieChartData(5, 'this_month', 'quantity').subscribe({
    next: (res: any) => {
      console.log('Pie chart API response:', res);
      
      if (res.status && res.data) {
        // Use API data instead of hardcoded data
        this.pieCharts = {
          series: res.data.series, // Real data from API
          chart: {
            width: 380,
            type: "pie",
            foreColor: labelColor
          },
          labels: res.data.labels, // Real product names from API
          dataLabels: {
            enabled: true,
            style: {
              colors: Array(res.data.series.length).fill(labelColor)
            }
          },
          legend: {
            labels: {
              colors: labelColor
            }
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: "bottom",
                  labels: {
                    colors: labelColor
                  }
                }
              }
            }
          ]
        };
        
        console.log('Pie chart updated with real data:', this.pieCharts);
        console.log('Summary:', res.data.summary);
        
        this.cdr.detectChanges();
        
        // Update chart component
        setTimeout(() => {
          if (this.pieChart) {
            this.pieChart.updateOptions(this.pieCharts, true, true);
            console.log('Pie chart updated successfully');
          }
        }, 100);
        
      } else {
        console.error('Invalid pie chart API response');
        // Use fallback hardcoded data
        this.createFallbackPieChart(labelColor);
      }
    },
    error: (error) => {
      console.error('Error loading pie chart data:', error);
      // Use fallback hardcoded data
      this.createFallbackPieChart(labelColor);
    }
  });
}

private createFallbackPieChart(labelColor: string) {
  // Your existing hardcoded pie chart as fallback
  this.pieCharts = {
    series: [44, 55, 13, 43, 22],
    chart: {
      width: 380,
      type: "pie",
      foreColor: labelColor
    },
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
    // ... rest of your existing code
  };
}
  private initializeChartOptions() {
    this.chartOptions = {
      series: [
        {
          name: "Product Sale",
          data: [
            { x: "Monday", y: 1200 },
            { x: "Tuesday", y: 1500 },
            { x: "Wednesday", y: 1100 },
            { x: "Thursday", y: 1700 },
            { x: "Friday", y: 1400 },
            { x: "Saturday", y: 1800 },
            { x: "Sunday", y: 3001 }
          ],
        }
      ],
      chart: {
        width: "100%",
        height: 350, // Explicitly set height
        type: "bar"
      },
      plotOptions: {
        bar: {
          columnWidth: "60%"
        }
      },
      colors: ["#1c4bc0"],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ["Product Sale"],
        markers: {
          fillColors: [this.textGraphColors] // Use theme-based color for legend markers
        },
        labels: {
          colors: [this.textGraphColors] // Use theme-based color for legend text
        }
      },
      xaxis: {
        type: 'category',
        labels: {
          style: {
            colors: Array(7).fill(this.textGraphColors)
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: this.textGraphColors,
            fontSize: '16px'
          }
        }
      }
    };
    console.log('Initialized chart with height:', this.chartOptions?.chart?.height, 'Legend color:', this.textGraphColors);
  }

  private updateChartOptions() {
    if (this.chart && this.chartOptions) {
      const updatedOptions = {
        chart: {
          height: 350 // Ensure height remains fixed
        },
        xaxis: {
          labels: {
            style: {
              colors: Array(7).fill(this.textGraphColors)
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: this.textGraphColors,
              fontSize: '16px'
            }
          }
        },
        legend: {
          markers: {
            fillColors: [this.textGraphColors] // Update legend marker color
          },
          labels: {
            colors: [this.textGraphColors] // Update legend text color
          }
        }
      };

      try {
        this.chart.updateOptions(updatedOptions, true, true);
        console.log('Chart updated with height:', this.chartOptions?.chart?.height, 'Legend color:', this.textGraphColors);
      } catch (error) {
        console.error('Chart update failed:', error);
        // Reinitialize chartOptions to force legend color update
        this.initializeChartOptions();
        this.cdr.detectChanges();
      }
    } else {
      console.warn('Chart or chartOptions not initialized during update');
    }
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    
  }
 
   loadtotalproduct() {
    this.productDataApi.getTotalProduct('today').subscribe({
      next: (res) => {
        this.totalproducts = res;
        console.log('Total Products:', this.totalproducts);
        this.cdr.detectChanges();
      }
    });
  }

customerData: any[] = []; // Initialize as empty array
  filteredCustomerData: any[] = []; // Filtered data for display
  searchTerm: string = ''; // Search input value
  loading: boolean = false;
  customers: any[] = [];
  newCustomers: any[] = [];
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
 getCustomerData(): void {
    this.loading = true;
    this.productDataApi.getCustomerData().subscribe({
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
  getAllCustomers() {
    this.productDataApi.getTotalCustomer().subscribe({
      next: (res) => {
        this.customers = res.data;
        this.cdr.detectChanges();
        console.log(this.customers)
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
      },
    });
  }

 

}