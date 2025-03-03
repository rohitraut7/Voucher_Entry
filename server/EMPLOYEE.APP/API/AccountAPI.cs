using EMPLOYEE.APP.ACCOUNT;
using EMPLOYEE.APP.ATTRIBUTES;
using Npgsql;
using System.Collections.Generic;

namespace EMPLOYEE.APP.API
{
    public static class AccountAPI

    {
        public static void RegisterAccountAPI(this WebApplication app)
        {
            app.MapGet("/getVoucherType", getVoucherType);
            app.MapGet("/getChartAcc", getChartAcc);
            app.MapGet("/getAccountlist", getAccountlist);
            app.MapPost("/SaveVoucherEntry", SaveVoucherEntry);
            app.MapPost("/SaveVoucherEntryAsync", SaveVoucherEntryAsync);
            app.MapGet("/getVoucherdetailslistById", getVoucherdetailslistById);
            app.MapGet("/getVoucherNumberById", getVoucherNumberById);
            


        }

        public static IResult getVoucherType(IConfiguration configuration)
        {

            List<VoucherTypeATT> voucherlist = new List<VoucherTypeATT>();

            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
            {
                conn.Open();
                var selectQuery = "select tvt.id ,tvt.name from public.tbl_voucher_type tvt ;";

                using (var cmd = new NpgsqlCommand(selectQuery, conn))


                using (var reader = cmd.ExecuteReader())
                {

                    while (reader.Read()) 
                    {
                        // Assign values to object
                        var vouchertype = new VoucherTypeATT
                        {
                            Id = reader.GetString(0),
                            Name = reader.GetString(1),

                        };
                        voucherlist.Add(vouchertype);

                    }
                }
            }
            return Results.Ok(voucherlist);
        }


        public static IResult getChartAcc(IConfiguration configuration)
        {

            List<ChartAccATT> chartacclist = new List<ChartAccATT>();

            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
            {
                conn.Open();
                var selectQuery = "select tca.gl_id, tca.gl_code, tca.gl_name  from public.tbl_chart_account tca;";
                using (var cmd = new NpgsqlCommand(selectQuery, conn))


                using (var reader = cmd.ExecuteReader())
                {

                    while (reader.Read())
                    {
                   
                        var chartacc = new ChartAccATT
                        {
                            GlId = reader.GetInt32(0),
                            GlCode=reader.GetString(1),
                            GlName = reader.GetString(2),
                         

                        };
                        chartacclist.Add(chartacc);

                    }
                }
            }
            return Results.Ok(chartacclist);
        }


        public static IResult getAccountlist (int glid, IConfiguration configuration)
        {

            List<AccountATT> acclist = new List<AccountATT>();

            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
            {
                conn.Open();
                var selectQuery = "select ta.gl_id, ta.gl_acc_no, ta.gl_acc_name  from tbl_accounts ta where ta.gl_id =@gl_id;";
                var cmd = new NpgsqlCommand(selectQuery, conn);
                cmd.Parameters.AddWithValue("@gl_id", glid);



                using (var reader = cmd.ExecuteReader())
                {

                    while (reader.Read())
                    {

                        var acc = new AccountATT
                        {
                            GlId=reader.GetInt32(0),
                            GlAccCode = reader.GetString(1),
                            GlAccName = reader.GetString(2)

                        };
                        acclist.Add(acc);
                    }
                }
            }
            return Results.Ok(acclist);
        }


        public static IResult SaveVoucherEntry(VoucherHeadATT voucherinfo, IConfiguration configuration)
        {
            try
            {
                using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
                {
                    conn.Open();

                    string insertQuery = @"INSERT INTO public.tbl_voucher_head
                                            (voucher_no, eng_date, nep_date, voucher_type, description)
                                            VALUES(@voucher_no, @eng_date, @nep_date, @voucher_type, @description );";
                    using (var cmd = new NpgsqlCommand(insertQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@voucher_no", voucherinfo.VoucherNo);
                        cmd.Parameters.AddWithValue("@eng_date", voucherinfo.EngDate);
                        cmd.Parameters.AddWithValue("@nep_date", voucherinfo.NepDate);
                        cmd.Parameters.AddWithValue("@voucher_type", voucherinfo.VoucherType);
                        cmd.Parameters.AddWithValue("@description", voucherinfo.Description);

                        cmd.ExecuteNonQuery();
                    }



                    string insertSubject = @"insert into public.tbl_voucher_detail 
                                            (voucher_no, gl_id,	gl_acc_no, dr_amount, cr_amount, description)
                                            values(@voucher_no,	@gl_id,	@gl_acc_no,	@dr_amount,	@cr_amount,	@description);";

                    foreach (var voucher in voucherinfo.Voucherdetails)
                    {

                        using (var cmd = new NpgsqlCommand(insertSubject, conn))
                        {
                            cmd.Parameters.AddWithValue("@voucher_no", voucher.VoucherNo);
                            cmd.Parameters.AddWithValue("@gl_id", voucher.GlId);
                            cmd.Parameters.AddWithValue("@gl_acc_no", voucher.GlAccNo);
                            cmd.Parameters.AddWithValue("@dr_amount", voucher.DrAmount);
                            cmd.Parameters.AddWithValue("@cr_amount", voucher.CrAmount);
                            cmd.Parameters.AddWithValue("@description", voucher.Description);

                            cmd.ExecuteNonQuery();
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                return Results.Problem($"Error saving Voucher Entry {ex.Message}");
            }

            return Results.Ok("Saved");
        }


        public static int getVoucherNo(IConfiguration configuration)
        {

            int vno = 0;

            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
            {
                conn.Open();
                var selectQuery = "select  COALESCE(max(SPLIT_PART(tvh.voucher_no,'-',2)::integer),0) +1 as vourchr_no from public.tbl_voucher_head tvh;";
                using (var cmd = new NpgsqlCommand(selectQuery, conn))


                using (var reader = cmd.ExecuteReader())
                {

                    while (reader.Read())
                    {
                        vno = reader.GetInt32(0);

                    }
                }
            }
            return vno;
        }



        public static async Task<IResult> SaveVoucherEntryAsync(VoucherHeadATT voucherinfo, IConfiguration configuration)
        {
        

            try
            {
                using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
                {
                    await conn.OpenAsync();

                    using (var transaction = await conn.BeginTransactionAsync())
                    {
                        try
                        {
                            int vno = getVoucherNo(configuration);

                            string vouchehrNo = voucherinfo.VoucherType+ "-" + vno;

                            string insertQuery = @"INSERT INTO public.tbl_voucher_head
                                            (voucher_no,eng_date, nep_date, voucher_type, description)
                                            VALUES(@voucher_no,@eng_date, @nep_date, @voucher_type, @description );";
                            using (var cmd = new NpgsqlCommand(insertQuery, conn))
                            {
                                cmd.Parameters.AddWithValue("@voucher_no", vouchehrNo);
                                cmd.Parameters.AddWithValue("@eng_date", voucherinfo.EngDate);
                                cmd.Parameters.AddWithValue("@nep_date", voucherinfo.NepDate);
                                cmd.Parameters.AddWithValue("@voucher_type", voucherinfo.VoucherType);
                                cmd.Parameters.AddWithValue("@description", voucherinfo.Description);

                                await cmd.ExecuteNonQueryAsync();
                            }



                            string insertSubject = @"insert into public.tbl_voucher_detail 
                                            (voucher_no, gl_id,	gl_acc_no, dr_amount, cr_amount, description)
                                            values(@voucher_no,	@gl_id,	@gl_acc_no,	@dr_amount,	@cr_amount,	@description);";

                            foreach (var voucher in voucherinfo.Voucherdetails)
                            {

                              

                                using (var cmd = new NpgsqlCommand(insertSubject, conn))
                                {
                                    cmd.Parameters.AddWithValue("@voucher_no", vouchehrNo);
                                    cmd.Parameters.AddWithValue("@gl_id", voucher.GlId);
                                    cmd.Parameters.AddWithValue("@gl_acc_no", voucher.GlAccNo);
                                    cmd.Parameters.AddWithValue("@dr_amount", voucher.DrAmount);
                                    cmd.Parameters.AddWithValue("@cr_amount", voucher.CrAmount);
                                    cmd.Parameters.AddWithValue("@description", voucher.Description);

                                   await  cmd.ExecuteNonQueryAsync();
                                }
                            }

                            await transaction.CommitAsync();
                            return Results.Ok($"Saved successfully and Vourchar number ={vouchehrNo}");
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


        public static IResult getVoucherNumberById(string VoucherNo, IConfiguration configuration)
        {
            VoucherHeadATT voucherdetaillist = new VoucherHeadATT();

            string selectQuery = @"
               SELECT tvh.voucher_no, tvh.eng_date, tvh.nep_date, tvh.voucher_type, tvh.description
                FROM public.tbl_voucher_head tvh 
                WHERE tvh.voucher_no = @voucher_no;";

            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))

            using (var cmd = new NpgsqlCommand(selectQuery, conn))
            {
                cmd.Parameters.AddWithValue("@voucher_no", VoucherNo);
                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {

                    while (reader.Read())
                    {

                         voucherdetaillist = new VoucherHeadATT
                        {
                            VoucherNo = reader.GetString(0),
                            EngDate = reader.GetString(1),
                            NepDate = reader.GetString(2),
                            VoucherType = reader.GetString(3),
                            Description = reader.GetString(4),
                            Voucherdetails = getVoucherdetail(VoucherNo, configuration)
                        };
                       
                    }
                }
            }
            return Results.Ok(voucherdetaillist);

        }
        public static List<VoucherDetailATT> getVoucherdetail(string VoucherNo, IConfiguration configuration)
        {
            var voucherdetail = new List<VoucherDetailATT>();

            string selectQuery = @"
                SELECT tvd.voucher_no, tvd.gl_id, tvd.gl_acc_no, tvd.dr_amount, tvd.cr_amount, tvd.description
                    FROM public.tbl_voucher_detail tvd
                    WHERE tvd.voucher_no = @voucher_no;";

            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))

            using (var cmd = new NpgsqlCommand(selectQuery, conn))
            {
                cmd.Parameters.AddWithValue("@voucher_no", VoucherNo);
                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        voucherdetail.Add(new VoucherDetailATT
                        {
                            VoucherNo = reader.GetString(0),
                            GlId = reader.GetInt32(1),
                            GlAccNo = reader.GetString(2),
                            DrAmount = reader.GetDecimal(3),
                            CrAmount = reader.GetDecimal(4),
                            Description = reader.GetString(5),

                        });
                    }
                }
            }
            return voucherdetail;
        }


        public static IResult getVoucherdetailslistById(string VoucherNo, IConfiguration configuration)
        {
            List<VoucherHeadATT> voucherdetaillist = new List<VoucherHeadATT>();

            string selectQuery = @"
        SELECT tvh.voucher_no, tvh.eng_date, tvh.nep_date, tvh.voucher_type, tvh.description
        FROM public.tbl_voucher_head tvh 
        WHERE tvh.voucher_no = @voucher_no;";

            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
            using (var cmd = new NpgsqlCommand(selectQuery, conn))
            {
                cmd.Parameters.AddWithValue("@voucher_no", VoucherNo);
                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var vouhead = new VoucherHeadATT
                        {
                            VoucherNo = reader.IsDBNull(0) ? "" : reader.GetString(0),
                            EngDate = reader.IsDBNull(1) ? "" : reader.GetString(1),
                            NepDate = reader.IsDBNull(2) ? "" : reader.GetString(2),
                            VoucherType = reader.IsDBNull(3) ? "" : reader.GetString(3),
                            Description = reader.IsDBNull(4) ? "" : reader.GetString(4),
                            Voucherdetails = getVoucherdetails(VoucherNo, configuration)
                        };
                        voucherdetaillist.Add(vouhead);
                    }
                }
            }
            return voucherdetaillist.Count > 0 ? Results.Ok(voucherdetaillist) : Results.NotFound("Voucher not found.");
        }

        public static List<VoucherDetailATT> getVoucherdetails(string VoucherNo, IConfiguration configuration)
        {
            var voucherdetail = new List<VoucherDetailATT>();

            string selectQuery = @"
        SELECT tvd.voucher_no, tvd.gl_id, tvd.gl_acc_no, tvd.dr_amount, tvd.cr_amount, tvd.description
        FROM public.tbl_voucher_detail tvd
        WHERE tvd.voucher_no = @voucher_no;";

            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("DbConnString")))
            using (var cmd = new NpgsqlCommand(selectQuery, conn))
            {
                cmd.Parameters.AddWithValue("@voucher_no", VoucherNo);
                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        voucherdetail.Add(new VoucherDetailATT
                        {
                            VoucherNo = reader.IsDBNull(0) ? "" : reader.GetString(0),
                            GlId = reader.IsDBNull(1) ? 0 : reader.GetInt32(1),
                            GlAccNo = reader.IsDBNull(2) ? "" : reader.GetString(2),
                            DrAmount = reader.IsDBNull(3) ? 0.0M : reader.GetDecimal(3),
                            CrAmount = reader.IsDBNull(4) ? 0.0M : reader.GetDecimal(4),
                            Description = reader.IsDBNull(5) ? "" : reader.GetString(5),
                        });
                    }
                }
            }
            return voucherdetail;
        }























    }
}
