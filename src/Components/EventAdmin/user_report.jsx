// import React, { Fragment, useState, useEffect } from 'react';
// import { Container, Row, Input, Col, Button, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
// import axios from 'axios';
// import { Breadcrumbs } from '../../AbstractElements';
// import { BackendAPI } from '../../api';
// import { useNavigate } from 'react-router-dom';
// import { required } from '../Utils/validationUtils';
// import Select from 'react-select';
// import { Field, Form } from 'react-final-form';
// import styled from 'styled-components';
// import useAuth from '../../Auth/protectedAuth';
// import { getToken } from '../../Auth/Auth';

// const RedAsterisk = styled.span`
//   color: red;
// `;

// // Utility function used to combine multiple validation functions into a single validation function
// const composeValidators = (...validators) => value =>
//     validators.reduce((error, validator) => error || validator(value), undefined);

// const ExhibitorReport = () => {
//     useAuth();
//     const [data, setData] = useState([]);
//     const [user, setUser] = useState({});
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(true);
//     const [modal, setModal] = useState(false);
//     const [selectedFields, setSelectedFields] = useState([]);
//     const [reportName, setReportName] = useState(''); // Default to an empty string or a default name

//     useEffect(() => {
//         fetchExhibitor();
//     }, []);

//     const fetchExhibitor = async () => {
//         try {
//             const token = getToken();
//             const response = await axios.get(`${BackendAPI}/Location/getExhibitorData`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             setData(response.data.exhData || []); // Ensure data is an array
//             setUser(response.data.exhData[0] || {});
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching exhibitor data:', error);
//             setLoading(false);
//         }
//     };

//     const handleCancel = () => {
//         setModal(true);
//     };

//     const handleNavigation = () => {
//         navigate(`${process.env.PUBLIC_URL}/event/dashboard/Consoft`);
//     };

//     const keyLabelMapping = {
//         exh_name: 'Exhibitor Name',
//         exh_email: 'Exhibitor Email',
//         exh_website: 'Exhibitor Website',
//         exh_contact: 'Exhibitor Contact',
//         exh_contact_person: 'Exhibitor Contact Person',
//         created_at: 'Created Date',
//         exh_type: 'Exhibitor Type'
//         // Add more mappings here as needed
//     };

//     const exhOptions = Object.keys(user)
//         .filter(key => keyLabelMapping[key])
//         .map(key => ({
//             value: key,
//             label: keyLabelMapping[key] || key // Use the mapped label or default to the key
//         }));

//     // Add the "Select All" option
//     const selectAllOption = {
//         value: 'select_all',
//         label: 'Select All'
//     };

//     const handleSelectChange = (selectedOptions) => {
//         if (selectedOptions.some(option => option.value === 'select_all')) {
//             // Select all options
//             setSelectedFields(exhOptions); // Set all options as selected
//         } else {
//             setSelectedFields(selectedOptions);
//         }
//     };

//     const generateCSV = (fields) => {
//         if (!Array.isArray(data) || data.length === 0) {
//             console.error('Data is not an array or is empty:', data);
//             return;
//         }

//         // Create headers from selected fields and add "Sr. No."
//         const headers = ['Sr. No.', ...fields.map(field => field.label)];
//         console.log('Headers:', headers);

//         // Map data to rows and include serial number
//         const rows = data.map((item, index) => {
//             return [
//                 index + 1, // Sr. No., starts from 1
//                 ...fields.map(field => item[field.value] || '')
//             ];
//         });
//         console.log('Rows:', rows);

//         // Create CSV content
//         let csvContent = 'data:text/csv;charset=utf-8,';
//         csvContent += headers.join(',') + '\n';
//         rows.forEach(row => {
//             csvContent += row.join(',') + '\n';
//         });

//         // Create download link
//         const encodedUri = encodeURI(csvContent);
//         const link = document.createElement('a');
//         link.setAttribute('href', encodedUri);
//         link.setAttribute('download', `${reportName || 'report'}.csv`); // Default name if reportName is empty
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link); // Clean up after download
//     };

//     const handleReportDownload = () => {
//         generateCSV(selectedFields);
//     };

//     return (
//         <Fragment>
//             <Breadcrumbs mainTitle="Exhibitor Report" parent="Event App Admin" title="Exhibitor Report" />
//             <Container fluid={true}>
//                 <Row>
//                     <Col sm="12">
//                         <Card>
//                             <CardBody>
//                                 <Form
//                                     onSubmit={() => {}}
//                                     render={({ handleSubmit, form }) => (
//                                         <form className='needs-validation' noValidate onSubmit={handleSubmit}>
//                                             <Row>
//                                                 <Col md='4' className='mb-3'>
//                                                     <Field
//                                                         name="repName"
//                                                         validate={composeValidators(required)}
//                                                     >
//                                                         {({ input, meta }) => (
//                                                             <div>
//                                                                 <Label className='form-label' for="repname"><strong>Report Name <span className="red-asterisk">*</span></strong></Label>
//                                                                 <Input
//                                                                     {...input}
//                                                                     className="form-control"
//                                                                     id="repname"
//                                                                     type="text"
//                                                                     placeholder="Enter report name"
//                                                                     value={input.value} // Ensure the input value is controlled
//                                                                     onChange={(e) => {
//                                                                         setReportName(e.target.value);
//                                                                         input.onChange(e); // Update form state
//                                                                     }}
//                                                                 />
//                                                                 {meta.error && meta.touched && <p className='d-block text-danger'>{meta.error}</p>}
//                                                             </div>
//                                                         )}
//                                                     </Field>
//                                                 </Col>
//                                             </Row>
//                                             <Row>

//                                                 <Col md="4" className="mb-3">
//                                                     <Label className='form-label' htmlFor="fields"><strong>Select Field <span className="red-asterisk">*</span></strong></Label>
//                                                     <Field name="fields" validate={composeValidators(required)}>
//                                                         {({ input, meta }) => (
//                                                             <Select
//                                                                 input={input}
//                                                                 meta={meta}
//                                                                 options={[selectAllOption, ...exhOptions]}
//                                                                 placeholder="Select Fields"
//                                                                 isMulti={true}
//                                                                 onChange={handleSelectChange}
//                                                                 classNamePrefix="react-select"

//                                                             />
//                                                         )}
//                                                     </Field>
//                                                 </Col>
//                                             </Row>
//                                             <div>
//                                                 <Button color='primary' onClick={handleReportDownload} className="me-2 mt-3">Generate Report</Button>
//                                                 <Button color='warning' onClick={handleCancel} className="mt-3">Cancel</Button>
//                                             </div>
//                                         </form>
//                                     )}
//                                 />
//                             </CardBody>
//                         </Card>
//                     </Col>
//                 </Row>
//             </Container>

//             {/* Modal for Confirmation */}
//             <Modal isOpen={modal} toggle={() => setModal(!modal)} centered>
//                 <ModalHeader toggle={() => setModal(!modal)}>Confirmation</ModalHeader>
//                 <ModalBody>
//                     <div>
//                         <p>
//                             Your changes will be discarded. Are you sure you want to cancel?
//                         </p>
//                     </div>
//                 </ModalBody>
//                 <ModalFooter>
//                     <Button
//                         onClick={handleNavigation} color='warning'>
//                         Yes
//                     </Button>
//                     <Button color="primary" onClick={() => setModal(!modal)}>No</Button>
//                 </ModalFooter>
//             </Modal>
//         </Fragment>
//     );
// };

// export default ExhibitorReport;


import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Container, Row, Input, Col, Button, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Label, PopoverBody, UncontrolledPopover } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Breadcrumbs } from '../../AbstractElements';
import { BackendAPI } from '../../api';
import { useNavigate } from 'react-router-dom';
import { required, option } from '../Utils/validationUtils';
import Select from 'react-select';
import { MdDelete, MdInfoOutline } from "react-icons/md";
import { Field, Form } from 'react-final-form';
import styled from 'styled-components';
import useAuth from '../../Auth/protectedAuth';
import { getToken } from '../../Auth/Auth';
import { PermissionsContext } from '../../contexts/PermissionsContext';
import * as XLSX from 'xlsx';
import moment from 'moment';

const RedAsterisk = styled.span`
  color: red;
`;

// Utility function used to combine multiple validation functions into a single validation function
const composeValidators = (...validators) => value =>
    validators.reduce((error, validator) => error || validator(value), undefined);

const BasicUserReport = () => {
    useAuth();
    const [data, setData] = useState([]);
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [selectedFields, setSelectedFields] = useState([]);
    const [reportName, setReportName] = useState(''); // Default to an empty string or a default name
    const { permissions } = useContext(PermissionsContext);

    console.log(data);

    useEffect(() => {
        fetchUser();
    }, [permissions]);

    // Extract Facultys component
    const BasicUserReportPermissions = permissions['BasicUserReport'];

    const fetchUser = async () => {
        try {
            const token = getToken();
            const response = await axios.get(`${BackendAPI}/eventuser/getBasicUserData`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setData(response.data.userData || []); // Ensure data is an array
            setUser(response.data.userData[0] || {});
            setLoading(false);
        } catch (error) {
            console.error('Error fetching exhibitor data:', error);
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setModal(true);
    };

    const handleNavigation = () => {
        navigate(`${process.env.PUBLIC_URL}/event/dashboard/Consoft`);
    };

    const keyLabelMapping = {
        cs_title: 'Title',
        cs_first_name: 'First Name',
        cs_last_name: 'Last Name',
        cs_reg_category: 'Registration Category',
        cs_phone: 'Contact Number',
        cs_email: 'Email',
        cs_username: 'User Name',
        cs_password: 'Password',
        created_at: 'Created Date'
        // Add more mappings here as needed
    };

    const exhOptions = Object.keys(user)
        .filter(key => keyLabelMapping[key])
        .map(key => ({
            value: key,
            label: keyLabelMapping[key] || key // Use the mapped label or default to the key
        }));

    // Add the "Select All" option
    const selectAllOption = {
        value: 'select_all',
        label: 'Select All'
    };

    const handleSelectChange = (selectedOptions) => {
        if (selectedOptions.some(option => option.value === 'select_all')) {
            // Select all options
            setSelectedFields(exhOptions); // Set all options as selected
        } else {
            setSelectedFields(selectedOptions);
        }
    };

    const handleReportDownload = (form) => {
        form.submit(); // Trigger validation

        // Check if there are errors in the form
        const errors = form.getState().errors;
        if (Object.keys(errors).length === 0 && selectedFields.length > 0) {
            generateXLSX(selectedFields);
            // form.reset(); // Reset the form fields
        }
    };

    const generateXLSX = (fields) => {
        if (!Array.isArray(data) || data.length === 0) {
            console.error('Data is not an array or is empty:', data);
            return;
        }
    
        // Get the admin's timezone
        const AdminTimezone = localStorage.getItem('AdminTimezone');
    
        // Create headers from selected fields and add "Sr. No."
        const headers = ['Sr. No.', ...fields.map(field => field.label)];
        console.log('Headers:', headers);
    
        // Map data to rows and include serial number
        const rows = data.map((item, index) => {
            const rowData = [index + 1]; // Sr. No.
            fields.forEach(field => {
                // Handle date fields using the AdminTimezone
                if (field.label === 'Created Date') {
                    const formattedDate = moment(item.created_at)
                        .tz(AdminTimezone)
                        .format('YYYY-MM-DD HH:mm:ss');
                    rowData.push(formattedDate); // Push the formatted date
                } else {
                    rowData.push(item[field.value] || ''); // Push other field values
                }
            });
            return rowData;
        });
        console.log('Rows:', rows);
    
        // Create a new workbook and worksheet using SheetJS (xlsx)
        const wb = XLSX.utils.book_new(); // Create a new workbook
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]); // Create worksheet from array of arrays (headers + rows)
    
        // Append worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Report'); // Name the sheet "Report"
    
        // Generate the XLSX file and trigger download
        XLSX.writeFile(wb, `${reportName || 'report'}.xlsx`);
    
        // Show success alert
        Swal.fire({
            title: 'Success!',
            text: 'Report generated successfully!',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                navigate(`${process.env.PUBLIC_URL}/event/basic-user-report/Consoft`);
            }
        });
    };
    

    // const generateCSV = (fields) => {
    //     if (!Array.isArray(data) || data.length === 0) {
    //         console.error('Data is not an array or is empty:', data);
    //         return;
    //     }

    //     // Create headers from selected fields and add "Sr. No."
    //     const headers = ['Sr. No.', ...fields.map(field => field.label)];
    //     console.log('Headers:', headers);

    //     // Map data to rows and include serial number
    //     const rows = data.map((item, index) => {
    //         return [
    //             index + 1, // Sr. No., starts from 1
    //             ...fields.map(field => item[field.value] || '')
    //         ];
    //     });
    //     console.log('Rows:', rows);

    //     // Create CSV content
    //     let csvContent = 'data:text/csv;charset=utf-8,';
    //     csvContent += headers.join(',') + '\n';
    //     rows.forEach(row => {
    //         csvContent += row.join(',') + '\n';
    //     });

    //     // Create download link
    //     const encodedUri = encodeURI(csvContent);
    //     const link = document.createElement('a');
    //     link.setAttribute('href', encodedUri);
    //     link.setAttribute('download', `${reportName || 'report'}.csv`); // Default name if reportName is empty
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link); // Clean up after download

    //     // Cleanup URL object
    //     window.URL.revokeObjectURL(encodedUri);

    //     // Show success alert
    //     Swal.fire({
    //         title: 'Success!',
    //         text: 'Report generated successfully!',
    //         icon: 'success',
    //         timer: 3000,
    //         showConfirmButton: false,
    //         allowOutsideClick: false,
    //         allowEscapeKey: false
    //     }).then((result) => {
    //         if (result.dismiss === Swal.DismissReason.timer) {
    //             navigate(`${process.env.PUBLIC_URL}/event/basic-user-report/Consoft`);
    //         }
    //     });
    // };


    return (
        <Fragment>
            <Breadcrumbs mainTitle={
                <>
                    Basic User Report
                    <MdInfoOutline
                        id="categoryPopover"
                        style={{
                            cursor: 'pointer', position: 'absolute', marginLeft: '5px'
                        }}
                    />
                    <UncontrolledPopover
                        placement="bottom"
                        target="categoryPopover"
                        trigger="focus"
                    >
                        <PopoverBody>
                            Customize and download a report of users by selecting the category, event days, date range of registration.
                        </PopoverBody>
                    </UncontrolledPopover>
                </>
            } parent="Event App Admin" title="Basic User Report" />
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody>
                                <Form
                                    onSubmit={() => { }}
                                    render={({ handleSubmit, form }) => (
                                        <form className='needs-validation' noValidate onSubmit={handleSubmit}>
                                            <Row>
                                                <Col md='4' className='mb-3'>
                                                    <Field
                                                        name="repName"
                                                        validate={composeValidators(required)}
                                                    >
                                                        {({ input, meta }) => (
                                                            <div>
                                                                <Label className='form-label' for="repname"><strong>Report Name <span className="red-asterisk">*</span></strong></Label>
                                                                <Input
                                                                    {...input}
                                                                    className="form-control"
                                                                    id="repname"
                                                                    type="text"
                                                                    placeholder="Enter report name"
                                                                    value={input.value} // Ensure the input value is controlled
                                                                    onChange={(e) => {
                                                                        setReportName(e.target.value);
                                                                        input.onChange(e); // Update form state
                                                                    }}
                                                                />
                                                                {meta.error && meta.touched && <p className='d-block text-danger'>{meta.error}</p>}
                                                            </div>
                                                        )}
                                                    </Field>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="4" className="mb-3">
                                                    <Label className='form-label' htmlFor="fields"><strong>Select Field <span className="red-asterisk">*</span></strong></Label>
                                                    <Field name="fields"
                                                        validate={option}>
                                                        {({ input, meta }) => (
                                                            <div>
                                                                <Select
                                                                    {...input}
                                                                    options={[selectAllOption, ...exhOptions]}
                                                                    placeholder="Select Fields"
                                                                    isMulti={true}
                                                                    onChange={(selectedOptions) => {
                                                                        input.onChange(selectedOptions); // Update form state
                                                                        handleSelectChange(selectedOptions);
                                                                    }}
                                                                    classNamePrefix="react-select"
                                                                    value={input.value} // Ensure the Select value is controlled
                                                                />
                                                                {meta.error && meta.touched && <p className='d-block text-danger'>{meta.error}</p>}
                                                            </div>
                                                        )}
                                                    </Field>
                                                </Col>
                                            </Row>
                                            {BasicUserReportPermissions?.validate === 1 && (
                                            <div>
                                                <Button color='primary' onClick={() => handleReportDownload(form)} className="me-2 mt-3">Generate Report</Button>
                                                <Button color='warning' onClick={handleCancel} className="mt-3">Cancel</Button>
                                            </div>
                                            )}
                                        </form>
                                    )}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Modal for Confirmation */}
            <Modal isOpen={modal} toggle={() => setModal(!modal)} centered>
                <ModalHeader toggle={() => setModal(!modal)}>Confirmation</ModalHeader>
                <ModalBody>
                    <div>
                        <p>
                            Your changes will be discarded. Are you sure you want to cancel?
                        </p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={handleNavigation} color='warning'>
                        Yes
                    </Button>
                    <Button color="primary" onClick={() => setModal(!modal)}>No</Button>
                </ModalFooter>
            </Modal>
        </Fragment>
    );
};

export default BasicUserReport;