import { Autocomplete, CircularProgress, InputAdornment, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import api_handler from '../libs/api_handler';

export default function CustomSelectAjax({
    optionLabel = '',
    multiple = false,
    defaultValue = multiple ? [] : null,
    value,
    size = 'small',
    onChange = (event, newValue) => {},
    variant = 'outlined',
    label = 'Cari dan Pilih',
    placeholder = '',
    onModal = '',
    fullWidth = true,
    disableClearable = false,
    isOptionEqualToValue = (option, value) => option === value,
    renderOption,
    noOptionsText = 'Tidak ada opsi',
    ajax = {
        url: '',
        filter: (params) => {}
    },
    getOptionLabel,
    disabled = false
}) {
    const [modalContainer, setModalContainer] = useState(null);
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)

    const handle = {
        fetch: async () => {
            try {
                setError(null)
                if(!ajax.url) {
                    setOptions([])
                    return
                }

                setLoading(true)

                const response = await api_handler.get({
                    url: ajax.url,
                    withCredentials: true
                })

                setLoading(false)

                if(response?.success) {
                    if(ajax.filter) {
                        setOptions(response?.data?.filter(ajax.filter))
                    }else{
                        setOptions(response?.data)
                    }
                }else{
                    setOptions([])
                    setError(response?.message)
                }
            } catch (error) {
                setError(error?.message)
            }
        },
        open: async () => {
            setOpen(true)
        },
        close: () => {
            setOpen(false)
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setModalContainer(document.getElementById(onModal) || document.body);
        }

        handle.fetch()
    }, [onModal]); // Runs when `onModal` changes

    return (
        <Autocomplete
            open={open}
            onOpen={handle.open}
            onClose={handle.close}
            multiple={multiple}
            fullWidth={fullWidth}
            options={options}
            disabled={disabled}
            getOptionLabel={
                getOptionLabel 
                    ? getOptionLabel
                    : (option) => {
                        if (!optionLabel) return typeof option === 'string' ? option : '';
                    
                        try {
                            if (Array.isArray(optionLabel)) {
                                const label = optionLabel.reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : null), option);
                                return label !== null && label !== undefined ? String(label) : ''; // Ensure it's a string
                            }
                            return option?.[optionLabel] !== undefined ? String(option[optionLabel]) : '';
                        } catch (error) {
                            console.error("Error accessing optionLabel:", error, option);
                            return '';
                        }
                    }
            }
            defaultValue={defaultValue}
            size={size}
            value={value}
            filterSelectedOptions
            disableClearable={disableClearable}
            onChange={onChange}
            noOptionsText={noOptionsText}
            isOptionEqualToValue={isOptionEqualToValue}
            slotProps={modalContainer ? { popper: { container: modalContainer } } : undefined}
            renderOption={renderOption}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant={variant}
                    label={label}
                    error={error}
                    placeholder={placeholder}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <InputAdornment position='end'>
                                    {loading ? <CircularProgress color='inherit' size={15} /> : null}
                                    {params.InputProps.endAdornment}
                                </InputAdornment>
                            )
                        }
                    }}
                    helperText={error || null}
                />
            )}
        />
    );
}
