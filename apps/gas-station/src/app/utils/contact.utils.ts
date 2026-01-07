export const handlePhoneCall = (phone: string) => {
  window.location.href = `tel:${phone}`;
};

export const handleNavigation = (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  window.open(`https://map.naver.com/v5/search/${encodedAddress}`, '_blank');
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('복사 실패:', err);
    return false;
  }
};
