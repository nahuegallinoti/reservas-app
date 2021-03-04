import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isLoading = false;

  public barChartLabels: Label[] = ['Jun 2019', 'July 2019', 'Aug 2019', 'Sep 2019', 'Oct 2019', 'Nov 2019', 'Dec 2019'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public paymentVsChargeGraphData: ChartDataSets[] = [
    { data: [20,50,70,90,110,130,150], label: 'Payments'},
    { data: [30,40,60,80,100,120,140], label: 'Charges' }
  ];
  
  public barChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function(tooltipItems, data) {
          return data.datasets[tooltipItems.datasetIndex].label + ": $" + parseFloat(tooltipItems.yLabel.toString()).toFixed(2);
      }
      }
    },
    legend:{
      align:'start',
    },
    scales: {
      yAxes: [{
          ticks: {
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                  return '$' + value;
              }
          }
      }]
  },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    
  };
  
  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    cutoutPercentage: 60,
    tooltips: {
      callbacks: {
        label: function(tooltipItems, data) {
          return data.labels[tooltipItems.index] + ": $" + parseFloat(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index].toString()).toFixed(2);
      }
      }
    },
  
};
public doughnutChartLabels: Label[] = ['Jan 2019', 'Feb 2019', 'Mar 2019', 'Apr 2019','May 2019','Jun 2019', 'July 2019', 'Aug 2019', 'Sep 2019', 'Oct 2019', 'Nov 2019', 'Dec 2019'];
public collectedRevenueChartData: MultiDataSet = [
  [20,56,78,28,88,99,23,45,12,25,67,55],
];
public doughnutChartType: ChartType = 'pie';
public doughnutChartLegend = false;

  constructor() { }

  ngOnInit(): void {

  }

}
