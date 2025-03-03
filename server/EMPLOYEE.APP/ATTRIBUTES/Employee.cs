using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EMPLOYEE.APP.ATTRIBUTES
{
    public class Employee
    {
       
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Tel { get; set; }

        public List<Subject> sub { get; set; }
    }
}

