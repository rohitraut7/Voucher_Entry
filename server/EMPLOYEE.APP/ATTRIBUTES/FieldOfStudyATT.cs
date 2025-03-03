using EMPLOYEE.APP.ATTRIBUTES;

namespace EMPLOYEE.APP
{
    public class FieldOfStudyATT
    {
        public int Id { get; set; }
        public string? Name { get; set; }

       public List<FieldOfSubjectATT>  fosubList { get; set; }

    }
}
