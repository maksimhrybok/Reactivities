import { Star, StarBorder } from "@mui/icons-material";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";

// import React from 'react'
type Props = {
  selected: boolean;
};

export default function StarButton({ selected }: Props) {
  return (
    <Box sx={{ position: "relative" }}>
      <Button
        sx={{
          opacity: 0.8,
          transition: "opacity 0.3s",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <StarBorder
          sx={{
            fontSize: 32,
            color: "white",
            position: "absolute",
          }}
        />
        <Star
          sx={{
            fontSize: 28,
            color: selected ? "yellow" : "rgba(0,0,0,0.5)",
          }}
        />
      </Button>
    </Box>
  );
}
