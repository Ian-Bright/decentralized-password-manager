import React, {useState} from 'react'
import { Modal, Button } from 'react-bootstrap'
import {Alert} from "@material-ui/lab";
import {Snackbar} from "@material-ui/core";



function NewPasswordModal(props) {
    const CryptoJS = require('crypto-js')
    const {contract, added} = props
    const [noMatch, setNoMatch] = useState(false)
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [updateFailure, setUpdateFailure] = useState(false)

    /*  Handle submission of new service and password */
    const handleSubmit = async (event) => {
        event.preventDefault()
        if(checkMatch()) {
            setNoMatch(false)
            try {
                let encryptedPassword = CryptoJS.AES.encrypt(event.target.password.value, process.env.REACT_APP_PASSPHRASE).toString()
                await contract.methods[`addService(string,string)`](event.target.service.value, encryptedPassword, {from: window.ethereum.selectedAddress})
                added(prevCount => prevCount + 1)
                setUpdateSuccess(true)
            } catch (e) {
                setUpdateFailure(true)
            } finally {
                props.onHide()
            }
        } else {
            setNoMatch(true)
        }
    }

    /*  Check whether or not passwords match upon submission */
    const checkMatch = () => {
        let password = document.getElementById('password').value
        let confirm = document.getElementById('confirm').value
        if(password === confirm) return true
        else return false
    }

    return(
        <>
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add New Password
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>
                    Specify what service the password is for and then enter the password you wish to assign:
                </h5>
                <form id="newPassword__form" onSubmit={handleSubmit}>
                    <div id="newPassword__input__container">
                        <div><label>Service: </label><input id="service" type="text" name="service" required/></div>
                        <div><label id="newPassword__password">Password: </label><input id="password" type="password" name="password" onChange={checkMatch} required/></div>
                        <div><label id="newPassword__confirm">Confirm: </label><input id="confirm" type="password" name="confirm" onChange={checkMatch} required/></div>
                        {noMatch ? <p id="newPassword__noMatch">*Error: Passwords do not match</p> : null}
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.onHide}>Close</Button>
                <Button form="newPassword__form" type="submit" variant="success">Add</Button>
            </Modal.Footer>
        </Modal>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={updateSuccess} autoHideDuration={6000} onClose={() => setUpdateSuccess(false)}>
                <Alert onClose={() => setUpdateSuccess(false)} severity="success">
                    Service Added!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={updateFailure} autoHideDuration={6000} onClose={() => setUpdateFailure(false)}>
                <Alert onClose={() => setUpdateFailure(false)} severity="error">
                    Service Failed to Add!
                </Alert>
            </Snackbar>
            </>
    )
}

export default NewPasswordModal