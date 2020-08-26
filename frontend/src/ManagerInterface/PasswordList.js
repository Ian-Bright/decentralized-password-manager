import React, {useState} from 'react'
import { Button } from 'react-bootstrap'
import ChangePasswordModal from "./ChangePasswordModal";

function PasswordList({contract, services, serviceAdded, passwords, passwordUpdated}) {
    const CryptoJS = require('crypto-js')
    const [showChangePass, setShowChangePass] = useState(false)
    const [serviceSelected, setServiceSelected] = useState()

    /*  Copy password of service by clicking on button */
    const copyPassword = async (num) => {
        let password = CryptoJS.AES.decrypt(await passwords[num], process.env.REACT_APP_PASSPHRASE).toString(CryptoJS.enc.Utf8)
        let temporaryInput = document.createElement('input')
        temporaryInput.value = password
        document.body.appendChild(temporaryInput)
        temporaryInput.select()
        document.execCommand('copy')
        document.body.removeChild(temporaryInput)
    }

    /* Function to remove a service / password */
    const removePassword = async (service) => {
        await contract.removeService(service, {from: window.ethereum.selectedAddress})
        services.length == 1 ? serviceAdded(false) : serviceAdded(prevCount => prevCount + 1)
    }

    /*  Create a list of available services with respect to user */
    const listServices = services ? services.map((service, i) => {
        return (
            <div className="passwordList__services" key={i}>
                <div><p>{service}</p></div>
                <div><Button variant="warning" onClick={() => {setShowChangePass(true); setServiceSelected(service)}}>Change</Button></div>
                <div><Button variant="primary" onClick={() => copyPassword(i)}>Copy</Button></div>
                <div><Button variant="danger" onClick={() => removePassword(service)}>Remove</Button></div>
            </div>
        )
     }) : null


    return(
        <div id="passwordList">
            {listServices}
            <ChangePasswordModal contract={contract} passwordUpdated={passwordUpdated} service={serviceSelected} show={showChangePass} onHide={() => setShowChangePass(false)}/>
        </div>
    )
}
export default PasswordList