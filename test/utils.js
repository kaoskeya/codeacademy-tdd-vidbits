const generateRandomUrl = (domain) => {
    return `http://${domain}/${Math.random()}`;
}

module.exports = {
    generateRandomUrl
}