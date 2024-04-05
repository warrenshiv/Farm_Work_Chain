import React, { useEffect } from 'react'

const CompletedContracts = ({completeContract, getCompletedContracts}) => {

  const {contractId, jobTerms, wages, duration, status} = completeContract;
  
  const wagesr = wages / BigInt(10**8);
 
  return (
    <>
    <tbody>
      <tr>
        <td>{contractId}</td>
        <td>{jobTerms}</td>
        <td>{wagesr.toString()} ICP</td>
        <td>{duration}</td>
        <td>
          {status}
        </td>
      </tr>
    </tbody>
  </>
  )
}

export default CompletedContracts