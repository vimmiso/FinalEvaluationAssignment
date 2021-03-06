import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IEmployee } from 'src/app/models/iemployee';
import { HttpClient } from '@angular/common/http';
import { EmployeeserviceService } from 'src/app/services/employeeservice.service';
import { EmployeeResolved, IEmployee2 } from 'src/app/models/IEmployee2';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css']
})
export class ManageEmployeeComponent implements OnInit {

  filteredEmployees:IEmployee[];
 employeelist:IEmployee[] = [];
 errorMessage:string;
  
 header:boolean=false;
 employee:IEmployee;
 employeelist2:IEmployee2[]=[];
 filteredEmployee:IEmployee = {Name:"",Id:0,DOB:"",DOJ:"",Salary:0,Email:"",Role:"",TotalLeave:""};
 listFilter:string="";
 constructor(private http:HttpClient,private employeeService:EmployeeserviceService,private route:ActivatedRoute,private router:Router) { 
 }

 empId = Number(this.route.snapshot.paramMap.get('id'));

 ngOnInit(): void {


  this.route.data.subscribe(data => {
    const resolvedData: EmployeeResolved = data['resolvedData'];
    this.errorMessage = resolvedData.error;
    this.onEmployeeRetrieved(resolvedData.eemployeelist);
  })




   this.employeeService.getemployees().subscribe(
     employees => {
       this.employeelist = employees;
       this.filteredEmployees = this.employeelist;

     },
     error => this.errorMessage = <any>error
   );


   this.route.paramMap.subscribe(
    params => {
      this.empId = +params.get('id');
    }
  );
  if(this.empId){
    this.header=true;
    this.employeeService.getemp(this.empId).subscribe(
      employee => {
        this.employee = employee;
        this.filteredEmployee = this.employee;
      },
      error => this.errorMessage = <any>error
    );
  }else{
    this.header=false;
  }

 }

 Search(){
   if(this.listFilter !== ""){
    this.employeelist2 = this.employeelist2.filter(res=>{
      if(res.name !== null){
        return res.name.toString().toLowerCase().match(this.listFilter.toString().toLowerCase());
      }
    });
  }else if(this.listFilter === ""){
    this.ngOnInit();
  }
 }

 delete(id:number){
   this.employeeService.deleteEmp(id).subscribe(
    (error: any) => this.errorMessage = <any>error
   )
 }

 onEmployeeRetrieved(emp:IEmployee2[]):void{
  this.employeelist2 = emp;
 }

 reloadComponent(){
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate(['/manageemp', this.empId]);
}


 onGetId():void{
  this.ngOnInit();
  this.route.paramMap.subscribe(
    params => {
      this.empId = +params.get('id');
    }
  );
  if(this.empId !== null){
    this.header=true;
    this.employeeService.getemp(this.empId).subscribe(
      employee => {
        this.employee = employee;
        this.filteredEmployee = this.employee;
      },
      error => this.errorMessage = <any>error
    );
  }else{
    this.header=false;
  }
 }


}
