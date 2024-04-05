import React from 'react'
import PayWorker from './PayWorker';
import { payWorker } from '../../utils/farmWorkChain';

const AcceptedContracts = ({acceptedContract, getAcceptedContracts }) => {

  // Implement payment logic here taking the contractId
  const {contractId, jobTerms, wages, duration} = acceptedContract;

  const wagesr = wages / BigInt(10**8);
  console.log("contract Id1", contractId)

  const id = contractId;
  const markContractAsComplete =  async () => {
    try {
      console.log("id", id)
      await payWorker({id}).then(async (res) => {
        console.log("res1", res);
        getAcceptedContracts();
      } );
    } catch (error) {
      console.log("Check if wallet is Funded");
    }
  }

  return (
     <>
      <tbody>
        <tr>
          <td>{contractId}</td>
          <td>{jobTerms}</td>
          <td>{wagesr.toString()} ICP</td>
          <td>{duration}</td>
          <td>
            <PayWorker pay={markContractAsComplete}  />
          </td>
        </tr>
      </tbody>
    </>
  )
}

export default AcceptedContracts