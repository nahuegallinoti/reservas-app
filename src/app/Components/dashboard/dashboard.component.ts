import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { DashboardService } from 'src/app/Services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isLoading = false;
  SelectedYear;
  Years=[];
  public barChartLabels: Label[] = ['Enero','Febrero','Marzo','Abril','Mayo','Jun', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public cabinData: ChartDataSets[] = [
    { data: [0,0,0,0,0,0,0,0,0,0,0,0], label: ''},
    { data: [0,0,0,0,0,0,0,0,0,0,0,0], label: '' },
  ];
  
  public productData: ChartDataSets[] = [
    { data: [0,0,0,0,0,0,0,0,0,0,0,0], label: ''},
    { data: [0,0,0,0,0,0,0,0,0,0,0,0], label: '' },
  ];

  public CabinbarChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: false,
      // callbacks: {
      //   label: function(tooltipItems, data) {
      //     return data.datasets[tooltipItems.datasetIndex].label + ": $" + parseFloat(tooltipItems.yLabel.toString()).toFixed(2);
      // }
      // }
    },
    legend:{
      align:'start',
      position: 'bottom',
    },
    scales: {
      yAxes: [{
          ticks: {
              // Include a dollar sign in the ticks
              // callback: function(value, index, values) {
              //     return '$' + value;
              // }
          }
      }]
  },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    
  };

  public ProductbarChartOptions: ChartOptions = {
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
      position: 'bottom',
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

  dashboardData : any;
  constructor(
    private dashboardService: DashboardService,
  ) { }

  ngOnInit(): void {

    this.getYearsList();
    this.getDashboardData();
  }

  getDashboardData()
  {
    this.isLoading = true;
    this.dashboardService.getDashboardData(this.SelectedYear).then(res=>{
      this.isLoading = false;
      if(res.status){
        this.cabinData = res.data.CheckInData;
        this.productData = res.data.ProductData;
      }

    }).catch(err=>{
      this.isLoading = false;
    });
  }
  OnYearChange(){
    this.getDashboardData();
  }

  getYearsList(){

    var date = new Date();
    this.SelectedYear = date.getFullYear();
    for (let index = 0; index <= 10; index++) {
       this.Years.push(date.getFullYear()-index);
    }
  }

}
