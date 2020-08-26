import React, {useEffect, useState} from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import '../App.css'
import NewPasswordModal from './NewPasswordModal'
import PasswordList from "./PasswordList";

function PasswordManager() {
    const [showNewPasswordModal, setShowNewPasswordModal] = useState(false)
    const [contract, setContract] = useState()
    const [passwords, setPasswords] =useState()
    const [services, setServices] = useState()
    const [serviceAdded, setServiceAdded] = useState(0)
    const [passwordUpdated, setPasswordUpdated] = useState(0)

    window.ethereum.on('accountsChanged', (accounts) => {
        window.location.reload()
    })

    /* Load contract abi and set provider and network */
    const loadContract = async () => {
        let TruffleContract = require("@truffle/contract")
        let abi = require('../contracts/PasswordManager.json')
        let contract = TruffleContract(abi)
        contract.setProvider(window.ethereum)
        let instance = await contract.at(abi.networks[window.ethereum.networkVersion].address)
        setContract(instance)
    }

    /* Load services that a user is subscribed to */
    const loadServices = async () => {
            let services = await contract.returnServices({from: window.ethereum.selectedAddress})
            setServices(services.sort())
    }

    /* Load passwords associated with subscribed service */
    const loadPasswords = () => {
        let passes = services.map(async (service) => {
            return await contract.retrievePassword(service, {from: window.ethereum.selectedAddress})
        })
        setPasswords(passes)
    }

    useEffect(() => {
        loadContract()
    }, [])

    useEffect(() => {
        if(!contract) return
        loadServices()
    }, [contract, serviceAdded])

    useEffect(() => {
        if(!services) return
        loadPasswords()
    }, [services, passwordUpdated])

    return(
        <div className="passwordManager__interface">
            <Row className="passwordManager__row">
            <Col md={4} className="passwordManager__leftColumn">
                <h2>Password Manager</h2>
                <p>This is an application that stores all of your encrypted
                    passwords on the security of the Ethereum Blockchain</p>
                <Button variant="primary" onClick={() => setShowNewPasswordModal(true)}>Add Password</Button>
            </Col>
            <Col md={6} className="passwordManager__rightColumn">
                <div>
                    <h2>Passwords</h2>
                    <PasswordList contract={contract} passwords={passwords} passwordUpdated={setPasswordUpdated} services={services} serviceAdded={setServiceAdded}/>
                </div>
            </Col>
            </Row>
            <NewPasswordModal added={setServiceAdded} contract={contract} show={showNewPasswordModal} onHide={() => setShowNewPasswordModal(false)}/>
        </div>
    )
}

export default PasswordManager