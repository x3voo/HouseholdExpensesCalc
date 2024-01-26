using System;
using System.Collections.Generic;
using System.Text;

namespace HECDB.Models
{
    public class Income
    {
        public string incomeName { get; set; }
        public int? incomeValue { get; set; }
        public string? incomeFrequency { get; set; }
        public string NAME_PL { get; set; }
    }
}
