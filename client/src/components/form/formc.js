'use client';

import React, { useEffect, useState } from 'react';
import { TextField, Box } from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const Form = () => {
    const [formdata, setFormdata] = useState({
        voucherno: "",
        date: "",
        nepdate: "",
        jvtype: "",
        sn: "",
        glcode: "",
        glhead: "",
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

    const [vourcharTypeList, setVourcharTypeList] = useState([
        { id: 1, name: 'Journal Voucher' },
        { id: 2, name: 'Payment Voucher' },
        { id: 3, name: 'Receipt Voucher' }

    ]);

    const [glList, setGlList] = useState([
        { id: 1, name: 'GL 1' },
        { id: 2, name: 'GL 2' },
        { id: 3, name: 'GL 3' }

    ]);


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
    };



    console.log('form date', formdata);


    return (
        <div className="p-6  mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Free Entry Transaction</h2>

            <div className='grid grid-cols-3 gap-3'>

                {/* Voucher No */}
                <div className="col-span-3 w-[250px]">
                    <Box
                        component="form"
                        sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="voucherno"
                            label="Voucher No"
                            variant="outlined"
                            name="voucherno"
                            value={formdata.voucherno}
                            onChange={handleOnChange}
                        />
                    </Box>
                </div>



                <div className="flex items-center space-x-6">

                    {/* English Date Picker */}
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-900 mb-1">Date</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="Select Date"
                                value={formdata.date ? dayjs(formdata.date) : null}
                                onChange={(newValue) => handleDateChange('date', newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </div>


                    {/* Nepali Date Picker */}
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-900 mb-1">Nepali Date</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="Select Nepali Date"
                                value={formdata.nepdate ? dayjs(formdata.nepdate) : null}
                                onChange={(newValue) => handleDateChange('nepdate', newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </div>
                </div>



                    <div className='flex col-span-2'>
                        <label htmlFor="default" className="ml-[100px]  justify-center text-center  w-[300px] block mb-2 font-medium
                                                        text-gray-900 dark:text-white">Voucher Type
                        </label>

                        <div>
                        <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                            <Select
                            multiple
                            displayEmpty
                            value={personName}
                            onChange={handleChange}
                            input={<OutlinedInput />}
                            renderValue={(selected) => {
                                if (selected.length === 0) {
                                return <em>Placeholder</em>;
                                }

                                return selected.join(', ');
                            }}
                            MenuProps={MenuProps}
                            inputProps={{ 'aria-label': 'Without label' }}
                            >
                            <MenuItem disabled value="">
                                <em>Placeholder</em>
                            </MenuItem>
                            {names.map((name) => (
                                <MenuItem
                                key={name}
                                value={name}
                                style={getStyles(name, personName, theme)}
                                >
                                {name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        </div>
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
                                        {glList?.map((item, index) => (
                                            <option key={index} value={item.id}>{item.name}</option>
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
                                        <option value="1234567890">1234567890</option>
                                        <option value="9824809045">9824809045</option>
                                        <option value="9801607577">9801607577</option>

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
                                    <td className="border p-2">{item?.sn}</td>
                                    <td className="border p-2">{item?.glcode}</td>
                                    <td className="border p-2">{item?.glhead}</td>
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
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Save</button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700">Cancel</button>
                </div>

            </div>
            );
};

            export default Form;

