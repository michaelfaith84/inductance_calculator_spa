import React from 'react';
import {TextField} from "@mui/material";
import {FormikProps} from "formik";

const SquareForm = ({formik}: {formik: FormikProps<{
        height: number;
        width: number;
        trackThickness: number;
        trackWidth: number;
        trackSpacing: number;
        numberOfTurns: number;
    }>}) => {
 return (
     <>
         <TextField
             id="width"
             name="width"
             label="Width (mm)"
             variant="outlined"
             value={formik.values.width}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             error={formik.touched.width && Boolean(formik.errors.width)}
             helperText={formik.touched.width && formik.errors.width}
         />
         <TextField
             id="height"
             name="height"
             label="Height (mm)"
             value={formik.values.height}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             error={formik.touched.height && Boolean(formik.errors.height)}
             helperText={formik.touched.height && formik.errors.height}
             variant="outlined" />
         <TextField
             id="trackThickness"
             name="trackThickness"
             label="Track Thickness (0.03556mm = 1oz/ft^2)"
             value={formik.values.trackThickness}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             error={formik.touched.trackThickness && Boolean(formik.errors.trackThickness)}
             helperText={formik.touched.trackThickness && formik.errors.trackThickness}
             variant="outlined" />
         <TextField
             id="trackWidth"
             name="trackWidth"
             label="Track Width (0.254mm = 10mils)"
             value={formik.values.trackWidth}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             error={formik.touched.trackWidth && Boolean(formik.errors.trackWidth)}
             helperText={formik.touched.trackWidth && formik.errors.trackWidth}
             variant="outlined" />
         <TextField
             id="trackSpacing"
             name="trackSpacing"
             label="Track Spacing (0.254mm = 10mils)"
             value={formik.values.trackSpacing}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             error={formik.touched.trackSpacing && Boolean(formik.errors.trackSpacing)}
             helperText={formik.touched.trackSpacing && formik.errors.trackSpacing}
             variant="outlined"
         />
         <TextField
             id="numberOfTurns"
             name="numberOfTurns"
             label="Number of Turns (1-6 is ideal)"
             value={formik.values.numberOfTurns}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             error={formik.touched.numberOfTurns && Boolean(formik.errors.numberOfTurns)}
             helperText={formik.touched.numberOfTurns && formik.errors.numberOfTurns}
             variant="outlined" />
     </>
 );}

export default SquareForm;