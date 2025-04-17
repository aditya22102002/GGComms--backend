const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8) + Date.now().toString(36).substring(6);
  };
  
  export default generateInviteCode;
  