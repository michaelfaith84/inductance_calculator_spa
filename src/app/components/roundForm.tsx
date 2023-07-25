import React from 'react';
import {TextField} from "@mui/material";
import {FormikProps} from "formik";

const RoundForm = ({formik}: {formik: FormikProps<{
    averageWidth: number;
    diameter: number;
    numberOfTurns: number;
}>}) => {
 return (
     <>
         <TextField
             id="averageWidth"
             name="averageWidth"
             label="Average Width (mm)"
             variant="outlined"
             value={formik.values.averageWidth}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             error={formik.touched.averageWidth && Boolean(formik.errors.averageWidth)}
             helperText={formik.touched.averageWidth && formik.errors.averageWidth}
         />
         <TextField
             id="diameter"
             name="diameter"
             label="Diameter (mm)"
             value={formik.values.diameter}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             error={formik.touched.diameter && Boolean(formik.errors.diameter)}
             helperText={formik.touched.diameter && formik.errors.diameter}
             variant="outlined" />
         <TextField
             id="numberOfTurns"
             name="numberOfTurns"
             label="Number of Turns"
             value={formik.values.numberOfTurns}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             error={formik.touched.numberOfTurns && Boolean(formik.errors.numberOfTurns)}
             helperText={formik.touched.numberOfTurns && formik.errors.numberOfTurns}
             variant="outlined" />
     </>
 );}

export default RoundForm;