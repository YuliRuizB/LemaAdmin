// Import necessary modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

// Import your component
import { CommonLayoutComponent } from './common-layout/common-layout.component';
import { MenuRoutingModule } from './menu-routing.module';

@NgModule({
  declarations: [
    // Include your components here
    
    // ... other components
  ],
  imports: [
    // Include necessary modules
    CommonModule,
    RouterModule, // Add this line
    NzBreadCrumbModule, // Add this line
    MenuRoutingModule,
    // ... other modules
  ],
})
export class MenuModule {}
