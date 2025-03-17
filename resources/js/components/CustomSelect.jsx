'use client';

import { Autocomplete, TextField } from '@mui/material';
import { useState, useEffect } from 'react';

export default function CustomSelect({
    options = [],
    optionLabel = '',
    multiple = false,
    defaultValue = multiple ? [] : null,
    value,
    size = 'small',
    onChange = () => {},
    variant = 'outlined',
    label = 'Cari dan Pilih',
    placeholder = '',
    onModal = '',
    fullWidth = true,
    disableClearable = false,
    isOptionEqualToValue = (option, value) => option === value,
    renderOption,
    noOptionsText = 'Tidak ada opsi',
    disabled = false
}) {
    const [modalContainer, setModalContainer] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setModalContainer(document.getElementById(onModal) || document.body);
        }
    }, [onModal]); // Runs when `onModal` changes

    return (
        <Autocomplete
            multiple={multiple}
            fullWidth={fullWidth}
            options={options}
            disabled={disabled}
            getOptionLabel={(option) =>
                optionLabel && option[optionLabel] !== undefined
                    ? option[optionLabel]
                    : typeof option === 'string'
                        ? option
                        : option[optionLabel]
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
                    placeholder={placeholder}
                />
            )}
        />
    );
}
