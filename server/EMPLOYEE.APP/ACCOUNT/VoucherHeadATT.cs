namespace EMPLOYEE.APP.ACCOUNT
{
    public class VoucherHeadATT
    {
        //voucher_no eng_date    nep_date voucher_type    description

        public string? VoucherNo { get; set; }
        public string? EngDate { get; set; }
        public string? NepDate { get; set; }
        public  string? VoucherType { get; set; }
        public string? Description { get; set; }

        public List<VoucherDetailATT> Voucherdetails { get; set; }

    }
}
