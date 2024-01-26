import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SelectedCategories, IncomeData, SharedFormService } from '../shared-form.service';

@Component({
  selector: 'app-income-form',
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.css']
})

export class IncomeFormComponent implements OnInit {

  constructor(private elementRef: ElementRef, private sharedFormService: SharedFormService, private formBuilder: FormBuilder) {
    this.incomeForm = this.createForm();
   }

  incomeForm = new FormGroup({});

  controlData: ControlData[] = [
    { controlName: "payAfterTax", NAME_PL: "WYNAGRODZENIE NETTO" },
    { controlName: "pension", NAME_PL: "EMERYTURA/RENTA" },
    { controlName: "allowance", NAME_PL: "ZASIŁEK" },
    { controlName: "alimony", NAME_PL: "ALIMENTY" },
    { controlName: "otherIncome", NAME_PL: "INNE" }
  ];

  controlOptionsData: ControlData[] = [
    { controlName: "bills", NAME_PL: "RACHUNKI" },
    { controlName: "financialProducts", NAME_PL: "PRODUKTY FINANSOWE" },
    { controlName: "homeExpenses", NAME_PL: "WYDATKI DOMOWE" },
    { controlName: "education", NAME_PL: "EDUKACJA" },
    { controlName: "occasionalExpenses", NAME_PL: "WYDATKI OKAZJONALNE" }
  ];

  private createForm(): FormGroup {
    const formGroup = this.formBuilder.group({});

    this.controlData.forEach(control => {
      formGroup.addControl(control['controlName'], this.formBuilder.control(null));
      formGroup.addControl(control['controlName'] + 'Frequency', this.formBuilder.control('perMonth'));
    });

    this.controlOptionsData.forEach(control => {
      formGroup.addControl(control['controlName'], this.formBuilder.control(true));
    });

    return formGroup;
  }

  ngOnInit(): void { }

  hideSection(id: string, event: any) {
    var element = this.elementRef.nativeElement.querySelector('#'+id);
    element.style.display = element.style.display == 'none' ? 'block' : 'none';
    event.target.innerHTML = event.target.innerHTML == '▼' ? '▲' : '▼';
  }

  onSubmit() {
    var processedData: IncomeData[] = this.processIncomeData(this.incomeForm.value);
    this.sharedFormService.updateIncomeData(processedData);
    this.sharedFormService.selectedCategories(this.getSelectedCategoriesData());
    // Go to expenses with calculated yearly income
    this.switchToExpensesForm();
  }

  getSelectedCategoriesData(): SelectedCategories[]  {
    return this.controlOptionsData.map((cat) => {
      const categoryName = cat.controlName;
      const control = this.incomeForm.get(cat.controlName);
      const value = control ? control.value : null;

      return { categoryName, value };
    });
  }

  processIncomeData(expensesData: object): IncomeData[]  {
    return this.controlData.map((income) => {
      const incomeName = income.controlName;
      const incomeValue = expensesData[income.controlName as keyof typeof expensesData] as number | null;
      const incomeFrequency = expensesData[income.controlName + "Frequency"  as keyof typeof expensesData] as string | null;
      const NAME_PL = income.NAME_PL;
  
      return { incomeName, incomeValue, incomeFrequency, NAME_PL };
    });
  }

  switchToExpensesForm() {
    this.sharedFormService.changeForm('app-expenses-form');
  }

  getControlLabel(type: string){
    return this.incomeForm.controls[type].value;
   }
}

interface ControlData {
  controlName: string;
  NAME_PL: string;
}