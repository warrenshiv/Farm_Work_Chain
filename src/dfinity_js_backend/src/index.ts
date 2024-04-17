import { auto } from "@popperjs/core";
import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister } from "azle";
import {
    Ledger, binaryAddressFromAddress, binaryAddressFromPrincipal, hexAddressFromPrincipal
} from "azle/canisters/ledger";
import { sha256 } from "js-sha256";
import { createSecureUUID } from "./utils"; // Assuming the secure UUID function is in a separate file

// Define data models
const EmploymentContract = Record({
    contractId: text,
    farmerId: text,
    jobOfferId: text,
    workerId: Opt(text),
    jobDescription: text,
    jobTerms: text,
    wages: nat64,
    duration: text,
    status: text
});

const WorkerProfile = Record({
    workerId: text,
    owner: Principal,
    skills: Vec(text),
    name: text,
    contactNo: text,
    address: text,
    experience: text,
    references: Vec(text),
    earnedPoints: nat64,
    verified: bool
});

const JobOffer = Record({
    jobOfferId: text,
    farmerId: text,
    jobTitle: text,
    jobDescription: text,
    duration: text,
    status: text
});

const FarmerProfile = Record({
    farmerId: text,
    name: text,
    contactNo: text,
    owner: Principal,
    farmSize: nat64,
    location: text,
    rating: nat64,
    verified: bool
});

const EmploymentContractPayload = Record({
    farmerId: text,
    jobOfferId: text,
    jobDescription: text,
    jobTerms: text,
    wages: nat64,
    duration: text
});

const WorkerProfilePayload = Record({
    name: text,
    contactNo: text,
    address: text,
    experience: text,
});

const JobOfferPayload = Record({
    farmerId: text,
    jobTitle: text,
    jobDescription: text,
    duration: text
});

const FarmerProfilePayload = Record({
    name: text,
    contactNo: text,
    farmSize: nat64,
    location: text,
});

const PayStatus = Variant({
    PaymentPending: text,
    Completed: text
});

const JobPay = Record({
    ContractId: text,
    price: nat64,
    status: PayStatus,
    farmer: Principal,
    worker: Principal,
    paid_at_block: Opt(nat64),
    memo: nat64
});

const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
    PaymentFailed: text,
    PaymentCompleted: text
});

// Initialize storage
const contractStorage = StableBTreeMap(0, text, EmploymentContract);
const workerStorage = StableBTreeMap(1, text, WorkerProfile);
const jobStorage = StableBTreeMap(2, text, JobOffer);
const farmerStorage = StableBTreeMap(3, text, FarmerProfile);
const pendingJobPay = StableBTreeMap(4, nat64, JobPay);
const persistedJobPay = StableBTreeMap(5, Principal, JobPay);

const TIMEOUT_PERIOD = 9600n; // reservation period in seconds

/* 
    initialization of the Ledger canister. The principal text value is hardcoded because 
    we set it in the `dfx.json`
*/
const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

// Utility functions
function getProfileByOwner<T>(storage: StableBTreeMap<text, T>, caller: Principal): Result<T, Message> {
    const profileOpt = storage.values().filter((profile) => {
        return profile.owner.toText() === caller.toText();
    });
    if (profileOpt.length === 0) {
        return Err({
            NotFound: `${typeof T} with owner=${caller} not found`,
        });
    }
    return Ok(profileOpt[0]);
}

export default Canister({
    // Create a contract
    createContract: update([EmploymentContractPayload], Result<EmploymentContract, Message>, (payload) => {
        const contractId = createSecureUUID();
        const contract = { ...payload, contractId, workerId: None, status: "PENDING" };
        contractStorage.insert(contractId, contract);
        return Ok(contract);
    }),

    // Create a worker profile
    createWorkerProfile: update([WorkerProfilePayload], Result<WorkerProfile, Message>, (payload) => {
        const workerId = createSecureUUID();
        const worker = { ...payload, workerId, owner: ic.caller(), skills: [], references: [], earnedPoints: 0n, verified: false };
        workerStorage.insert(workerId, worker);
        return Ok(worker);
    }),

    // Create a job offer
    createJobOffer: update([JobOfferPayload], Result<JobOffer, Message>, (payload) => {
        const jobOfferId = createSecureUUID();
        const jobOffer = { ...payload, jobOfferId, status: "PENDING" };
        jobStorage.insert(jobOfferId, jobOffer);
        return Ok(jobOffer);
    }),

    // Create a farmer profile
    createFarmerProfile: update([FarmerProfilePayload], Result<FarmerProfile, Message>, (payload) => {
        const farmerId = createSecureUUID();
        const farmer = { ...payload, farmerId, owner: ic.caller(), rating: 0n, verified: false };
        farmerStorage.insert(farmerId, farmer);
        return Ok(farmer);
    }),

    // Get a contract by ID
    getContract: query([text], Result<EmploymentContract, Message>, (contractId) => {
        const contractOpt = contractStorage.get(contractId);
        if ("None" in contractOpt) {
            return Err({ NotFound: `contract with id=${contractId} not found` });
        }
        return Ok(contractOpt.Some);
    }),

    // Get a contract assigned to a worker
    getContractAssignedToWorker: query([text], Result<EmploymentContract, Message>, (workerId) => {
        const contractOpt = contractStorage.values().filter((contract) => {
            return contract.workerId.Some === workerId;
        });
        if (contractOpt.length === 0) {
            return Err({
                NotFound: `contract with workerId=${workerId} not found`,
            });
        }
        return Ok(contractOpt[0]);
    }),

    // Get a worker profile by ID
    getWorkerProfile: query([text], Result<WorkerProfile, Message>, (workerId) => {
        const workerOpt = workerStorage.get(workerId);
        if ("None" in workerOpt) {
            return Err({ NotFound: `worker with id=${workerId} not found` });
        }
        return Ok(workerOpt.Some);
    }),

    // Get a worker by owner principal
    getWorkerByOwner: query([], Result<WorkerProfile, Message>, () => {
        return getProfileByOwner(workerStorage, ic.caller());
    }),

    // Get a farmer by owner principal
    getFarmerByOwner: query([], Result<FarmerProfile, Message>, () => {
        return getProfileByOwner(farmerStorage, ic.caller());
    }),

    // Get a job offer by ID
    getJobOffer: query([text], Result<JobOffer, Message>, (jobOfferId) => {
        const jobOpt = jobStorage.get(jobOfferId);
        if ("None" in jobOpt) {
            return Err({ NotFound: `job offer with id=${jobOfferId} not found` });
        }
        return Ok(jobOpt.Some);
    }),

    // Fetch accepted
    contracts: query([], Vec(EmploymentContract), () => {
       const contractOpt = contractStorage
           .values()
           .filter((contract) => {
               return contract.status === "ACCEPTED";
           });
       return contractOpt;
   }),

   // Fetch completed contracts
   getCompletedContracts: query([], Vec(EmploymentContract), () => {
       const contractOpt = contractStorage
           .values()
           .filter((contract) => {
               return contract.status === "COMPLETED";
           });
       return contractOpt;
   }),

   // Get a farmer profile by ID
   getFarmerProfile: query([text], Result<FarmerProfile, Message>, (farmerId) => {
       const farmerOpt = farmerStorage.get(farmerId);
       if ("None" in farmerOpt) {
           return Err({ NotFound: `farmer with id=${farmerId} not found` });
       }
       return Ok(farmerOpt.Some);
   }),

   // Get all contracts
   getAllContracts: query([], Vec(EmploymentContract), () => {
       return contractStorage.values();
   }),

   // Get all worker profiles
   getAllWorkerProfiles: query([], Vec(WorkerProfile), () => {
       return workerStorage.values();
   }),

   // Get all job offers
   getAllJobOffers: query([], Vec(JobOffer), () => {
       return jobStorage.values();
   }),

   // Get all farmer profiles
   getAllFarmerProfiles: query([], Vec(FarmerProfile), () => {
       return farmerStorage.values();
   }),

   // Update a contract
   updateContract: update([text, EmploymentContractPayload], Result<EmploymentContract, Message>, (contractId, payload) => {
       const contractOpt = contractStorage.get(contractId);
       if ("None" in contractOpt) {
           return Err({ NotFound: `contract with id=${contractId} not found` });
       }
       const contract = contractOpt.Some;
       const updatedContract = { ...contract, ...payload };
       contractStorage.insert(contractId, updatedContract);
       return Ok(updatedContract);
   }),

   // Update a worker profile
   updateWorkerProfile: update([text, WorkerProfilePayload], Result<WorkerProfile, Message>, (workerId, payload) => {
       const workerOpt = workerStorage.get(workerId);
       if ("None" in workerOpt) {
           return Err({ NotFound: `worker with id=${workerId} not found` });
       }
       const worker = workerOpt.Some;
       const updatedWorker = { ...worker, ...payload };
       workerStorage.insert(workerId, updatedWorker);
       return Ok(updatedWorker);
   }),

   // Update a job offer
   updateJobOffer: update([text, JobOfferPayload], Result<JobOffer, Message>, (jobOfferId, payload) => {
       const jobOpt = jobStorage.get(jobOfferId);
       if ("None" in jobOpt) {
           return Err({ NotFound: `job offer with id=${jobOfferId} not found` });
       }
       const job = jobOpt.Some;
       const updatedJob = { ...job, ...payload };
       jobStorage.insert(jobOfferId, updatedJob);
       return Ok(updatedJob);
   }),

   // Update a farmer profile
   updateFarmerProfile: update([text, FarmerProfilePayload], Result<FarmerProfile, Message>, (farmerId, payload) => {
       const farmerOpt = farmerStorage.get(farmerId);
       if ("None" in farmerOpt) {
           return Err({ NotFound: `farmer with id=${farmerId} not found` });
       }
       const farmer = farmerOpt.Some;
       const updatedFarmer = { ...farmer, ...payload };
       farmerStorage.insert(farmerId, updatedFarmer);
       return Ok(updatedFarmer);
   }),

   // Delete a contract
   deleteContract: update([text], Result<EmploymentContract, Message>, (contractId) => {
       const contractOpt = contractStorage.remove(contractId);
       if ("None" in contractOpt) {
           return Err({ NotFound: `contract with id=${contractId} not found` });
       }
       return Ok(contractOpt.Some);
   }),

   // Delete a worker profile
   deleteWorkerProfile: update([text], Result<WorkerProfile, Message>, (workerId) => {
       const workerOpt = workerStorage.remove(workerId);
       if ("None" in workerOpt) {
           return Err({ NotFound: `worker with id=${workerId} not found` });
       }
       return Ok(workerOpt.Some);
   }),

   // Delete a job offer
   deleteJobOffer: update([text], Result<JobOffer, Message>, (jobOfferId) => {
       const jobOpt = jobStorage.remove(jobOfferId);
       if ("None" in jobOpt) {
           return Err({ NotFound: `job offer with id=${jobOfferId} not found` });
       }
       return Ok(jobOpt.Some);
   }),

   // Delete a farmer profile
   deleteFarmerProfile: update([text], Result<FarmerProfile, Message>, (farmerId) => {
       const farmerOpt = farmerStorage.remove(farmerId);
       if ("None" in farmerOpt) {
           return Err({ NotFound: `farmer with id=${farmerId} not found` });
       }
       return Ok(farmerOpt.Some);
   }),

   // Worker accepts a contract offer and becomes a worker
   acceptContract: update([text, text], Result<EmploymentContract, Message>, (contractId, workerId) => {
       const contractOpt = contractStorage.get(contractId);
       if ("None" in contractOpt) {
           return Err({ NotFound: `contract with id=${contractId} not found` });
       }
       const contract = contractOpt.Some;
       if (contract.workerId.isSome) {
           return Err({ InvalidPayload: `contract with id=${contractId} already has a worker` });
       }
       contractStorage.insert(contractId, { ...contract, workerId: Some(workerId), status: "ACCEPTED" });
       return Ok(contract);
   }),

   // Worker inserts a skill to their profile
   insertSkill: update([text, text], Result<WorkerProfile, Message>, (workerId, skill) => {
       const workerOpt = workerStorage.get(workerId);
       if ("None" in workerOpt) {
           return Err({ NotFound: `worker with id=${workerId} not found` });
       }
       const worker = workerOpt.Some;
       worker.skills.push(skill);
       workerStorage.insert(workerId, worker);
       return Ok(worker);
   }),

   // Worker inserts a reference to their profile
   insertReference: update([text, text], Result<WorkerProfile, Message>, (workerId, reference) => {
       const workerOpt = workerStorage.get(workerId);
       if ("None" in workerOpt) {
           return Err({ NotFound: `worker with id=${workerId} not found` });
       }
       const worker = workerOpt.Some;
       worker.references.push(reference);
       workerStorage.insert(workerId, worker);
       return Ok(worker);
   }),

   // Change worker's verified status to true when the earned points are greater than or equal to 30
   verifyWorker: update([text], Result<WorkerProfile, Message>, (workerId) => {
       const workerOpt = workerStorage.get(workerId);
       if ("None" in workerOpt) {
           return Err({ NotFound: `worker with id=${workerId} not found` });
       }
       const worker = workerOpt.Some;
       if (worker.earnedPoints >= 30n) {
           worker.verified = true;
           workerStorage.insert(workerId, worker);
           return Ok(worker);
       }
       return Ok(worker);
   }),

   // Create a reserve for job payment
   createReserveJobPay: update([text], Result<Job Pay, Message>, (contractId) => {
    const contractOpt = contractStorage.get(contractId);
    if ("None" in contractOpt) {
        return Err({ NotFound: `cannot reserve job: contract with id=${contractId} not found` });
    }
    const contract = contractOpt.Some;

    const farmerOpt = farmerStorage.get(contract.farmerId);
    if ("None" in farmerOpt) {
        return Err({ NotFound: `cannot reserve job: farmer with id=${contract.farmerId} not found` });
    }
    const farmer = farmerOpt.Some;

    // Check if a worker is assigned to the contract
    if (contract.workerId.None === null) {
        return Err({ NotFound: `cannot reserve job: worker not assigned to the contract with id=${contractId}` });
    }

    const workerOpt = workerStorage.get(contract.workerId.Some);
    if ("None" in workerOpt) {
        return Err({ NotFound: `cannot reserve job: worker with id=${contract.workerId.Some} not found` });
    }
    const worker = workerOpt.Some;

    const jobPay = {
        ContractId: contract.contractId,
        price: contract.wages,
        status: { PaymentPending: "PAYMENT_PENDING" },
        farmer: farmer.owner,
        worker: worker.owner,
        paid_at_block: None,
        memo: generateSecureCorrelationId(contractId)
    };
    pendingJobPay.insert(jobPay.memo, jobPay);
    discardByTimeout(jobPay.memo, TIMEOUT_PERIOD);
    return Ok(jobPay);
}),

// Complete a job payment to a worker
completeJobPay: update([Principal, text, nat64, nat64, nat64], Result<JobPay, Message>, async (worker, contractId, payPrice, block, memo) => {
    const paymentVerified = await verifyPaymentInternal(worker, payPrice, block, memo);
    if (!paymentVerified) {
        return Err({ NotFound: `cannot complete the Job Pay: cannot verify the payment, memo=${memo}` });
    }

    const pendingJobPayOpt = pendingJobPay.remove(memo);
    if ("None" in pendingJobPayOpt) {
        return Err({ NotFound: `cannot complete the Job Pay: there is no pending Job Pay with id=${contractId}` });
    }
    const jobPay = pendingJobPayOpt.Some;
    const updatedJobPay = { ...jobPay, status: { Completed: "COMPLETED" }, paid_at_block: Some(block) };

    const contractOpt = contractStorage.get(contractId);
    if ("None" in contractOpt) {
        throw Error(`Contract with id=${contractId} not found`);
    }

    const contract = contractOpt.Some;
    contract.status = "COMPLETED";

    const workerOpt = workerStorage.get(contract.workerId.Some);
    if ("None" in workerOpt) {
        throw Error(`Worker with id=${contract.workerId.Some} not found`);
    }
    const workerUpdate = workerOpt.Some;
    workerUpdate.earnedPoints += BigInt(10);
    workerStorage.insert(workerUpdate.workerId, workerUpdate);

    contractStorage.insert(contract.contractId, contract);
    persistedJobPay.insert(ic.caller(), updatedJobPay);
    return Ok(updatedJobPay);
}),

/*
    Verify payment by checking the details of the transaction on the ledger canister
*/
verifyPayment: query([Principal, nat64, nat64, nat64], bool, async (receiver, amount, block, memo) => {
    return await verifyPaymentInternal(receiver, amount, block, memo);
}),

/*
    Get address from the principal for use in the transfer method
*/
getAddressFromPrincipal: query([Principal], text, (principal) => {
    return hexAddressFromPrincipal(principal, 0);
}),
});

// Helper functions
function generateSecureCorrelationId(contractId: text): nat64 {
    const correlationId = `${contractId}_${ic.caller().toText()}_${ic.time()}`;
    return secureHash(correlationId);
}

function secureHash(input: string): nat64 {
    const hashBuffer = sha256.array(input);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return BigInt(`0x${hashHex}`);
}

function discardByTimeout(memo: nat64, delay: Duration) {
    ic.setTimer(delay, () => {
        const pendingJobPayOpt = pendingJobPay.get(memo);
        if ("Some" in pendingJobPayOpt) {
            pendingJobPay.remove(memo);
            console.log(`Reserve discarded ${pendingJobPayOpt.Some}`);
        }
    });
}

async function verifyPaymentInternal(receiver: Principal, amount: nat64, block: nat64, memo: nat64): Promise<bool> {
    const blockData = await ic.call(icpCanister.query_blocks, { args: [{ start: block, length: 1n }] });
    const tx = blockData.blocks[0].transaction;
    if ("None" in tx.operation) {
        return false;
    }
    const operation = tx.operation.Some;
    const senderAddress = binaryAddressFromPrincipal(ic.caller(), 0);
    const receiverAddress = binaryAddressFromPrincipal(receiver, 0);
    return tx.memo === memo &&
        secureHash(senderAddress) === secureHash(operation.Transfer?.from) &&
        secureHash(receiverAddress) === secureHash(operation.Transfer?.to) &&
        amount === operation.Transfer?.amount.e8s;
}
