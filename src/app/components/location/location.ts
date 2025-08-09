import { Component,ChangeDetectorRef,inject } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule,FormsModule } from '@angular/forms';
import { Adminservice } from '../../security/service/adminservice';

@Component({
  selector: 'app-location',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './location.html',
  styleUrl: './location.css'
})
export class Location {
  private adminService = inject(Adminservice)
 locationForm: FormGroup;
  editForm: FormGroup;
  showModal = false;
  locations:any[] = [];
  newLocation:string=''

  selectedIndex: number | null = null;

  constructor(private fb: FormBuilder,private cdr:ChangeDetectorRef) {
    this.locationForm = this.fb.group({ name: [''] });
    this.editForm = this.fb.group({ name: [''] });
  }

  ngOnInit(){
    this.loadLocation()
  }
  loadLocation(){
    this.adminService.getLocations().subscribe({
      next:(res:any)=>{
        this.locations = res.data
        
        this.cdr.detectChanges()
      }
    })
  }

  addLocation() {
  if (this.newLocation?.trim()) {
    this.adminService.postLocation(this.newLocation.trim()).subscribe({
      next: (res: any) => {
        console.log(res);
        this.loadLocation()
        this.cdr.detectChanges();
        this.newLocation = ''; // Reset input
      }
    });
  }
}

location_update:any={
  locationName:'',
  locationId:0
}
  openModal(location:any) {
    this.location_update.locationName = location.location;
    this.location_update.locationId = location.id
    console.log(this.location_update)
    this.showModal = true;
    
    
   
  }

  updateLocation() {
    const location = this.location_update.locationName;
    if(location.trim()){
      this.adminService.editLocation(this.location_update.locationName,this.location_update.locationId).subscribe({
      next:(res:any)=>{
        this.loadLocation()
        this.showModal = false;
      }
    })
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedIndex = null;
  }

 deleteLocation(location:any) {
  const confirmed = confirm(`Are you sure you want to delete the "${location.location}" location?`);
  if (confirmed) {
    this.adminService.deleteLocation(location.id).subscribe({
      next:(res:any)=>{
        console.log(res)
        this.loadLocation()
        this.cdr.detectChanges()
      }
    })

    
  }
}

}
