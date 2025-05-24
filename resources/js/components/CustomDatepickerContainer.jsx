'use client'

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/en-gb';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/id'

export default function CustomDatepickerContainer({ children }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'id'}>
            {children}
        </LocalizationProvider>
    )
}