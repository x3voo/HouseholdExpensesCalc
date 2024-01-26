import { Component, ElementRef, OnInit } from '@angular/core';
import { IncomeData, ExpenseData, SharedFormService } from '../shared-form.service';
import { Subscription } from 'rxjs';
import { CanvasJS, CanvasJSChart } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.css']
})
export class SummaryViewComponent implements OnInit {

	private subscription_incomeData!: Subscription;
	private subscription_expensesData!: Subscription;

	constructor(private elementRef: ElementRef,  private sharedFormService: SharedFormService) { }

 	chart: any;

	chartOptions = {
		animationEnabled: true,
		//title:{
		//text: "Project Cost Breakdown"
		//},
		data: [{
			type: "doughnut",
			yValueFormatString: "#,###.##'%'",
			indexLabel: "{name}",
			dataPoints: [
				{ y: 1, name: "..." }
			]
		}]
	}
	
	currency: string = "PLN";
	totalIncome: number = 0;
	totalExpenses: number = 0;
	balance: number = 0;

  	ngOnInit(): void {
		this.subscription_expensesData = this.sharedFormService.expensesData$.subscribe((expensesData) => {
			this.updateChartData(expensesData);
			this.updateExpenses(expensesData);
			console.log("[subscription_expensesData][summary-view]");
			console.log(expensesData);
		});
		this.subscription_incomeData = this.sharedFormService.incomeData$.subscribe((incomeData) => {
			this.updateIncome(incomeData);
			console.log("[subscription_incomeData][summary-view]");
			console.log(incomeData);
		});

		this.sharedFormService.getIncomeData();
  	}

  	updateIncome(incomeData: IncomeData[]): void {
		var sum = 0;
		incomeData.forEach(income => {
			switch(income.incomeFrequency) {
				case "perDay":
					if (income.incomeValue != null)
						sum += income.incomeValue * 365;
					break;
				case "perWeek":
					if (income.incomeValue != null)
						sum += income.incomeValue * 52;
					break;
				case "perMonth":
					if (income.incomeValue != null)
						sum += income.incomeValue * 12;
					break;
				case "perYear":
					if (income.incomeValue != null)
						sum += income.incomeValue;
					break;
				default:
					console.log("[Chart] Something wrong with data.");
			}
		});
		this.totalIncome = this.roundToDecimal(sum, 2);
		this.updateBalance();
  	}

	updateBalance(){
		this.balance = this.roundToDecimal(this.totalIncome - this.totalExpenses, 2);
	}

	roundToDecimal(value: number, decimals: number): number {
		const multiplier = Math.pow(10, decimals);
		return parseFloat((Math.round(value * multiplier) / multiplier).toFixed(decimals));
	}

	updateExpenses(expensesData: ExpenseData[]): void {
		var sum = 0;
		expensesData.forEach(category => {
			category.expenses.forEach(expense => {
				switch(expense.expenseFrequency) {
					case "perDay":
						if (expense.expenseValue != null)
							sum += expense.expenseValue * 365;
						break;
					case "perWeek":
						if (expense.expenseValue != null)
							sum += expense.expenseValue * 52;
						break;
					case "perMonth":
						if (expense.expenseValue != null)
							sum += expense.expenseValue * 12;
						break;
					case "perYear":
						if (expense.expenseValue != null)
							sum += expense.expenseValue;
						break;
					default:
						console.log("[Chart] Something wrong with data.");
				}
			});
		});
		this.totalExpenses = this.roundToDecimal(sum, 2);
		this.updateBalance();
	}

	updateChartData(expensesData: ExpenseData[]): void {
		var newDataPoints: {
			y: number;
			name: string;
		}[] = [];
		expensesData.forEach(category => {
			var name = category.CATEGORY_NAME_PL;
			var sum = 0;
			category.expenses.forEach(expense => {
				switch(expense.expenseFrequency) {
					case "perDay":
						if (expense.expenseValue != null)
							sum += expense.expenseValue * 365;
						break;
					case "perWeek":
						if (expense.expenseValue != null)
							sum += expense.expenseValue * 52;
						break;
					case "perMonth":
						if (expense.expenseValue != null)
							sum += expense.expenseValue * 12;
						break;
					case "perYear":
						if (expense.expenseValue != null)
							sum += expense.expenseValue;
						break;
					default:
						console.log("[Chart] Something wrong with data.");
				}
			});
			newDataPoints.push({ y: sum, name: name });
		});
		this.chartOptions.data[0].dataPoints = newDataPoints;
		this.chart.render();
	}

	getChartInstance(chart: object) {
		this.chart = chart;
	}

	ngOnDestroy() {
		this.subscription_expensesData.unsubscribe();
		this.subscription_incomeData.unsubscribe();
	}

	hideSection(id: string, event: any) {
		var element = this.elementRef.nativeElement.querySelector('#'+id);
		element.style.display = element.style.display == 'none' ? 'block' : 'none';
		event.target.innerHTML = event.target.innerHTML == '▼' ? '▲' : '▼';
	}
}
