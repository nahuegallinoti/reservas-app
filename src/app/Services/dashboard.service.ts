import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { UIService } from "../Shared/ui.service";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

  constructor(
    private firestore: AngularFirestore,
    private uiService: UIService
  ) {}

  getDashboardData(selectedYear) {
   
    var $this = this;
    return new Promise<any>((resolve, reject) => {


        var data = {
            CheckInData:[],
            ProductData:[],
            CancelReservationData:[],
        }
        $this.getCheckInData(selectedYear).then(res=>{

            if(res.status)
                data.CheckInData =  res.data;

            this.getProductConsumptionData(selectedYear).then(res=>{

                if(res.status)
                   data.ProductData =  res.data;

                   this.getCancelReservationData(selectedYear).then(res=>{

                    if(res.status)
                       data.CancelReservationData =  res.data;

                    resolve({ status:true,data:data});

                    }).catch(error=>{
                        resolve({ status:true,data:data});
                    });

                
            }).catch(error=>{

                this.getCancelReservationData(selectedYear).then(res=>{

                    if(res.status)
                       data.CancelReservationData =  res.data;

                    resolve({ status:true,data:data});

                }).catch(error=>{
                    resolve({ status:true,data:data});
                });

            });

        }).catch(error=>{

            this.getProductConsumptionData(selectedYear).then(res=>{

                if(res.status)
                   data.ProductData =  res.data;

                resolve({ status:true,data:data});
            }).catch(error=>{

                this.getCancelReservationData(selectedYear).then(res=>{

                    if(res.status)
                       data.CancelReservationData =  res.data;

                    resolve({ status:true,data:data});

                }).catch(error=>{
                    resolve({ status:false,message:error.message});
                });
                
            });
        });
    });

  }

  getCheckInData(selectedYear){

    var $this = this;
    return new Promise<any>((resolve, reject) => {

        $this.firestore.collection('checkin'
        ).snapshotChanges()
        .pipe(
            map((docArray) => {
                var result=[];
                docArray.forEach(doc => {
                    const element = doc.payload.doc.data();
                    var date = new Date(element['evento'].start.seconds* 1000);
                    if(date.getFullYear() == selectedYear)
                    {
                        var cabana = result.filter(p=>p.cabana.id == element['evento'].extendedProps.cabana.id);
                        if(cabana.length>0)
                        {
                           var index =  result.indexOf(cabana[0]);
                           result[index].checkin.push({checkin_date: date});
                        }
                        else{
                            result.push({
                                cabana:{
                                    id:element['evento'].extendedProps.cabana.id,
                                    name:element['evento'].extendedProps.cabana.nombre,
                                },
                                checkin:[{checkin_date: date}]
                            });
                        }
                    }
                    else{
                        var cabana = result.filter(p=>p.cabana.id == element['evento'].extendedProps.cabana.id);
                        if(cabana.length==0){
                            result.push({
                                cabana:{
                                    id:element['evento'].extendedProps.cabana.id,
                                    name:element['evento'].extendedProps.cabana.nombre,
                                },
                                checkin:[]
                            });
                        }
                    }
                });
    
                var result_set =[];
                result.forEach(element => {
                    var months = [];
                    for (let index = 1; index <= 12; index++) {
                        var count_= element.checkin.filter(p=> p.checkin_date && p.checkin_date.getMonth()+1 == index);
                        months.push(count_.length);
                    }
                    result_set.push({
                        data: months,
                        label:element.cabana.name
                    })
                });
                
                return result_set;
            })
          )
        .subscribe(snapshots => {
            resolve({status:true, data:snapshots});
        },error=>{
            resolve({status:false, message:error.message});
        });

        

    });
  }

  getProductConsumptionData(selectedYear){

    var $this = this;
    return new Promise<any>((resolve, reject) => {

        $this.firestore.collection('consumos'
        ).snapshotChanges()
        .pipe(
            map((docArray) => {
                var result=[];
                docArray.forEach(doc => {
                    const element = doc.payload.doc.data();
                    var consuptions  = element['consumos'];
                        consuptions.forEach(element => {
                            var date = new Date(element['fecha'].seconds* 1000);
                            if(date.getFullYear() == selectedYear){

                                var product = result.filter(p=>p.product.id == element['producto'].id);
                                if(product.length>0)
                                {
                                   var index =  result.indexOf(product[0]);
                                   result[index].info.push({date:date, amount:element['monto']});
                                }
                                else{
                                    result.push({
                                        product:{
                                            id:element['producto'].id,
                                            name:element['producto'].descripcion,
                                        },
                                        info:[{
                                            date:date,
                                            amount:element['monto']
                                        }]
                                    });
                                }
                            }
                            else{
                                var product = result.filter(p=>p.product.id == element['producto'].id);
                                if(product.length==0){
                                    result.push({
                                        product:{
                                            id:element['producto'].id,
                                            name:element['producto'].descripcion,
                                        },
                                        info:[{
                                            date:date,
                                            amount:0
                                        }]
                                    });
                                }
                            }
                        });
                });
    
                var result_set =[];
                result.forEach(element => {
                    var months = [];
                    for (let index = 1; index <= 12; index++) {
                        var consuptions_= element.info.filter(p=> p.date && p.date.getMonth()+1 == index);
                        var amount = 0;
                        consuptions_.forEach(con => {
                            amount = amount + parseFloat(con['amount']);
                        });
                        months.push(amount);
                    }
                    result_set.push({
                        data: months,
                        label:element.product.name
                    })
                });
                
                return result_set;
            })
          )
        .subscribe(snapshots => {
            resolve({status:true, data:snapshots});
        },error=>{
            resolve({status:false, message:error.message});
        });
    });
  }

  getCancelReservationData(selectedYear){

    var $this = this;
    return new Promise<any>((resolve, reject) => {

        $this.firestore.collection('solicitudReserva'
        ).snapshotChanges()
        .pipe(
            map((docArray) => {
                var result=[];
                docArray.forEach(doc => {
                    const element = doc.payload.doc.data();
                    if(element['fechaDesde']){
                        var date = null;
                        if(typeof element['fechaDesde'] === 'object')
                           date = new Date(element['fechaDesde'].seconds* 1000);
                        else if(typeof element['fechaDesde'] === 'string')
                            date = new Date(element['fechaDesde']);

                        if(date && date.getFullYear() == selectedYear)
                        {
                            if(element['estado']['descripcion'] == "Cancelado")
                            {
                                result.push({
                                    date:date
                                });
                            }
                        }
                    }
                });
    
                var months = [];
                for (let index = 1; index <= 12; index++) {
                    var count_= result.filter(p=> p.date && p.date.getMonth()+1 == index);
                    months.push(count_.length);
                }
                
                return [{data: months}];
            })
          )
        .subscribe(snapshots => {
            resolve({status:true, data:snapshots});
        },error=>{
            resolve({status:false, message:error.message});
        });

    });
    
  }

}