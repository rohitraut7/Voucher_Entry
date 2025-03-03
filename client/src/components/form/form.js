'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Form = () => {
    const [formdata, setFormdata] = useState({
        voucherno: "",
        date: "",
        nepdate: "",
        jvtype: "",
        sn: "",
        glcode: "",
        glhead: "",
        glName: "",
        acno: "",
        acdescription: "",
        debit: "",
        credit: "",
        description: "",
        balance: 0.00,
        totaldebit: 0.00,
        totalcredit: 0.00

    });

    const [voucharlist, setVoucharlist] = useState([]);
    const [vourcharTypeList,setVourcharTypeList] = useState([]);
    const [glList,setGlList]= useState([]);
    const [acclist,setAcclist] = useState([]);

    const getVouchartype = async () => {
        try {
            const response = await axios.get("http://localhost:5182/getVoucherType");
            setVourcharTypeList(response.data);
        } catch (error) {
            console.error("Error fetching voucher type list:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        getVouchartype();
    }, []);


    const getGlheads = async () => {
        try{
            const response = await axios.get("http://localhost:5182/getChartAcc");
            setGlList(response.data);
        } catch {
            console.error("Error fetching GL head type:", error.response?.data || error.message)
        }
    };

    useEffect(() => {
        getGlheads();
    },[]);


    const getAcclist = async () => {
        try{
            const response = await axios.get(`http://localhost:5182/getAccountlist?glid=${formdata?.glhead}`);
            setAcclist(response.data);
        } catch {
            console.error("Error fetching GL head type:", error.response?.data || error.message)
        }
    };

    useEffect(() => {
        if(formdata?.glhead){
            getAcclist()
        };
    },[formdata?.glhead]);

    const handlefind=(e)=>{
        console.log('event',e.key);
        
        if(e.key=="Enter"){
           getvoucher();
        }
    }

    const getvoucher = async () => {
            try{
                const response = await axios.get(`http://localhost:5182/getVoucherNumberById?VoucherNo=${formdata?.voucherno}`);
                
                console.log('rep',response);
                setFormdata((prev) => ({
                    ...prev,
                    'date': response.data?.engDate || "",
                    'nepdate':response.data?.nepDate || "" ,
                    'jvtype':response.data?.voucherType || "",
                    'description':response.data?.description || "", 
                }));

                const mapVlist=response.data?.voucherdetails?.map((item)=>{
                    return{
                        glhead:item?.glId || "",
                        acno:item?.glAccNo || "",
                        debit: item?.drAmount || 0,
                        credit: item?.crAmount || 0,
                        acdescription: item?.description || ""
                    }
                })
   
                 console.log('map list',mapVlist);

                 setVoucharlist(mapVlist);

            } catch(error) {
                console.error("Error fetching GL head type:", error.response?.data || error.message)
            }
        }
    





  
    

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormdata((prev) => ({
            ...prev,
            [name]: value
        }));

        if (name == 'date') {
            setFormdata((prev) => ({
                ...prev,
                'nepdate': value
            }));
        }

        if (name =='glhead'){
            const glname =glList.find((x)=> x.glId==value);
            setFormdata((prev) => ({
                ...prev,
                'glName': glname?.glName
            }));
        }

            
    };

    useEffect(() => {

        // var totalDebit = 0;
        // var totalCredit = 0;

        let totalDebit = voucharlist.reduce((sum, item) => sum + Number(item.debit), 0);
        let totalCredit = voucharlist.reduce((sum, item) => sum + Number(item.credit), 0);

        // voucharlist.forEach(element => {
        
        //     totalDebit = totalDebit + Number(element.debit);
        //     totalCredit += Number(element.credit);
        // });

        setFormdata((prev) => ({
            ...prev,
            totaldebit: totalDebit,
            totalcredit: totalCredit,
            balance: totalDebit - totalCredit
        }));
    }, [voucharlist]);




    const handleAddEntry = () => {
        if (formdata.glhead && formdata.acno) {
            setVoucharlist([...voucharlist, formdata]); 
            
            
            
        } else {
            alert("Please fill all fields before adding.");
        }

        setFormdata((prev)=>({
            ...prev,
            acdescription: "",
            debit: "",
            credit: ""
        }));
    };

    const hanldeAdd=(e)=>{
       console.log('event',e);
       if(e.key=="Enter"){
        handleAddEntry();
       }
       
    }

    const handleSave = async () => {

        try{
            const objVlist=voucharlist.map((item)=> {
                 return{
                glId: item?.glhead,
                glAccNo:item?.acno,
                drAmount:  Number(item?.debit || 0),
                crAmount: Number(item?.credit || 0),
                description: item?.acdescription
                 }
    
            } );
   
            const saveData={
                    voucherNo: formdata?.voucherno,
                    engDate: formdata?.date,
                    nepDate: formdata?.nepdate,
                    voucherType: formdata?.jvtype,
                    description: formdata?.description,
                    voucherdetails: objVlist
                      
            }

            const response = await axios.post("http://localhost:5182/SaveVoucherEntryAsync", saveData);
                alert(response.data);



        } catch (error) {
            console.error("Error saving employee:", error.response?.data || error.message);
          }
          
        };

    // "voucherNo": "string",
    //   "glId": 0,
    //   "glAccNo": "string",
    //   "drAmount": 0,
    //   "crAmount": 0,
    //   "description": "string"


    return (
        <div className="p-6  mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Free Entry Transaction</h2>
            
            <div className='grid grid-cols-3 gap-3'>

                <div className='col-span-3 w-[250px]'>
                    <div className="relative w-full min-w-[200px]">
                        <input
                            className="peer w-full resize-none rounded-[7px] border border-1
                                        border-gray-600  border-t-transparent
                                        bg-transparent px-3 py-2.5 font-sans text-sm
                                        font-normal text-gray-700 outline outline-0 
                                        transition-all placeholder-shown:border 
                                        placeholder-shown:border-gray-600 
                                        placeholder-shown:border-t-gray-600 
                                        focus:border-2 focus:border-gray-900 
                                        focus:border-t-transparent focus:outline-0 
                                        disabled:resize-none disabled:border-0
                                        disabled:bg-blue-gray-50"
                            placeholder=" "
                            name='voucherno'
                            onChange={handleOnChange}
                            onKeyDown={handlefind}
                            value={formdata?.voucherno}
                           
                        />

                            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full 
                            select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none 
                            before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md 
                            before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none 
                            after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md 
                            after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm 
                            peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent 
                            peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 
                            peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 
                            peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent 
                            peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                            >
                            Voucher No
                        </label>
                    </div>
                </div>

                <div className='flex'>
                    <label htmlFor="small-input" className=" mr-5 block mb-2  font-medium text-gray-900 dark:text-white">Date</label>
                    <div>
                        <input type="date" id="small-input" className="block h-[38px] w-full p-2 text-gray-900 border border-gray-300 rounded-lg
                                bg-gray-50  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
                                dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            name='date'
                            onChange={handleOnChange}
                            value={formdata?.date}
                            
                        />

                        <input type="date" id="small-input" className="block h-[38px] w-full p-2 text-gray-900 border border-gray-300 rounded-lg
                                bg-gray-50  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
                                dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder='Nepali Date'
                            name='nepdate'
                            defaultValue={formdata?.nepdate}
                        />
                    </div>
                </div>

                <div className='flex col-span-2'>
                    <label htmlFor="default" className="ml-[100px]  justify-center text-center  w-[300px] block mb-2 font-medium
                                                        text-gray-900 dark:text-white">Voucher Type
                    </label>

                    <select id="default" className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                                            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                                            dark:focus:border-blue-500"
                        name='jvtype'
                        onChange={handleOnChange}
                        value={formdata?.jvtype} >
                        <option  defaultValue="" >Select Voucher Type</option>
                        {vourcharTypeList?.map((item,ind)=>(
                          <option  key={ind} value={item?.id}>{item?.name}</option>
                        ))}
                      

                    </select>
                </div>

            </div>

            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

            <div className="mt-5">
                <table className="w-full border-collapse border border-gray-300">

                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">S.N</th>
                            <th className="border p-2">GL Code</th>
                            <th className="border p-2">GL Head</th>
                            <th className="border p-2">A/C No.</th>
                            <th className="border p-2">Description</th>
                            <th className="border p-2">DR</th>
                            <th className="border p-2">CR</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>

                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">{formdata?.sn}</th>
                            <th className="border p-2">{formdata?.glcode}</th>

                            <th className="border p-2">
                                <select id="default" className="bg-gray-50 border border-gray-300 text-gray-900  text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                                            dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='glhead'
                                    onChange={handleOnChange}
                                    value={formdata?.glhead}
                                >
                                    <option defaultValue="">Select Voucher Type</option>
                                    {glList?.map((item,index)=>(
                                         <option key={index} value={item.glId}>{item.glName}</option>
                                    ))}
                                  
                                </select>
                            </th>

                                    
                            <th className="border p-2">
                                <select id="default" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                                            dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='acno'
                                    onChange={handleOnChange}
                                    value={formdata?.acno}
                                >
                                    <option defaultValue="" >Select Account </option>
                                    {acclist.map((item,index) =>(
                                        <option key={index} value={item.glAccCode}>{item.glAccName + '(' + item.glAccCode + ')' }</option>
                                    ))}

                                </select>
                            </th>
                                    
                            <th className="border p-2">
                                <input className="block  w-full p-2 text-gray-900 border border-gray-300 rounded-lg
                                    bg-gray-50  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    type="text" 
                                    id="small-input"
                                    name='acdescription'
                                    onChange={handleOnChange}
                                    value={formdata?.acdescription}
                                />
                            </th>

                            <th className="border p-2">
                                <input type="text" id="small-input" className="block  w-full p-2 text-gray-900 border border-gray-300 rounded-lg
                                    bg-gray-50  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='debit'
                                    onChange={handleOnChange}
                                    value={formdata?.debit}
                                />
                            </th>

                            <th className="border p-2">
                                <input type="text" id="small-input" className="block  w-full p-2 text-gray-900 border border-gray-300 rounded-lg
                                    bg-gray-50  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='credit'
                                    onChange={handleOnChange}
                                    onKeyDown={hanldeAdd}
                                    value={formdata?.credit}
                                />
                            </th>

                            <th className="border p-2">
                                <button
                                    onClick={handleAddEntry}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                Add
                                </button>
                            </th>

                        </tr>
                    </thead>


                    <tbody>
                        {voucharlist.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{item?.glhead}</td>
                                <td className="border p-2">{item?.glName}</td>
                                <td className="border p-2">{item?.acno}</td>
                                <td className="border p-2">{item?.acdescription}</td>
                                <td className="border p-2">{item?.debit}</td>
                                <td className="border p-2">{item?.credit}</td>
                            </tr>
                        ))}
                    </tbody>



                    <tfoot className='bg-gray-200'>
                        <tr>
                        <td></td>
                        <td></td>
                        <td className='text-right'>Balance :</td>
                        <td className='text-center'>{formdata?.balance}</td>
                        <td className='text-right'>Total :</td>
                        <td className='text-center'>{formdata?.totaldebit}</td>
                        <td className='text-center'>{formdata?.totalcredit}</td>
                        <td></td>
                        </tr>
                    </tfoot>

                </table>
            </div>

            <div className="relative mt-3">
                <textarea className="block w-full h-16 px-4 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none leading-relaxed resize-none"
                    placeholder="Enter a description..."
                    name='description'
                    onChange={handleOnChange}
                    value={formdata?.description}>
                </textarea>
            </div>
                
            {/* Buttons */}
            <div className="mt-4 flex gap-2 justify-end ">
                <button onClick={handleSave} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Save</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700">Cancel</button>
            </div>

        </div>
    );
};

export default Form;

