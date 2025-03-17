'use client'

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CircularProgress, IconButton } from '@mui/material';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function FileUploadComponent({
    fullWidth = false,
    variant = 'text',
    startIcon = <CloudUploadIcon />,
    text = 'Import',
    accept = [], // Dynamically set accepted file types
    multiple = false, // Toggle multiple file selection
    onChange = (event) => console.log(event.target.files), // Handle file change events
    buttonProps = {}, // Additional props for the button
    inputProps = {}, // Additional props for the input
    loading = false,
    size = 'small'
  }) {
    return text !== '' ? (
      <Button
        fullWidth={fullWidth}
        component="label"
        variant={variant}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={15} className='grayscale' /> : startIcon}
        {...buttonProps} // Spread additional button props
      >
        <p className='font-jakarta'>
          {loading ? 'Loading' : text}
        </p>
        <VisuallyHiddenInput
          type="file"
          accept={accept.length < 1 ? '*' : accept.join(',')}
          multiple={multiple}
          onChange={onChange}
          {...inputProps} // Spread additional input props
        />
      </Button>
    ):(
      <IconButton disabled={loading} component="label">
        {loading ? <CircularProgress size={15} className='grayscale' /> : <CloudUploadIcon color='primary' />}
        <VisuallyHiddenInput
          type="file"
          accept={accept.length < 1 ? '*' : accept.join(',')}
          multiple={multiple}
          onChange={onChange}
          {...inputProps} // Spread additional input props
        />
      </IconButton>
    )
  }