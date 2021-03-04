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
  SelectedYear;
  Years=[];
  public barChartLabels: Label[] = ['Enero','Febrero','Marzo','Abril','Mayo','Jun', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public cabinData: ChartDataSets[] = [
    { data: [20,50,70,90,110,130,150,70,90,110,130,150], label: 'Cab1'},
    { data: [30,40,60,80,100,120,140,70,90,110,130,150], label: 'Cab2' },
    { data: [30,40,60,80,100,120,140,70,90,110,130,150], label: 'Cab3' },
    { data: [30,40,60,80,100,120,140,70,90,110,130,150], label: 'Cab4' },
    { data: [10,30,50,70,90,110,130,150,170,190,210,230], label: 'Cab5' },
    { data: [20,40,60,80,100,120,140,160,180,200,220,250], label: 'Cab6' }
  ];
  
  public productData: ChartDataSets[] = [
    { data: [20,50,70,90,110,130,150,70,90,110,130,150], label: 'P1'},
    { data: [30,40,60,80,100,120,140,70,90,110,130,150], label: 'P2' },
    { data: [30,40,60,80,100,120,140,70,90,110,130,150], label: 'P3' },
    { data: [30,40,60,80,100,120,140,70,90,110,130,150], label: 'P4' },
    { data: [10,30,50,70,90,110,130,150,170,190,210,230], label: 'P5' },
    { data: [20,40,60,80,100,120,140,160,180,200,220,250], label: 'P6' }
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

  constructor() { }

  ngOnInit(): void {

    this.getYearsList();
  }

  OnYearChange(){

  }

  getYearsList(){

    var date = new Date();
    this.SelectedYear = date.getFullYear();
    for (let index = 0; index <= 10; index++) {
       this.Years.push(date.getFullYear()-index);
    }
  }

}
