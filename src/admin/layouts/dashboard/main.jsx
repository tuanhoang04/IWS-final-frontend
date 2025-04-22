import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { layoutClasses } from '../classes';

// ----------------------------------------------------------------------

export function Main({ children, sx, ...other }) {
    return (
        <Box
            component="main"
            className={layoutClasses.main}
            sx={{
                display: 'flex',
                flex: '1 1 auto',
                flexDirection: 'column',
                ...sx,
            }}
            {...other}
        >
            {children}
        </Box>
    );
}

// ----------------------------------------------------------------------

export function DashboardContent({
    sx,
    children,
    disablePadding,
    maxWidth = 'xl',
    ...other
}) {
    const theme = useTheme();

    const layoutQuery = 'lg';

    return (
        <Container
            className={layoutClasses.content}
            maxWidth={maxWidth || false}
            sx={{
                display: 'flex',
                flex: '1 1 auto',
                flexDirection: 'column',
                pt: 'var(--layout-dashboard-content-pt)',
                pb: 'var(--layout-dashboard-content-pb)',
                [theme.breakpoints.up(layoutQuery)]: {
                    px: 'var(--layout-dashboard-content-px)',
                },
                ...(disablePadding && {
                    p: {
                        xs: 0,
                        sm: 0,
                        md: 0,
                        lg: 0,
                        xl: 0,
                    },
                }),
                ...sx,
            }}
            {...other}
        >
            {children}
        </Container>
    );
}