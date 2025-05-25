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
  accept = [],
  multiple = false,
  buttonProps = {},
  inputProps = {},
  loading = false,
  size = 'small',
  onUploaded = async (files) => console.log(files)
}) {
  const inputRef = React.useRef(null);

  const handleChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    onUploaded(files);

    // Reset input value so the same file can be uploaded again
    e.target.value = '';
  };

  const InputElement = (
    <VisuallyHiddenInput
      ref={inputRef}
      type="file"
      accept={accept.length < 1 ? '*' : accept.join(',')}
      multiple={multiple}
      onChange={handleChange}
      {...inputProps}
    />
  );

  return text !== '' ? (
    <Button
      fullWidth={fullWidth}
      component="label"
      variant={variant}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={15} className='grayscale' /> : startIcon}
      {...buttonProps}
    >
      <p className='font-jakarta text-xs font-semibold'>
        {loading ? 'Loading' : text}
      </p>
      {InputElement}
    </Button>
  ) : (
    <IconButton disabled={loading} component="label">
      {loading ? <CircularProgress size={15} className='grayscale' /> : <CloudUploadIcon color='primary' />}
      {InputElement}
    </IconButton>
  );
}
