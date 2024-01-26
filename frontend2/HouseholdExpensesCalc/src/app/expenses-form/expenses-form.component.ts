import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SelectedCategories, ExpenseData, SharedFormService } from '../shared-form.service';

@Component({
  selector: 'app-expenses-form',
  templateUrl: './expenses-form.component.html',
  styleUrls: ['./expenses-form.component.css']
})
export class ExpensesFormComponent implements OnInit {

  constructor(private elementRef: ElementRef, private sharedFormService: SharedFormService, private formBuilder: FormBuilder) {
    // Update categories list
    const selectedCategories: SelectedCategories[] = this.sharedFormService.getSelectedCategories();
    console.log(selectedCategories);
    var newControlData: ControlData[] = [];
    selectedCategories.forEach(cat => {
      var control: ControlData = this.controlData.find(control => control.controlCategoryName === cat.categoryName) as ControlData;
      if(cat.value == true)
        newControlData.push(control);
    });
    this.controlData = newControlData;

    this.expensesForm = this.createForm();
   }

  expensesForm = new FormGroup({});
  
  controlData: ControlData[] = [
    {
      controlCategoryName: "bills",
      CATEGORY_NAME_PL: "RACHUNKI",
      controls: [
        { controlName: "rent", NAME_PL: "CZYNSZ" },
        { controlName: "electricity", NAME_PL: "PRĄD" },
        { controlName: "gas", NAME_PL: "GAZ" },
        { controlName: "waterAndSewer", NAME_PL: "WODA I ŚCIEKI" },
        { controlName: "heating", NAME_PL: "OGRZEWANIE" },
        { controlName: "garbageCollection", NAME_PL: "WYWÓZ ŚMIECI" },
        { controlName: "phone", NAME_PL: "TELEFON" },
        { controlName: "tvAndInternet", NAME_PL: "TELEWIZJA I INTERNET" },
        { controlName: "otherBills", NAME_PL: "INNE" }
      ]
    },
    {
      controlCategoryName: "financialProducts",
      CATEGORY_NAME_PL: "PRODUKTY FINANSOWE",
      controls: [
        { controlName: "mortgage", NAME_PL: "KREDYT MIESZKANIOWY" },
        { controlName: "otherLoans", NAME_PL: "INNE KREDYTY I POŻYCZKI" },
        { controlName: "savings", NAME_PL: "IKE" },
        { controlName: "otherFinancialProducts", NAME_PL: "INNE" }
      ]
    },
    {
      controlCategoryName: "homeExpenses",
      CATEGORY_NAME_PL: "WYDATKI DOMOWE",
      controls: [
        { controlName: "food", NAME_PL: "ŻYWNOŚĆ" },
        { controlName: "cleaningSupplies", NAME_PL: "ŚRODKI CZYSTOŚCI" },
        { controlName: "clothing", NAME_PL: "UBRANIA" },
        { controlName: "medicationsAndMedicalVisits", NAME_PL: "LEKARSTWA I WIZYTY LEKARSKIE" },
        { controlName: "entertainmentAndHobbies", NAME_PL: "ROZRYWKA I HOBBY" },
        { controlName: "fuelAndTickets", NAME_PL: "PALIWO I BILETY" },
        { controlName: "otherHomeExpenses", NAME_PL: "INNE" }
      ]
    },
    {
      controlCategoryName: "education",
      CATEGORY_NAME_PL: "EDUKACJA",
      controls: [
        { controlName: "tuitionAndCourses", NAME_PL: "CZESNE I KURSY" },
        { controlName: "schoolAndPreschool", NAME_PL: "SZKOŁA I PRZEDSZKOLE" },
        { controlName: "educationalMaterials", NAME_PL: "MATERIAŁY EDUKACYJNE" },
        { controlName: "otherEducation", NAME_PL: "INNE" }
      ]
    },
    {
      controlCategoryName: "occasionalExpenses",
      CATEGORY_NAME_PL: "WYDATKI OKAZJONALNE",
      controls: [
        { controlName: "gifts", NAME_PL: "PREZENTY" },
        { controlName: "holidayExpenses", NAME_PL: "WYDATKI ŚWIĄTECZNE" },
        { controlName: "vacations", NAME_PL: "WAKACJE" },
        { controlName: "repairsAndHomeRenovation", NAME_PL: "NAPRAWY I REMONT MIESZKANIA" },
        { controlName: "otherOccasionalExpenses", NAME_PL: "INNE" }
      ]
    }
  ];

  private createForm(): FormGroup {
    const formGroup = this.formBuilder.group({});
    // Add form controls dynamically
    this.controlData.forEach(category => {
      category.controls.forEach(control => {
        formGroup.addControl(control.controlName, this.formBuilder.control(null));
        formGroup.addControl(control.controlName + 'Frequency', this.formBuilder.control('perMonth'));
      });
    });

    return formGroup;
  }

  ngOnInit(): void { }

  hideSection(id: string, event: any) {
    var element = this.elementRef.nativeElement.querySelector('#' + id);
    element.style.display = element.style.display  == 'none' ? 'block' : 'none';
    event.target.innerHTML = event.target.innerHTML  == '▼' ? '▲' : '▼';
  }

  onSubmit() {
    var processedData: ExpenseData[] = this.processExpensesData(this.expensesForm.value);
    this.sharedFormService.updateExpensesData(processedData);
  }

  return() {
    this.switchToIncomeForm();
  }

  processExpensesData(expensesData: object): ExpenseData[]  {
    return this.controlData.map((category) => {
      const categoryName = category.controlCategoryName;
      const CATEGORY_NAME_PL = category.CATEGORY_NAME_PL;
  
      const expenses = category.controls.map((control) => {
        const expenseName = control.controlName;
        const NAME_PL = control.NAME_PL;
        const expenseValue = expensesData[control.controlName as keyof typeof expensesData] as number | null;
        const expenseFrequency = expensesData[control.controlName + "Frequency"  as keyof typeof expensesData] as string | null;

        return {
          expenseName,
          expenseValue,
          expenseFrequency,
          NAME_PL,
        };
      });
  
      return { categoryName, CATEGORY_NAME_PL, expenses };
    });
  }

  switchToIncomeForm() {
    this.sharedFormService.changeForm('app-income-form');
  }
}

interface ControlData {
  controlCategoryName: string;
  CATEGORY_NAME_PL: string;
  controls: {
    controlName: string;
    NAME_PL: string;
  }[]
}