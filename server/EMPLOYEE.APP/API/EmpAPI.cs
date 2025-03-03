using EMPLOYEE.APP.ATTRIBUTES;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Collections.Generic;
using System.Reflection.Metadata.Ecma335;
using System.Xml.Linq;

namespace EMPLOYEE.APP.API
{
    public static class EmpAPI
    {
        
        public static void RegisterEmpAPI(this WebApplication app)
        {
            //app.MapGet("/getEmpInfo",getInfo);
            //app.MapGet("/getEmpInfoById", getInfoById);
            //app.MapPost("/SaveEmpInfo", PostEmpInfo);
            //app.MapPost("/SaveFieldOfStudy", SaveFieldOfStudy);
            //app.MapPost("/SaveFieldOfSubjectlist", SaveFieldOfSubject);
            //app.MapPost("/SaveFieldSubject", SaveFieldSubject);
            app.MapGet("/getFieldofstudylist", getFieldOfStudy);
            app.MapPost("/SaveFieldSubjects", SaveFieldSubjects);
            app.MapGet("/getSubjectbyCourseId", getSubjectbyCoureseid);
            app.MapPost("SaveStudentdetails", SaveStudentdetails);
            app.MapGet("getStudentInfoByStudentId", getStudentInfoByStudentId);
            app.MapPost("updateStudentdetails", UpdateStudentdetails);

        }

        public static IResult getInfo(IConfiguration configuration)
        {

            List<EmployeeATT> empList = new List<EmployeeATT>();
          
            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
            {
                conn.Open();
                var selectQuery= "select * from public.emp_info ei";

                using (var cmd = new NpgsqlCommand(selectQuery, conn))
               
                  
                using (var reader = cmd.ExecuteReader()) // Execute query
                {
                    
                    while (reader.Read()) // Read data row by row
                    {
                        // Assign values to object
                       var  emp = new EmployeeATT
                        {
                            Id = reader.GetInt32(0), 
                            Name = reader.GetString(1),
                            Address = reader.GetString(2),
                            ContactNo = reader.GetInt32(8),
                            age = reader.GetInt32(3)
       
                        };
                        empList.Add(emp);

                    }
                }
            }

            return Results.Ok(empList);
        }


        public static IResult getInfoById(int empid, IConfiguration __configuration)
        {

            EmployeeATT emp = new EmployeeATT();


            using (var conn = new NpgsqlConnection(__configuration.GetConnectionString("DbConnString")))
            {
                conn.Open(); // Open connection

                var cmd = new NpgsqlCommand("select * from public.emp_info ei where id=@id", conn);

                cmd.Parameters.AddWithValue("@id", empid);


                using (var reader = cmd.ExecuteReader()) // Execute query
                {

                    while (reader.Read()) // Read data row by row
                    {
                        // Assign values to object
                        emp = new EmployeeATT
                        {
                            Id = reader.GetInt32(0),
                            Name = reader.GetString(1),
                            Address = reader.GetString(2),
                            age = reader.GetInt32(3)

                        };


                    }
                }
            }

            return Results.Ok(emp);
        }


        public static IResult PostEmpInfo(EmployeeATT emp, IConfiguration configuration)
        {


            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
            {
                conn.Open();

                string insertQuery = "INSERT INTO public.emp_info(id,name, address, age)VALUES(@id,@name,@address,@age);";
                using (var cmd = new NpgsqlCommand(insertQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@id", emp.Id);
                    cmd.Parameters.AddWithValue("@name", emp.Name);
                    cmd.Parameters.AddWithValue("@address", emp.Address);
                    cmd.Parameters.AddWithValue("@age", emp.age);

                    int rowsAffected = cmd.ExecuteNonQuery(); // Execute INSERT

                    return Results.Ok($"{rowsAffected} row(s) inserted.");

                }
            }


        }


        public static IResult SaveFieldOfStudy(FieldOfStudyATT fos, IConfiguration configuration)

        {
            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
            {
                conn.Open();

                string insertQuery = "INSERT INTO public.field_study(id,name)VALUES(@id,@name);";
                using (var cmd = new NpgsqlCommand(insertQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@id", fos.Id);
                    cmd.Parameters.AddWithValue("@name", fos.Name);


                    int rowsAffected = cmd.ExecuteNonQuery(); // Execute INSERT

                    return Results.Ok($"{rowsAffected} row(s) inserted.");
                }
            }
        }






        public static IResult SaveFieldSubjects(FieldOfStudyATT fos, IConfiguration configuration)
        {
            try
            {
                using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
                {
                    conn.Open();

                    string insertQuery = "INSERT INTO public.field_study(id,name)VALUES(@id,@name);";

                    using (var cmd = new NpgsqlCommand(insertQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@id", fos.Id);
                        cmd.Parameters.AddWithValue("@name", fos.Name);


                        cmd.ExecuteNonQuery();
                    }

                    string insertSubject = "INSERT INTO public.field_subjects(f_id, s_id, s_name)VALUES(@f_id, @s_id, @s_name);";

                    foreach (FieldOfSubjectATT item in fos.fosubList)
                    {
                       
                            using (var cmd = new NpgsqlCommand(insertSubject, conn))

                            {
                                cmd.Parameters.AddWithValue("@f_id", item.FId);
                                cmd.Parameters.AddWithValue("@s_id", item.Sid);
                                cmd.Parameters.AddWithValue("@s_name", item.Sname);

                                cmd.ExecuteNonQuery();
                            }
                        

                    }
                }

            }
            catch (Exception ex)
            {
                return Results.Problem($"Error saving Field of Subject: {ex.Message}");
            }

            return Results.Ok("Saved");
        }


        public static IResult getFieldOfStudy(IConfiguration configuration)
        {

            List<FieldOfStudyATT> foslist = new List<FieldOfStudyATT>();

            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
            {
                conn.Open(); // Open connection
                var selectQuery = "select * from public.field_study";

                using (var cmd = new NpgsqlCommand(selectQuery, conn)) 


                using (var reader = cmd.ExecuteReader()) 
                {

                    while (reader.Read()) // Read data row by row
                    {
                        // Assign values to object
                        var fieldOfS = new FieldOfStudyATT
                        {
                            Id = reader.GetInt32(0),
                            Name = reader.GetString(1),

                        };
                        foslist.Add(fieldOfS);

                    }
                }
            }
            return Results.Ok(foslist);
        }


        public static IResult getSubjectbyCoureseid(int courseid, IConfiguration configuration)
        {

            List<FieldOfSubjectATT> sublist = new List<FieldOfSubjectATT>();

            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
            {
                conn.Open(); // Open connection
                var selectQuery = "select fs2.s_id,fs2.s_name  from public.field_subjects fs2 where fs2.f_id=@f_id;";

                var cmd = new NpgsqlCommand(selectQuery, conn);

                cmd.Parameters.AddWithValue("@f_id", courseid);


                using (var reader = cmd.ExecuteReader()) // Execute query
                {

                    while (reader.Read()) // Read data row by row
                    {
                        // Assign values to object
                        var sub = new FieldOfSubjectATT
                        {
                            Sid= reader.GetInt32(0),
                            Sname = reader.GetString(1)
                          

                        };
                        sublist.Add(sub);

                    }
                }
            }
            return Results.Ok(sublist);
        }


        public static async Task<IResult> SaveStudentdetails(Employee emp, IConfiguration configuration)
        {
            if (emp == null || string.IsNullOrWhiteSpace(emp.Name))
            {
                return Results.BadRequest("Invalid employee data.");
            }

            try
            {
                using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
                {
                    await conn.OpenAsync();

                    using (var transaction = await conn.BeginTransactionAsync())
                    {
                        try
                        {
                            // Insert Employee Details
                            string insertstudetails = @"
                        INSERT INTO public.student_details(name,address, tel) 
                        VALUES(@name, @address, @tel) RETURNING id;";

                            int stId = 0;
                            using (var cmd = new NpgsqlCommand(insertstudetails, conn, transaction))
                            {
                                //cmd.Parameters.AddWithValue("@id", emp.Id);
                                cmd.Parameters.AddWithValue("@name", emp.Name);
                                cmd.Parameters.AddWithValue("@address", emp.Address);
                                cmd.Parameters.AddWithValue("@tel", emp.Tel);


                                stId= (int)await cmd.ExecuteScalarAsync();
                            }

                            // Insert Subjects (only if subjects exist)
                            if (emp.sub != null && emp.sub.Any())
                            {
                                string insertSubject = @"
                            INSERT INTO public.student_subject(st_id, field, sub) 
                            VALUES(@st_id, @field, @sub);";

                                foreach (var subject in emp.sub)
                                {
                                    using (var cmd = new NpgsqlCommand(insertSubject, conn, transaction))
                                    {
                                        cmd.Parameters.AddWithValue("@st_id", stId);
                                        cmd.Parameters.AddWithValue("@field", subject.field);
                                        cmd.Parameters.AddWithValue("@sub", subject.sub);

                                        await cmd.ExecuteNonQueryAsync();
                                    }
                                }
                            }

                            await transaction.CommitAsync();
                            return Results.Ok($"Saved successfully and your student role number ={stId}");
                        }
                        catch (Exception ex)
                        {
                            await transaction.RollbackAsync();
                            return Results.Problem($"Transaction failed: {ex.Message}");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Results.Problem($"Error saving student details: {ex.Message}");
            }
        }



        public static IResult getStudentInfoByStudentId(int sid, IConfiguration configuration)
        {
            Employee emp = null;

            string selectQuery = @"
        SELECT sd.id, sd.name, sd.address, sd.tel
        FROM public.student_details sd
        WHERE sd.id = @id";

            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
            using (var cmd = new NpgsqlCommand(selectQuery, conn))
            {
                cmd.Parameters.AddWithValue("@id", sid);
                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read()) // Ensure only one row is read
                    {
                        emp = new Employee
                        {
                            Id = reader.GetInt32(0),
                            Name = reader.GetString(1),
                            Address = reader.GetString(2),
                            Tel = reader.GetString(3),
                            sub = getSubjectByStid(sid, configuration)
                        };
                    }
                }
            }

            return emp != null ? Results.Ok(emp) : Results.NotFound("Student not found.");
        }


        public static IResult SaveFieldOfSubject(List<FieldOfSubjectATT> fosubList, IConfiguration configuration)
        {
           
            try
            {
                using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
                {
                    conn.Open();
                    



                    string insertQuery = "INSERT INTO public.field_subjects(f_id, s_id, s_name)VALUES(@f_id, @s_id, @s_name);";

                    foreach (FieldOfSubjectATT item in fosubList)
                    {

                        using (var cmd = new NpgsqlCommand(insertQuery, conn))
                        {
                            // ✅ Corrected parameter names to match SQL query
                            cmd.Parameters.AddWithValue("@f_id", item.FId);
                            cmd.Parameters.AddWithValue("@s_id", item.Sid);
                            cmd.Parameters.AddWithValue("@s_name", item.Sname);

                            cmd.ExecuteNonQuery();   
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                return Results.Problem($"Error saving Field of Subject: {ex.Message}");
            }

            return Results.Ok("Saved");

        }

        public static IResult SaveFieldSubject(FieldOfStudyATT fos, IConfiguration configuration)
        {
            try
            {
                using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
                {
                    conn.Open();

                    string insertQuery = "INSERT INTO public.field_study(id,name)VALUES(@id,@name);";
                    using (var cmd = new NpgsqlCommand(insertQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@id", fos.Id);
                        cmd.Parameters.AddWithValue("@name", fos.Name);


                        cmd.ExecuteNonQuery();
                    }


                    string insertSubject = "INSERT INTO public.field_subjects(f_id, s_id, s_name)VALUES(@f_id, @s_id, @s_name);";

                    foreach (FieldOfSubjectATT item in fos.fosubList)
                    {

                        using (var cmd = new NpgsqlCommand(insertSubject, conn))
                        {
                            cmd.Parameters.AddWithValue("@f_id", item.FId);
                            cmd.Parameters.AddWithValue("@s_id", item.Sid);
                            cmd.Parameters.AddWithValue("@s_name", item.Sname);

                            cmd.ExecuteNonQuery();
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                return Results.Problem($"Error saving Field of Subject: {ex.Message}");
            }

            return Results.Ok("Saved");
        }


        /* public static List<Subject> getSubjectByStid(int stid, IConfiguration configuration) {

             List<Subject> subList = new List<Subject>();

                 var selectQuery = @"select ss.st_id, field,fs2.name as field_name,sub,fs3.s_name  as sub_name 
                                     from public.student_subject ss
                                     inner join public.field_study fs2 on ss.field =fs2.id 
                                     inner join public.field_subjects fs3 on ss.sub =fs3.s_id and ss.field =fs3.f_id 
                                     where ss.st_id=@st_id";
             using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
             {


                 conn.Open();

                 var cmd = new NpgsqlCommand(selectQuery, conn);

                 cmd.Parameters.AddWithValue("@st_id", stid);


                 using (var reader = cmd.ExecuteReader()) // Execute query
                 {

                     while (reader.Read()) // Read data row by row
                     {


                         var sub = new Subject
                         {
                             id = reader.GetInt32(0),
                             field = reader.GetInt32(1),
                             field_name= reader.GetString(2),
                             sub = reader.GetInt32(3),
                             sub_name= reader.GetString(4)

                         };

                         subList.Add(sub);

                     }
                 }
             }



             return subList; 

         }


         public static IResult getStudentInfoByStudentId(int sid, IConfiguration configuration)
         {

             //List<FieldOfSubjectATT> sublist = new List<FieldOfSubjectATT>();

             Employee emp = new Employee();



             using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
             {
                 conn.Open(); // Open connection
                 var selectQuery = "select sd.id,sd.name,address ,tel  from public.student_details sd where sd.id=@id;";

                 var cmd = new NpgsqlCommand(selectQuery, conn);

                 cmd.Parameters.AddWithValue("@id", sid);


                 using (var reader = cmd.ExecuteReader()) // Execute query
                 {


                     while (reader.Read()) // Read data row by row
                     {
                         // Assign values to object
                        // emp.Id = reader.GetInt32(0);

                         emp = new Employee
                         {
                             Id = reader.GetInt32(0),
                             Name = reader.GetString(1),
                             Address = reader.GetString(2),
                             Tel=reader.GetString(3),

                             sub=getSubjectByStid(sid, configuration)

                         };

                     }


                 }
             }
             return Results.Ok(emp);
         }
         */

        public static List<Subject> getSubjectByStid(int stid, IConfiguration configuration)
        {
            var subList = new List<Subject>();

            string selectQuery = @"
                SELECT ss.st_id, ss.field, fs2.name AS field_name, ss.sub, fs3.s_name AS sub_name
                FROM public.student_subject ss
                INNER JOIN public.field_study fs2 ON ss.field = fs2.id
                INNER JOIN public.field_subjects fs3 ON ss.sub = fs3.s_id AND ss.field = fs3.f_id
                WHERE ss.st_id = @st_id";

            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
            using (var cmd = new NpgsqlCommand(selectQuery, conn))
            {
                cmd.Parameters.AddWithValue("@st_id", stid);
                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        subList.Add(new Subject
                        {
                            id = reader.GetInt32(0),
                            field = reader.GetInt32(1),
                            field_name = reader.GetString(2),
                            sub = reader.GetInt32(3),
                            sub_name = reader.GetString(4)
                        });
                    }
                }
            }

            return subList;
        }














        public static async Task<IResult> UpdateStudentdetails(Employee emp, IConfiguration configuration)
        {
            if (emp == null || string.IsNullOrWhiteSpace(emp.Name))
            {
                return Results.BadRequest("Invalid employee data.");
            }

            try
            {
                using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
                {
                    await conn.OpenAsync();

                    using (var transaction = await conn.BeginTransactionAsync())
                    {
                        try
                        {
                            // Update student details
                            string updatestudetails = @"
                        UPDATE public.student_details
                        SET name = @name, address = @address, tel = @tel
                        WHERE id = @id;
                        DELETE FROM public.student_subject WHERE st_id=@id;";

                            using (var cmd = new NpgsqlCommand(updatestudetails, conn, transaction))
                            {
                                cmd.Parameters.AddWithValue("@id", emp.Id);
                                cmd.Parameters.AddWithValue("@name", emp.Name);
                                cmd.Parameters.AddWithValue("@address", emp.Address);
                                cmd.Parameters.AddWithValue("@tel", emp.Tel);

                                await cmd.ExecuteNonQueryAsync();
                            }

                            // Update or Insert student subjects
                            if (emp.sub != null && emp.sub.Any())
                            {
                                foreach (var subject in emp.sub)
                                {
                                    string updateOrInsertSubject = @"
                                INSERT INTO public.student_subject (st_id, field, sub)
                                VALUES (@st_id, @field, @sub);";
                              
                                    // This ensures existing records are updated instead of inserting duplicates

                                    using (var cmd = new NpgsqlCommand(updateOrInsertSubject, conn, transaction))
                                    {
                                        cmd.Parameters.AddWithValue("@st_id", emp.Id);
                                        cmd.Parameters.AddWithValue("@field", subject.field);
                                        cmd.Parameters.AddWithValue("@sub", subject.sub);

                                        await cmd.ExecuteNonQueryAsync();
                                    }
                                }
                            }

                            await transaction.CommitAsync();
                            return Results.Ok("Student details updated successfully.");
                        }
                        catch (Exception ex)
                        {
                            await transaction.RollbackAsync();
                            return Results.Problem($"Transaction failed: {ex.Message}");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Results.Problem($"Error updating student details: {ex.Message}");
            }
        }























































    }
}
