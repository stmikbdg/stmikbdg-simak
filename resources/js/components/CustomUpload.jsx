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

export default function CustomUpload({
    fullWidth = false,
    variant = 'text',
    startIcon = <CloudUploadIcon />,
    text = 'Import',
    accept = [], // Dynamically set accepted file types
    multiple = false, // Toggle multiple file selection
    buttonProps = {}, // Additional props for the button
    inputProps = {}, // Additional props for the input
    loading = false,
    size = 'small',
    onUploaded = async (files) => console.log(files)
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
        <p className='font-jakarta text-xs font-semibold'>
          {loading ? 'Loading' : text}
        </p>
        <VisuallyHiddenInput
          type="file"
          accept={accept.length < 1 ? '*' : accept.join(',')}
          multiple={multiple}
          onChange={(e) => onUploaded(e.target.files)}
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
          onChange={(e) => onUploaded(e.target.files)}
          {...inputProps} // Spread additional input props
        />
      </IconButton>
    )
  }