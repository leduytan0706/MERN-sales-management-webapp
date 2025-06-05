const generatePassword = (length = 16) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    const passwordArray = Array.from(crypto.getRandomValues(new Uint32Array(length)));
    return passwordArray.map(x => charset[x % charset.length]).join('');
}

export default generatePassword;