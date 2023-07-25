'use client';
import { RoundAntenna } from "@/common/Antennae.models";
import RoundForm from "@/app/components/roundForm";
import AntennaSummary from "@/app/components/antennaSummary";
import {Stack, Card, CardContent, CardActions, Button, Divider} from "@mui/material";
import {useState, SyntheticEvent} from "react";
import * as yup from "yup";
import {useFormik} from "formik";

export default function Round() {
    const [antenna, setAntenna] = useState<null | RoundAntenna>(null);

    const handleReset = (e: SyntheticEvent) => {
        formik.handleReset(e);
        setAntenna(null);
    }

    const validationSchema = yup.object({
        averageWidth: yup
            .number()
            .required("Enter the average width in millimeters")
            .positive("Must be positive."),
        diameter: yup
            .number()
            .required("Enter the diameter in millimeters.")
            .positive("Must be positive."),
        numberOfTurns: yup
            .number()
            .required("Enter the number of turns.")
            .positive("Must be positive.")
            .integer()
    });

    const formik = useFormik({
        initialValues: {
            averageWidth: 15,
            diameter: 20,
            numberOfTurns: 6
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setAntenna(
                new RoundAntenna(
                    values.averageWidth,
                    values.diameter,
                    values.numberOfTurns)
            )
        },
    });

    return (
        <Card variant={"outlined"}>
            <form onSubmit={formik.handleSubmit}>
                <CardContent>
                    <Stack spacing={2}>
                        {antenna === null ?
                            <RoundForm formik={formik} />
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
