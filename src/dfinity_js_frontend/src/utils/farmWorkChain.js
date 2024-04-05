import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";


// createContract
export async function createContract(contract) {
  return window.canister.farmWorkChain.createContract(contract);
}

// createWorkerProfile
export async function createWorkerProfile(profile) {
  return window.canister.farmWorkChain.createWorkerProfile(profile);
}

// createJobOffer
export async function createJobOffer(offer) {
  return window.canister.farmWorkChain.createJobOffer(offer);
}


// createFarmerProfile
export async function createFarmerProfile(profile) {
  return window.canister.farmWorkChain.createFarmerProfile(profile);
}

// getContract
export async function getContract(id) {
  return window.canister.farmWorkChain.getContract(id);
}

// getWorkerProfile
export async function getWorkerProfile(id) {
  return window.canister.farmWorkChain.getWorkerProfile(id);
}

// getJobOffer
export async function getJobOffer(id) {
  return window.canister.farmWorkChain.getJobOffer(id);
}



// getFarmerProfile
export async function getFarmerProfile(id) {
  return window.canister.farmWorkChain.getFarmerProfile(id);
}

// getAllContracts
export async function getAllContracts() {
  return window.canister.farmWorkChain.getAllContracts();
}

// getAllWorkerProfiles
export async function getAllWorkerProfiles() {
  return window.canister.farmWorkChain.getAllWorkerProfiles();
}

// getAllJobOffers
export async function getAllJobOffers() {
  return window.canister.farmWorkChain.getAllJobOffers();
}



// getAllFarmerProfiles
export async function getAllFarmerProfiles() {
  return window.canister.farmWorkChain.getAllFarmerProfiles();
}

// updateContract
export async function updateContract(contractId, contract) {
  return window.canister.farmWorkChain.updateContract(contractId, contract);
}

// updateWorkerProfile
export async function updateWorkerProfile(profileId, profile) {
  return window.canister.farmWorkChain.updateWorkerProfile(profileId, profile);
}

// updateJobOffer
export async function updateJobOffer(offerId, offer) {
  return window.canister.farmWorkChain.updateJobOffer(offerId, offer);
}



// updateFarmerProfile
export async function updateFarmerProfile(profileId, profile) {
  return window.canister.farmWorkChain.updateFarmerProfile(profileId, profile);
}

// deleteContract
export async function deleteContract(id) {
  return window.canister.farmWorkChain.deleteContract(id);
}

// deleteWorkerProfile
export async function deleteWorkerProfile(id) {
  return window.canister.farmWorkChain.deleteWorkerProfile(id);
}

// deleteJobOffer
export async function deleteJobOffer(id) {
  return window.canister.farmWorkChain.deleteJobOffer(id);
}


// deleteFarmerProfile
export async function deleteFarmerProfile(id) {
  return window.canister.farmWorkChain.deleteFarmerProfile(id);
}





// acceptContract
export async function acceptContract(contractId , workerId) {
  return window.canister.farmWorkChain.acceptContract(contractId, workerId);
}

// insertSkill
export async function insertSkill(workerId, skill) {
  return window.canister.farmWorkChain.insertSkill(workerId, skill);
}

// insertReference
export async function insertReference(workerId, reference) {
  return window.canister.farmWorkChain.insertReference(workerId, reference);
}

// verifyWorker
export async function verifyWorker(workerId) {
  return window.canister.farmWorkChain.verifyWorker(workerId);
}

// getWorkerByOwner
export async function getWorkerByOwner() {
  return window.canister.farmWorkChain.getWorkerByOwner();
}

// getFarmerByOwner
export async function getFarmerByOwner() {
  return window.canister.farmWorkChain.getFarmerByOwner();
}

// getAcceptedContracts
export async function getAcceptedContracts() {
  return window.canister.farmWorkChain.getAcceptedContracts();
}

// getCompletedContracts
export async function getCompletedContracts() {
  return window.canister.farmWorkChain.getCompletedContracts();
}




export async function payWorker(contract) {
  const farmWorkChainCanister = window.canister.farmWorkChain;
  const jobPayResp = await farmWorkChainCanister.createReserveJobPay(contract.id);
  const workerPrincipal = Principal.from(jobPayResp.Ok.worker);
  const workerAddress = await farmWorkChainCanister.getAddressFromPrincipal(workerPrincipal);
  const block = await transferICP(workerAddress, jobPayResp.Ok.price, jobPayResp.Ok.memo);
  console.log(workerPrincipal, contract.id, jobPayResp.Ok.price, block, jobPayResp.Ok.memo)
  await farmWorkChainCanister.completeJobPay(workerPrincipal, contract.id, jobPayResp.Ok.price, block, jobPayResp.Ok.memo);
}
