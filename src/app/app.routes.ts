import { NgModule }from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataResolver } from './app.resolver';

const ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
