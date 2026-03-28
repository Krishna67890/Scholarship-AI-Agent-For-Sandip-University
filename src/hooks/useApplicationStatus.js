import { useState, useEffect } from 'react';

export const useApplicationStatus = (initialStatus = 'Not Started') => {
  const [status, setStatus] = useState(initialStatus);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    switch (status) {
      case 'Not Started': setProgress(0); break;
      case 'In Progress': setProgress(25); break;
      case 'Under Review': setProgress(50); break;
      case 'Eligible': setProgress(75); break;
      case 'Approved': setProgress(100); break;
      case 'Rejected': setProgress(100); break;
      default: setProgress(0);
    }
  }, [status]);

  const updateStatus = (newStatus) => {
    setStatus(newStatus);
  };

  return { status, progress, updateStatus };
};
