import { ethers } from 'ethers';
import { toast } from 'react-toastify';

export const validateToken = (tokenAddress: string): boolean => {
  try {
    if (ethers.utils.isAddress(tokenAddress)) {
      return true;
    }
    if (tokenAddress !== '') {
      toast.error('Token address invalid');
    }
    return false;
  } catch (error) {
    if (tokenAddress !== '') {
      toast.error('Token address invalid');
    }
    return false;
  }
};
