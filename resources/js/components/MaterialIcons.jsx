import * as Icons from '@mui/icons-material';

export const MaterialIcons = ({ icon, fontSize = 'medium', ...props }) => {
  const IconComponent = Icons[icon];
  if (!IconComponent) return null; // fallback if icon not found

  return <IconComponent fontSize={fontSize} {...props} />;
};