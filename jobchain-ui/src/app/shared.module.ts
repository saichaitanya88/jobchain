import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdlModule } from "@angular-mdl/core";


@NgModule({
  imports: [
    CommonModule, FormsModule, MdlModule
  ],
  exports: [
      FormsModule, MdlModule
  ],
  declarations: [],
  providers: [ ]
})
export class SharedModule { }
