import React from 'react'
import TakeContract from './TakeContract';

const ContractsCard = ({contract, workerId}) => {
 
    const {contractId, wages, duration, farmerId, jobOfferId} = contract;

    const wagesr = wages / BigInt(10**8);

  return (
    <>
    <tbody>
        <tr>
            <td>{jobOfferId}</td>
            <td>{farmerId}</td>
            <td>{wagesr.toString()} ICP</td>
            <td>{duration}</td>
            <td>
                <TakeContract contractId={contractId} workerId={workerId}  />
            </td>
        </tr>

    </tbody>
    </>
  )
}

export default ContractsCard