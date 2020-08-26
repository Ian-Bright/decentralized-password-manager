import React, {useState} from 'react'
import {Button, Modal} from "react-bootstrap"
import { Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"

function ChangePasswordModal(props) {
    const CryptoJS = require('crypto-js')
    const {contract, service, passwordUpdated} = props
    const [noMatch, setNoMatch] = useState(false)
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [updateFailure, setUpdateFailure] = useState(false)

    /*  Change to a new password on click */
    const handleSubmit = async (event) => {
        event.preventDefault()
        if(checkMatch()) {
            setNoMatch(false)
            try {
                let encryptedPassword = CryptoJS.AES.encrypt(event.target.password.value, process.env.REACT_APP_PASSPHRASE).toString()
                await contract.methods['changePassword(string,string)'](service, encryptedPassword, {from: window.ethereum.selectedAddress})
                setUpdateSuccess(true)
                passwordUpdated(prevCount => prevCount + 1)
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
                    Change Password
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>
                    Specify what your new password is and enter it a second time to confirm:
                </h5>
                <form id="changePassword__form" onSubmit={handleSubmit}>
                    <div id="changePassword__input__container">
                        <div><label id="changePassword__password">New Password: </label><input id="password" type="password" name="password" onChange={checkMatch} required/></div>
                        <div><label id="changePassword__confirm">Confirm: </label><input id="confirm" type="password" name="confirm" onChange={checkMatch} required/></div>
                        {noMatch ? <p id="changePassword__noMatch">*Error: Passwords do not match</p> : null}
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.onHide}>Close</Button>
                <Button form="changePassword__form" type="submit" variant="success">Add</Button>
            </Modal.Footer>
        </Modal>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={updateSuccess} autoHideDuration={6000} onClose={() => setUpdateSuccess(false)}>
                <Alert onClose={() => setUpdateSuccess(false)} severity="success">
                    Password Change Successful!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={updateFailure} autoHideDuration={6000} onClose={() => setUpdateFailure(false)}>
                <Alert onClose={() => setUpdateFailure(false)} severity="error">
                    Password Change Failed!
                </Alert>
            </Snackbar>
            </>
    )
}

export default ChangePasswordModal