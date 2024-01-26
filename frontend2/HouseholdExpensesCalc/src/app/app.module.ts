import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Custom providers
import { SharedFormService } from './shared-form.service';

//3rd party modules
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts'; // https://canvasjs.com/angular-charts/doughnut-chart-index-data-label

import { AppComponent } from './app.component';
import { IncomeFormComponent } from './income-form/income-form.component';
import { ExpensesFormComponent } from './expenses-form/expenses-form.component';
import { SummaryViewComponent } from './summary-view/summary-view.component';

@NgModule({
  declarations: [
    AppComponent,
    IncomeFormComponent,
    ExpensesFormComponent,
    SummaryViewComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CanvasJSAngularChartsModule,
    HttpClientModule
  ],
  providers: [
    SharedFormService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
