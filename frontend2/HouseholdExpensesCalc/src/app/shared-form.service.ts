import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for API requests

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedFormService {

  private _api: API;

  constructor(private http: HttpClient) { 
    this._api = new API(http); 
  }

  //FORMS
  private currentFormSource = new BehaviorSubject<string>('app-income-form');
  currentForm$ = this.currentFormSource.asObservable();

  changeForm(formName: string) {
    this.currentFormSource.next(formName);
  }
  
  private _catData: SelectedCategories[] = [];

  selectedCategories(selCatData: SelectedCategories[]) {
    this._catData = selCatData;
  }

  getSelectedCategories(): SelectedCategories[]{
    return this._catData;
  }

  //INCOME
  private _incomeDataSubject = new Subject<IncomeData[]>();
  incomeData$ = this._incomeDataSubject.asObservable();

  updateIncomeData(incomeData: IncomeData[]) {
    const postObservable = this._api.post(incomeData);
    if (postObservable) {
      postObservable.subscribe(
        updatedData => {
          this._incomeDataSubject.next(updatedData);
        },
        error => {
          console.error("Error updating income data:", error);
        }
      );
    } else {
      console.error("API post returned null. Unable to update income data.");
    }
  }

  getIncomeData() {
    const getObservable = this._api.get(DATA_TYPE.INCOME_DATA);

    if (getObservable) {
      getObservable.subscribe(
        updatedData => {
          this._incomeDataSubject.next(updatedData);
        },
        error => {
          console.error("Error updating income data:", error);
        }
      );
    } else {
      console.error("API post returned null. Unable to update income data.");
    }
  }

  //EXPENSES
  private _expensesDataSubject = new Subject<ExpenseData[]>();
  expensesData$ = this._expensesDataSubject.asObservable();

  updateExpensesData(expenseData: ExpenseData[]) {
    const postObservable = this._api.post(expenseData);
    if (postObservable) {
      postObservable.subscribe(
        updatedData => {
          this._expensesDataSubject.next(updatedData);
        },
        error => {
          console.error("Error updating income data:", error);
        }
      );
    } else {
      console.error("API post returned null. Unable to update income data.");
    }
  }
}

class API {
  constructor(private http: HttpClient) { }

  private _api_url = "http://127.0.0.1:8080";

  post(data: any[]): Observable<any> | null {
    if(this.isExpenseDataArray(data)){
      return this.http.post<ExpenseData[]>(`${this._api_url}/expenses`, data);
    } else if (this.isIncomeDataArray(data)) {
      return this.http.post<IncomeData[]>(`${this._api_url}/income`, data);
    } else {
      console.log("[API] Invalid data type.")
      return null;
    }
  }

  get(type: DATA_TYPE): Observable<any> | null {
    if(type === DATA_TYPE.EXPENSE_DATA){
      var expensesData: ExpenseData[] = [];

      return this.http.get<ExpenseData[]>(`${this._api_url}/expenses`).pipe(
        map((data: ExpenseData[]) => {
          console.log(data);
          return data.map(expense => ({
            categoryName: expense.categoryName,
            CATEGORY_NAME_PL: expense.CATEGORY_NAME_PL,
            expenses: expense.expenses.map(expense => ({
              expenseName: expense.expenseName,
              expenseValue: expense.expenseValue,
              expenseFrequency: expense.expenseFrequency,
              NAME_PL: expense.NAME_PL
            }))
          }));
        })
      );
      
    } else if (type === DATA_TYPE.INCOME_DATA) {
      return this.http.get<IncomeData[]>(`${this._api_url}/income`).pipe(
        map((data: IncomeData[]) => {
          console.log(data);
            return data.map(income => ({
              incomeName: income.incomeName,
              incomeValue: income.incomeValue,
              incomeFrequency: income.incomeFrequency,
              NAME_PL: income.NAME_PL
            }));
        })
      )
    } else {
      console.log("[API] Invalid data requested.");
      return null;
    }
  }

  // Check if data is of type ExpenseData[]
  private isExpenseDataArray(data: any): data is ExpenseData[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item) => {
        return (
        typeof item.categoryName === 'string' &&
        typeof item.CATEGORY_NAME_PL === 'string' &&
        Array.isArray(item.expenses) &&
        item.expenses.every((expense: { expenseName: any; expenseValue: null; expenseFrequency: null; NAME_PL: any; }) =>
          typeof expense.expenseName === 'string' &&
          (typeof expense.expenseValue === 'number' || expense.expenseValue === null) &&
          (typeof expense.expenseFrequency === 'string' || expense.expenseFrequency === null) &&
          typeof expense.NAME_PL === 'string'
        )
      );
    });
  }

  // Check if data is of type IncomeData[]
  private isIncomeDataArray(data: any): data is IncomeData[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item) =>
      typeof item.incomeName === 'string' &&
      (typeof item.incomeValue === 'number' || item.incomeValue === null) &&
      (typeof item.incomeFrequency === 'string' || item.incomeFrequency === null) &&
      typeof item.NAME_PL === 'string'
    );
  }
}

enum DATA_TYPE {
  EXPENSE_DATA,
  INCOME_DATA
}

export interface ExpenseData {
  categoryName: string;
  CATEGORY_NAME_PL: string;
  expenses: {
    expenseName: string;
    expenseValue: number | null;
    expenseFrequency: string | null;
    NAME_PL: string;
  }[]
}

export interface IncomeData {
  incomeName: string;
  incomeValue: number | null;
  incomeFrequency: string | null;
  NAME_PL: string;
}

export interface SelectedCategories {
  categoryName: string;
  value: boolean;
}