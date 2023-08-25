import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';

export default function Navigation() {
    return (
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
            <Fab variant="extended" size="medium" color="primary" aria-label="add" sx={{ color: 'black' }}>
                <NavigationIcon sx={{ mr: 1 }} />
                WorkFlow Breakdown
            </Fab>
        </Box>
    );
}
