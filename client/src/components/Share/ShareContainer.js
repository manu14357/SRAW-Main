// ShareContainer.jsx
import React, { useState } from 'react';
import ShareButton from './ShareButton';
import ShareDialog from './ShareDialog';

const ShareContainer = ({ link }) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleShareClick = () => {
    setShareDialogOpen(true);
  };

  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };

  return (
    <>
      <ShareButton onClick={handleShareClick} iconColor="#000" />
      <ShareDialog
        open={shareDialogOpen}
        onClose={handleShareDialogClose}
        link={link}
      />
    </>
  );
};

export default ShareContainer;
