using System;
using System.Collections.Generic;
using System.Text;

namespace HECDB.Models
{
    public class Expenses
    {
        public string categoryName { get; set; }
        public string CATEGORY_NAME_PL { get; set; }
        public Expense[] expenses { get; set; }

    }
}
