import React from 'react'
import { Button } from "react-bootstrap";


const PayWorker = ({pay }) => {


    const triggerBuy = async () => {
        pay()
    }
  return (
    <Button
        onClick={triggerBuy}
        variant="dark"
        style={{ backgroundColor: "#FFA500", borderRadius: "20px"}}
    >
        Pay Worker
    </Button>
  )
}

export default PayWorker