import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
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
  public ChartLabels: Label[] = ['Enero','Febrero','Marzo','Abril','Mayo','Jun', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public ChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public cabinData: ChartDataSets[] = [
    { data: [0,0,0,0,0,0,0,0,0,0,0,0], label: ''},
  ];

  public cabinPieLabels: Label[] = [];
  public cabinPieData: MultiDataSet = [
    [0,0,0,0,0,0,0,0,0,0,0,0],
  ];
  
  public productData: ChartDataSets[] = [
    { data: [0,0,0,0,0,0,0,0,0,0,0,0], label: ''},
  ];

  public productPieLabels: Label[] = [];
  public productPieData: MultiDataSet = [
    [0,0,0,0,0,0,0,0,0,0,0,0],
  ];

  public canceledData: ChartDataSets[] = [
    { data: [0,0,0,0,0,0,0,0,0,0,0,0]},
  ];

  public canceledPieData: MultiDataSet = [
    [0,0,0,0,0,0,0,0,0,0,0,0],
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

  public ProductPieChartOptions: ChartOptions = {
    responsive: true,
    cutoutPercentage: 50,
    tooltips: {
      callbacks: {
        label: function(tooltipItems, data) {
          return data.labels[tooltipItems.index] + ": $" + parseFloat(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index].toString()).toFixed(2);
      }
      }
    },
  
};

public DefaultPieChartOptions: ChartOptions = {
  responsive: true,
  cutoutPercentage: 50,
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
        this.canceledData = res.data.CancelReservationData;

        if(this.cabinData.length>0)
        {
          var pie_date=[];
          this.cabinData.forEach(element => {
            if(pie_date.length==0){
              pie_date = Object.assign([], element['data']);
            }
            else{
              for (let index = 0; index < element['data'].length; index++) {
                pie_date[index] = pie_date[index] + element['data'][index];
              }
            }
          });
          this.cabinPieData = [pie_date];
        }

        if(this.productData.length>0){
          var pie_date=[];
          this.productData.forEach(element => {
            if(pie_date.length==0){
              pie_date = Object.assign([], element['data']);
            }
            else{
              for (let index = 0; index < element['data'].length; index++) {
                pie_date[index] = (pie_date[index] + element['data'][index]);
              }
            }
          });
          this.productPieData = [pie_date];
        }
        
        if(this.canceledData.length>0)
           this.canceledPieData = [this.canceledData[0]['data']];
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

  onChartChange(value){
    this.ChartType = value;
  }

}
