import React, { Children } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function CustomTabPanel(props) {
  const { children, value, tabValue, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== tabValue}
      id={`custom-tabpanel-${tabValue}`}
      aria-labelledby={`custom-tab-${tabValue}`}
      {...other}
    >
      {value === tabValue && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  tabValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export function CustomControlledTabItem({ children }) {
  return <>{children}</>;
}

CustomControlledTabItem.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.node,
};

export function CustomControlledTabs({ value, onChange, children, centered = false }) {
  const tabs = Children.toArray(children).filter(
    (child) => child.type === CustomControlledTabItem
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderTop: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={onChange}
          aria-label="custom tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.props.value}
              value={tab.props.value}
              label={tab.props.label}
              className="text-xs"
              id={`custom-tab-${tab.props.value}`}
              aria-controls={`custom-tabpanel-${tab.props.value}`}
            />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab) => (
        <CustomTabPanel
          key={tab.props.value}
          value={value}
          tabValue={tab.props.value}
        >
          {tab.props.children}
        </CustomTabPanel>
      ))}
    </Box>
  );
}

CustomControlledTabs.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  centered: PropTypes.bool,
};
