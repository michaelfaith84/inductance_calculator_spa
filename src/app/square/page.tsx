'use client';
import {SquareAntenna} from "@/common/Antennae.models";
import {Button, Card, CardActions, CardContent, Divider, Stack} from "@mui/material";
import AntennaSummary from "@/app/components/antennaSummary";
import {SyntheticEvent, useState} from "react";
import * as yup from "yup";
import {useFormik} from "formik";
import SquareForm from "@/app/components/squareForm";

export default function Square() {
    const [antenna, setAntenna] = useState<null | SquareAntenna>(null)

    const handleReset = (e: SyntheticEvent) => {
        formik.handleReset(e);
        setAntenna(null);
    }

    const validationSchema = yup.object({
        width: yup
            .number()
            .required("Enter the width in millimeters")
            .positive("Must be positive."),
        height: yup
            .number()
            .required("Enter the height in millimeters.")
            .positive("Must be positive."),
        trackThickness: yup
            .number()
            .required("Enter the track thickness.")
            .positive()
            .lessThan(1),
        trackWidth: yup
            .number()
            .required("Enter the track width.")
            .positive()
            .lessThan(1),
        trackSpacing: yup
            .number()
            .required("Enter the track spacing.")
            .positive()
            .lessThan(1),
        numberOfTurns: yup
            .number()
            .required("Enter the number of turns.")
            .positive("Must be positive.")
            .integer()
    });

    const formik = useFormik({
        initialValues: {
            width: 15,
            height: 20,
            trackThickness: .00006,
            trackWidth: .0003,
            trackSpacing: .0005,
            numberOfTurns: 6
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setAntenna(
                new SquareAntenna(
                    values.width,
                    values.height,
                    values.trackThickness,
                    values.trackWidth,
                    values.trackSpacing,
                    values.numberOfTurns)
            )
        },
    });

    return (
        <Card variant={"outlined"}>
            <form onSubmit={formik.handleSubmit}>
                <CardContent>
                    <Stack spacing={1.5}>
                        {antenna === null ?
                            <SquareForm formik={formik} />
                            : <AntennaSummary antenna={antenna} />}
                    </Stack>
                </CardContent>
                <Divider />
                <CardActions>
                    {antenna === null ?
                        <Button variant={"outlined"} type={"submit"} fullWidth>Calculate</Button>
                        : ""}
                    {antenna !== null ?
                        <Button variant={"outlined"} onClick={handleReset} fullWidth>Reset</Button>
                        : ""}
                </CardActions>
            </form>
        </Card>
    )
}
