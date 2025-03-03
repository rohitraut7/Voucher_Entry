'use client';
import React, { useEffect, useState } from 'react';
import { Box, TableFooter } from '@mui/material';
import { TextField, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Select, FormControl, InputLabel, TextareaAutosize, Grid2 } from '@mui/material';
import Divider from '@mui/material/Divider';


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

    const [accountList, setAccountList] = useState([
        { id: 1234567890, name: '1234567890' },
        { id: 9824809045, name: '9824809045' },
        { id: 9801607577, name: '9801607577' }
    ])


    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormdata((prev) => ({
            ...prev,
            [name]: value
        }));
        if (name === 'date') {
            setFormdata((prev) => ({
                ...prev,
                'nepdate': value
            }));
        }
    };

    useEffect(() => {
        let totalDebit = voucharlist.reduce((sum, item) => sum + Number(item.debit), 0);
        let totalCredit = voucharlist.reduce((sum, item) => sum + Number(item.credit), 0);
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

    return (
        <Box sx={{ padding: 1, maxWidth: 1200, margin: 6 }}>

            <Typography variant="h5" gutterBottom>Free Entry Transaction</Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>

                {/* Voucher Number Input */}
                <Box sx={{ gridColumn: 'span 3', width: '250px', mb: 2 }}>
                    <TextField
                        fullWidth
                        name="voucherno"
                        label="Voucher No"
                        variant="outlined"
                        onChange={handleOnChange}
                        value={formdata?.voucherno}
                        sx={{
                            borderRadius: '7px',
                            '& .MuiOutlinedInput-root': {
                                borderColor: 'gray',
                                '&:hover fieldset': { borderColor: 'black' },
                                '&.Mui-focused fieldset': { borderWidth: '2px', borderColor: 'black' },
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '11px',
                                color: 'gray',
                                '&.Mui-focused': { color: 'black' },
                            },
                        }}
                    />
                </Box>

                {/* Date Inputs */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InputLabel sx={{ mr: 8 }}>Date</InputLabel>
                    <Box>
                        <TextField
                            type="date"
                            name="date"
                            variant="outlined"
                            size="small"
                            onChange={handleOnChange}
                            value={formdata?.date}
                            sx={{ mb: 1, width: '100%', bgcolor: 'background.paper' }}
                        />
                        <TextField
                            type="date"
                            name="nepdate"
                            variant="outlined"
                            size="small"
                            onChange={handleOnChange}
                            value={formdata?.nepdate}
                            placeholder="Nepali Date"
                            sx={{ width: '100%', bgcolor: 'background.paper' }}
                        />
                    </Box>
                </Box>

                {/* Voucher Type Select Dropdown */}
                <Box sx={{ display: 'flex', alignItems: 'center', gridColumn: 'span 2' }}>
                    <InputLabel sx={{ width: '300px', textAlign: 'center', mr: 2 }}>Voucher Type</InputLabel>
                    <FormControl fullWidth variant="outlined" size="small">
                        <Select
                            name="jvtype"
                            value={formdata?.jvtype}
                            onChange={handleOnChange}
                            displayEmpty
                            sx={{ bgcolor: 'background.paper' }}
                        >
                            <MenuItem value="" disabled>Select Voucher Type</MenuItem>
                            {vourcharTypeList?.map((item, ind) => (
                                <MenuItem key={ind} value={item?.id}>{item?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

            </Box>

            <Divider />

            <TableContainer component={Box} sx={{ marginTop: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                        <TableRow >
                            <TableCell>S.N</TableCell>
                            <TableCell>GL Code</TableCell>
                            <TableCell>GL Head</TableCell>
                            <TableCell>A/C No.</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>DR</TableCell>
                            <TableCell>CR</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>


                    <TableHead sx={{  fontWeight: 'bold' }}>    
                        <TableRow>
                            <TableCell>{formdata?.sn}</TableCell>
                            <TableCell>{formdata?.glcode}</TableCell>

                            <TableCell>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <Select
                                        name="glhead"
                                        value={formdata?.glhead}
                                        onChange={handleOnChange}
                                        displayEmpty
                                        sx={{ bgcolor: 'background.paper' }}
                                    >
                                        <MenuItem value="" disabled> Select GL Head</MenuItem>
                                        {glList?.map((item, ind) => (
                                            <MenuItem key={ind} value={item?.id}>{item?.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </TableCell>


                            <TableCell>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <Select
                                        name="acno"
                                        value={formdata?.acno}
                                        onChange={handleOnChange}
                                        displayEmpty
                                        sx={{ bgcolor: 'background.paper' }}
                                    >
                                        <MenuItem value="" disabled> Select Account</MenuItem>
                                        {accountList?.map((item, ind) => (
                                            <MenuItem key={ind} value={item?.id}>{item?.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </TableCell>

                            <TableCell>
                                <Box
                                    component="form"
                                    sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <div>
                                        <TextField
                                             type="text" 
                                             id="small-input"
                                             name='acdescription'
                                             onChange={handleOnChange}
                                             value={formdata?.acdescription}
                                        />
                                    </div>
                                </Box>
                            </TableCell>

                            <TableCell>
                                <Box
                                    component="form"
                                    sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <div>
                                        <TextField
                                            name='debit'
                                            onChange={handleOnChange}
                                            value={formdata?.debit}
                                        />
                                    </div>
                                </Box>
                            </TableCell>

                            <TableCell>
                                <Box
                                    component="form"
                                    sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <div>
                                        <TextField
                                            name='credit'
                                            onChange={handleOnChange}
                                            value={formdata?.credit}
                                        />
                                    </div>
                                </Box>
                            </TableCell>

                            <TableCell>
                                <Box sx={{ '& button': { m: 1 } }}>
                                    <div>
                                        <Button variant="contained" size="small"  onClick={handleAddEntry}>
                                            Add
                                        </Button>
                                    </div>
                                </Box>
                            </TableCell>

                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {voucharlist.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.sn}</TableCell>
                                <TableCell>{item.glcode}</TableCell>
                                <TableCell>{item.glhead}</TableCell>
                                <TableCell>{item.acno}</TableCell>
                                <TableCell>{item.acdescription}</TableCell>
                                <TableCell>{item.debit}</TableCell>
                                <TableCell>{item.credit}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TableCell />
                            <TableCell />
                            <TableCell align="right">Balance:</TableCell>
                            <TableCell align="center">{formdata?.balance}</TableCell>
                            <TableCell align="right">Total:</TableCell>
                            <TableCell align="center">{formdata?.totaldebit}</TableCell>
                            <TableCell align="center">{formdata?.totalcredit}</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableFooter>


                </Table>
            </TableContainer>
                    
            <TextareaAutosize
                minRows={2}
                placeholder="Enter a description..."
                name="description"
                value={formdata.description}
                onChange={handleOnChange}
                style={{ width: '100%', marginTop: 16, padding: 8 }}
            />

            <Grid2 container spacing={2} sx={{ marginTop: 2, justifyContent: 'flex-end' }}>
                <Grid2 item>
                    <Button variant="contained" color="primary">Save</Button>
                </Grid2>
                <Grid2 item>
                    <Button variant="contained" color="success">Submit</Button>
                </Grid2>
                <Grid2 item>
                    <Button variant="contained" color="warning">Cancel</Button>
                </Grid2>
            </Grid2>
        </Box>

    );
};

export default Form;


