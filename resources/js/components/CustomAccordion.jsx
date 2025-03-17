'use client'

import * as React from 'react';
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CustomAccordion = ({
    defaultOpen = false,
    expandIcon = <ExpandMoreIcon />,
    title,
    children = <div className="">Isi dari Accordion</div>,
    keyMap = ''
}) => {
    return (
        <Accordion  defaultExpanded={defaultOpen}>
            <AccordionSummary
                expandIcon={expandIcon}
                aria-controls="panel1-content"
            >
                {title}
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}

CustomAccordion.propTypes = {
    defaultOpen: PropTypes.bool,
    expandIcon: PropTypes.node,
    title: PropTypes.string || PropTypes.node,
    children: PropTypes.string || PropTypes.node,
    key: PropTypes.string || PropTypes.number
}

export default CustomAccordion