using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EMPLOYEE.APP.ATTRIBUTES
{
    public class Subject
    {
      
        public int id { get; set; }
        public int field { get; set; }
        public int sub { get; set; }
        public string field_name { get; set; }
        public string sub_name { get; set; }
    }
}
