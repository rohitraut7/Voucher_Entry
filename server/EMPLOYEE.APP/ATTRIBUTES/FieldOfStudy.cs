namespace EMPLOYEE.APP.ATTRIBUTES
{
    public class FieldOfStudy
    {
  
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Subject>? Subjects { get; set; }
    }
}
