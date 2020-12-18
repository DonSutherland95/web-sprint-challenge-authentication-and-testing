module.exports = {
  isValid,
};

function isValid(user) {
  return Boolean(user.username && user.password);
  // if(!user.username || !user.password){
    
  // }
}
