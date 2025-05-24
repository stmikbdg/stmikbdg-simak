import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { RedirectProvider } from './context/RedirectContext';
import { SidebarProvider } from './context/SidebarContext';
import { CssBaseline } from '@mui/material';
import './bootstrap';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { BackdropProvider } from './context/BackdropContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/id'

createInertiaApp({
    resolve: (name) => {
        // const pages = import.meta.glob('./Pages/**/*.jsx');
        const pages = import.meta.glob('../js/**/*.jsx')
        return pages[`./Pages/${name}.jsx`]().then((module) => {
            const Page = module.default;
            return (props) => <Page {...props} />;
        });
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <BrowserRouter>
                <RedirectProvider>
                    <UserProvider>
                        <SidebarProvider>
                            <BackdropProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'id'}>
                                    <CssBaseline />
                                    <App {...props} />
                                </LocalizationProvider>
                            </BackdropProvider>
                        </SidebarProvider>
                    </UserProvider>
                </RedirectProvider>
            </BrowserRouter>
        );
    },
});