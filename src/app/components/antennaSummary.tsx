import React from 'react';
import {RoundAntenna, SquareAntenna} from "@/common/antennae.models";
import Grid2 from "@mui/material/Unstable_Grid2";

const AntennaSummary = ({antenna}: {antenna: (RoundAntenna | SquareAntenna | null)}) => {
 return (
  <>
      {antenna !== null ?
          (
              <>
              <Grid2 container>
                <Grid2 xs={4} textAlign={"end"} sx={{fontWeight: 'bold'}}>Type:</Grid2>
                <Grid2 xs={8} textAlign={"center"} sx={{textTransform: "capitalize"}}>{antenna.type}</Grid2>
              </Grid2>
             {antenna.fields.map(field=>(
                  <Grid2 key={field.key} container>
                   <Grid2 xs={4} textAlign={"end"} sx={{fontWeight: 'bold'}}>{field.verbose}:</Grid2>
                   <Grid2 xs={8} textAlign={"center"}>{field.value}</Grid2>
                  </Grid2>
              ))}
               {!antenna.validateInductance() ?
                   <Grid2 container>
                    <Grid2 xs={12} textAlign={"center"} sx={{color: "red"}}>
                     Inductance is out of target range.
                    </Grid2>
                   </Grid2>
               : ""}
              </>
          )
      : ""}
  </>
 );}

export default AntennaSummary;