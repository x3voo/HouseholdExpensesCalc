import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedFormService } from './shared-form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  currentForm!: string;
  private subscription!: Subscription;

  title = 'HouseholdExpensesCalc';

  constructor(private sharedFormService: SharedFormService) {}

  private _totalNetIncome: number = 0.00;
  private _incomeData: object = [];
  private _expensesData: object = [];

  updateIncomeData(incomeData: object) {
    this._incomeData = incomeData;
  }

  updateGetData() {
    return this._incomeData;
  }

  updateExpensesData(expensesData: object) {
    return this._expensesData;
  }

  ngOnInit() {
    this.subscription = this.sharedFormService.currentForm$.subscribe((formName) => {
      this.currentForm = formName;
      console.log(formName);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
