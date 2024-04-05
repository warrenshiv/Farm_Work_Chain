import React from 'react'
import AddContractForJob from './AddContractForJob';
import { createContract } from '../../utils/farmWorkChain';

const JobOfferCard = ({offerJob, getAllJobOffers,farmerId}) => {


  const {jobOfferId, jobTitle, jobDescription, duration} = offerJob;

  const makeContract = async (data) => {
    try {
      const wagesStr = data.wages;
      data.wages = parseInt(wagesStr, 10) * 10**8;
      await createContract(data).then(async (res) => {
        getAllJobOffers();
      } );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <tbody>
        <tr>
          <td>{jobTitle}</td>
          <td>{jobDescription}</td>
          <td>{duration}</td>
          <td>
            <AddContractForJob save={makeContract} jobOfferId={jobOfferId} farmerId={farmerId} />
          </td>
        </tr>
      </tbody>
    </>
  )
}

export default JobOfferCard