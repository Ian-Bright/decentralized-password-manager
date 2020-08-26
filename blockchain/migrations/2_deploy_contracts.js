const PasswordManager = artifacts.require('PasswordManager')

module.exports = (deployer) => {
    deployer.deploy(PasswordManager)
}