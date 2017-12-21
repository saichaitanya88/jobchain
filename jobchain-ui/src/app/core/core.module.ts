import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { RepositoryService } from './repository/repository.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    AuthService, 
    StorageService, 
    //{ provide: ApiService, useClass: RepositoryService}, // Simulator Mode
    ApiService // Prod Mode
  ]
})
export class CoreModule { }
