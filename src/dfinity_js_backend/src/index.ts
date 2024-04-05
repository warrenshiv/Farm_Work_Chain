import { auto } from "@popperjs/core";
import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister } from "azle";
import {
    Ledger, binaryAddressFromAddress, binaryAddressFromPrincipal, hexAddressFromPrincipal
} from "azle/canisters/ledger";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

const EmploymentContract = Record({
    contractId: text,
    farmerId: text,
    jobOfferId : text,
    workerId: Opt(text),
    jobDescription: text,
    jobTerms: text,
    wages: nat64,
    duration: text,
    status:text
});

const WorkerProfile = Record({
    workerId: text,
    owner: Principal,
    skills:Vec(text),
    name: text,
    contactNo : text,
    address: text,
    experience: text,
    references: Vec(text),
    earnedPoints : nat64,
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
    contactNo : text,
    owner:Principal,
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



// Stay with implementing Payment for Job Payment 
const JobPay = Record({
    ContractId: text,
    price: nat64,
    status: PayStatus,
    farmer:Principal,
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



const contractStorage = StableBTreeMap(0,text, EmploymentContract)
const workerStorage =  StableBTreeMap(1,text, WorkerProfile)
const jobStorage  = StableBTreeMap(2,text, JobOffer)
const farmerStorage = StableBTreeMap(3,text, FarmerProfile)
const pendingJobPay = StableBTreeMap(4,nat64, JobPay)
const persistedJobPay = StableBTreeMap(5, Principal, JobPay);


const TIMEOUT_PERIOD = 9600n; // reservation period in seconds


/* 
    initialization of the Ledger canister. The principal text value is hardcoded because 
    we set it in the `dfx.json`
*/
const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

export default Canister({
    //create a contract
    createContract: update([EmploymentContractPayload], Result(EmploymentContract, Message), (payload) => {
        const contractId = uuidv4();
        const contract = { ...payload, contractId, workerId: None, status: "PENDING" };
        contractStorage.insert(contractId, contract);
        return Ok(contract);
    }),

    //create a worker profile
    createWorkerProfile: update([WorkerProfilePayload], Result(WorkerProfile, Message), (payload) => {
        const workerId = uuidv4();
        const worker = { ...payload, workerId, owner: ic.caller(), skills: [], references: [], earnedPoints: 0n, verified: false };
        workerStorage.insert(workerId, worker);
        return Ok(worker);
    }),

    //create a job offer
    createJobOffer: update([JobOfferPayload], Result(JobOffer, Message), (payload) => {
        const jobOfferId = uuidv4();
        const jobOffer = { ...payload, jobOfferId, status: "PENDING" };
        jobStorage.insert(jobOfferId, jobOffer);
        return Ok(jobOffer);
    }),

  

    //create a farmer profile
    createFarmerProfile: update([FarmerProfilePayload], Result(FarmerProfile, Message), (payload) => {
        const farmerId = uuidv4();
        const farmer = { ...payload, farmerId, owner: ic.caller(),  rating: 0n, verified: false };
        farmerStorage.insert(farmerId, farmer);
        return Ok(farmer);
    }),

    //get a contract by id
    getContract: query([text], Result(EmploymentContract, Message), (contractId) => {
        const contractOpt = contractStorage.get(contractId);
        if ("None" in contractOpt) {
            return Err({ NotFound: `contract with id=${contractId} not found` });
        }
        return Ok(contractOpt.Some);
    }),

    // get Contract by Worker Id
    getContractAssignedToWorker: query([text], Result(EmploymentContract, Message), (workerId) => {
        const contractOpt = contractStorage
            .values()
            .filter((contract) => {
                return contract.workerId.Some === workerId;
            });
        if (contractOpt.length === 0) {
            return Err({
                NotFound: `contract with workerId=${workerId} not found`,
            });
        }
        return Ok(contractOpt[0]);
    }
    ),


    //get a worker profile by id
    getWorkerProfile: query([text], Result(WorkerProfile, Message), (workerId) => {
        const workerOpt = workerStorage.get(workerId);
        if ("None" in workerOpt) {
            return Err({ NotFound: `worker with id=${workerId} not found` });
        }
        return Ok(workerOpt.Some);
    }),

 
    // get Worker by owner principal using filter
    getWorkerByOwner: query(
        [],
        Result(WorkerProfile, Message),
        () => {
            const workerOpt = workerStorage
                .values()
                .filter((worker) => {
                    return worker.owner.toText() === ic.caller().toText();
                });
            if (workerOpt.length === 0) {
                return Err({
                    NotFound: `worker with owner=${ic.caller()} not found`,
                });
            }
            return Ok(workerOpt[0]);
        }
    ),

    // get Farmer by owner principal using filter
    getFarmerByOwner: query(
        [],
        Result(FarmerProfile, Message),
        () => {
            const farmerOpt = farmerStorage
                .values()
                .filter((farmer) => {
                    return farmer.owner.toText() === ic.caller().toText();
                });
            if (farmerOpt.length === 0) {
                return Err({
                    NotFound: `farmer with owner=${ic.caller()} not found`,
                });
            }
            return Ok(farmerOpt[0]);
        }
    ),


    //get a job offer by id
    getJobOffer: query([text], Result(JobOffer, Message), (jobOfferId) => {
        const jobOpt = jobStorage.get(jobOfferId);
        if ("None" in jobOpt) {
            return Err({ NotFound: `job offer with id=${jobOfferId} not found` });
        }
        return Ok(jobOpt.Some);
    }),

    // Fetch Accepted Contracts
    getAcceptedContracts: query([], Vec(EmploymentContract), () => {
        const contractOpt = contractStorage
            .values()
            .filter((contract) => {
                return contract.status === "ACCEPTED";
            });
        return contractOpt;
    }
    ),

    // fetch Completed Contracts
    getCompletedContracts: query([], Vec(EmploymentContract), () => {
        const contractOpt = contractStorage
            .values()
            .filter((contract) => {
                return contract.status === "COMPLETED";
            });
        return contractOpt;
    }
    ),

  

    //get a farmer profile by id
    getFarmerProfile: query([text], Result(FarmerProfile, Message), (farmerId) => {
        const farmerOpt = farmerStorage.get(farmerId);
        if ("None" in farmerOpt) {
            return Err({ NotFound: `farmer with id=${farmerId} not found` });
        }
        return Ok(farmerOpt.Some);
    }),

    //get all contracts
    getAllContracts: query([], Vec(EmploymentContract), () => {
        return contractStorage.values();
    }),

    //get all worker profiles
    getAllWorkerProfiles: query([], Vec(WorkerProfile), () => {
        return workerStorage.values();
    }),

    //get all job offers
    getAllJobOffers: query([], Vec(JobOffer), () => {
        return jobStorage.values();
    }),



    //get all farmer profiles
    getAllFarmerProfiles: query([], Vec(FarmerProfile), () => {
        return farmerStorage.values();
    }),

    //update a contract
    updateContract: update([text, EmploymentContractPayload], Result(EmploymentContract, Message), (contractId, payload) => {
        const contractOpt = contractStorage.get(contractId);
        if ("None" in contractOpt) {
            return Err({ NotFound: `contract with id=${contractId} not found` });
        }
        const contract = contractOpt.Some;
        const updatedContract = { ...contract, ...payload };
        contractStorage.insert(contractId, updatedContract);
        return Ok(updatedContract);
    }),

    //update a worker profile
    updateWorkerProfile: update([text, WorkerProfilePayload], Result(WorkerProfile, Message), (workerId, payload) => {
        const workerOpt = workerStorage.get(workerId);
        if ("None" in workerOpt) {
            return Err({ NotFound: `worker with id=${workerId} not found` });
        }
        const worker = workerOpt.Some;
        const updatedWorker = { ...worker, ...payload };
        workerStorage.insert(workerId, updatedWorker);
        return Ok(updatedWorker);
    }),

    //update a job offer
    updateJobOffer: update([text, JobOfferPayload], Result(JobOffer, Message), (jobOfferId, payload) => {
        const jobOpt = jobStorage.get(jobOfferId);
        if ("None" in jobOpt) {
            return Err({ NotFound: `job offer with id=${jobOfferId} not found` });
        }
        const job = jobOpt.Some;
        const updatedJob = { ...job, ...payload };
        jobStorage.insert(jobOfferId, updatedJob);
        return Ok(updatedJob);
    }),



    //update a farmer profile
    updateFarmerProfile: update([text, FarmerProfilePayload], Result(FarmerProfile, Message), (farmerId, payload) => {
        const farmerOpt = farmerStorage.get(farmerId);
        if ("None" in farmerOpt) {
            return Err({ NotFound: `farmer with id=${farmerId} not found` });
        }
        const farmer = farmerOpt.Some;
        const updatedFarmer = { ...farmer, ...payload };
        farmerStorage.insert(farmerId, updatedFarmer);
        return Ok(updatedFarmer);
    }),

    //delete a contract
    deleteContract: update([text], Result(EmploymentContract, Message), (contractId) => {
        const contractOpt = contractStorage.remove(contractId);
        if ("None" in contractOpt) {
            return Err({ NotFound: `contract with id=${contractId} not found` });
        }
        return Ok(contractOpt.Some);
    }),

    //delete a worker profile
    deleteWorkerProfile: update([text], Result(WorkerProfile, Message), (workerId) => {
        const workerOpt = workerStorage.remove(workerId);
        if ("None" in workerOpt) {
            return Err({ NotFound: `worker with id=${workerId} not found` });
        }
        return Ok(workerOpt.Some);
    }),

    //delete a job offer
    deleteJobOffer: update([text], Result(JobOffer, Message), (jobOfferId) => {
        const jobOpt = jobStorage.remove(jobOfferId);
        if ("None" in jobOpt) {
            return Err({ NotFound: `job offer with id=${jobOfferId} not found` });
        }
        return Ok(jobOpt.Some);
    }),

 

    //delete a farmer profile
    deleteFarmerProfile: update([text], Result(FarmerProfile, Message), (farmerId) => {
        const farmerOpt = farmerStorage.remove(farmerId);
        if ("None" in farmerOpt) {
            return Err({ NotFound: `farmer with id=${farmerId} not found` });
        }
        return Ok(farmerOpt.Some);
    }),

 


    // worker accepts a contract offer and becomes a worker 
    acceptContract: update([text, text], Result(EmploymentContract, Message), (contractId, workerId) => {
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

  

    // worker inserts a skill to his profile
    insertSkill: update([text, text], Result(WorkerProfile, Message), (workerId, skill) => {
        const workerOpt = workerStorage.get(workerId);
        if ("None" in workerOpt) {
            return Err({ NotFound: `worker with id=${workerId} not found` });
        }
        const worker = workerOpt.Some;
        worker.skills.push(skill);
        workerStorage.insert(workerId, worker);
        return Ok(worker);
    }),

    // worker inserts a reference to his profile
    insertReference: update([text, text], Result(WorkerProfile, Message), (workerId, reference) => {
        const workerOpt = workerStorage.get(workerId);
        if ("None" in workerOpt) {
            return Err({ NotFound: `worker with id=${workerId} not found` });
        }
        const worker = workerOpt.Some;
        worker.references.push(reference);
        workerStorage.insert(workerId, worker);
        return Ok(worker);
    }),

    // Change worker verified to true when the earned points are greater than 30
    verifyWorker: update([text], Result(WorkerProfile, Message), (workerId) => {
        const workerOpt = workerStorage.get(workerId);
        if ("None" in workerOpt) {
            return Err({ NotFound: `worker with id=${workerId} not found` });
        }
        const worker = workerOpt.Some;
        if (worker.earnedPoints < 30n) {
            return Err({ InvalidPayload: `worker with id=${workerId} has less than 30 earned points` });
        }
        workerStorage.insert(workerId, { ...worker, verified: true });
        return Ok(worker);
    }),




    //create a reserve
    createReserveJobPay: update([text], Result(JobPay, Message), (contractId) => {
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

        // workerId is an optional field in the contract record so we need to check if it is present
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
            memo: generateCorrelationId(contractId)
        };
        pendingJobPay.insert(jobPay.memo, jobPay);
        discardByTimeout(jobPay.memo, TIMEOUT_PERIOD);
        return Ok(jobPay);
    }
    ),

    // Complete a Job Pay to Worker
    completeJobPay: update([Principal,text,nat64, nat64, nat64], Result(JobPay, Message), async (worker,contractId,payPrice, block, memo) => {
        const paymentVerified = await verifyPaymentInternal(worker,payPrice, block, memo);
        if (!paymentVerified) {
            return Err({ NotFound: `cannot complete the Job Pay: cannot verify the payment, memo=${memo}` });
        }
        const pendingJobPayOpt = pendingJobPay.remove(memo);
        if ("None" in pendingJobPayOpt) {
            return Err({ NotFound: `cannot complete the Job Pay: there is no pending Job Pay with id=${contractId}` });
        }
        const jobPay = pendingJobPayOpt.Some;
        const updatedReserve = { ...jobPay, status: { Completed: "COMPLETED" }, paid_at_block: Some(block) };

        const contractOpt = contractStorage.get(contractId);
        if ("None" in contractOpt){
            throw Error(`Contract with id=${contractId} not found`)
        }

        const contract = contractOpt.Some;
        console.log("first contract",contract)
        contract.status = "COMPLETED";

        console.log("second contract",contract)

        // console.log("Contract",contract)
        // // Update the worker Earned Points

        // const workerOpt = workerStorage.get(contract.workerId.Some);
        // console.log("workOpt",workerOpt)
        // if ("None" in workerOpt){
        //     throw Error(`Worker with id=${contract.workerId.Some} not found`)
        // }
        // const workerUpdate = workerOpt.Some;
        // console.log("earned Points",  workerUpdate.earnedPoints)

        // workerUpdate.earnedPoints += BigInt(10);
        // workerStorage.insert(workerUpdate.workerId,worker)
        contractStorage.insert(contract.contractId,contract)
        persistedJobPay.insert(ic.caller(), updatedReserve);
        return Ok(updatedReserve);
    }
    ),

    
     /*
        another example of a canister-to-canister communication
        here we call the `query_blocks` function on the ledger canister
        to get a single block with the given number `start`.
        The `length` parameter is set to 1 to limit the return amount of blocks.
        In this function we verify all the details about the transaction to make sure that we can mark the order as completed
    */
    verifyPayment: query([Principal, nat64, nat64, nat64], bool, async (receiver, amount, block, memo) => {
        return await verifyPaymentInternal(receiver, amount, block, memo);
    }),

    /*
        a helper function to get address from the principal
        the address is later used in the transfer method
    */
    getAddressFromPrincipal: query([Principal], text, (principal) => {
        return hexAddressFromPrincipal(principal, 0);
    }),

});

/*
    a hash function that is used to generate correlation ids for orders.
    also, we use that in the verifyPayment function where we check if the used has actually paid the order
*/
function hash(input: any): nat64 {
    return BigInt(Math.abs(hashCode().value(input)));
};

// a workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};


// HELPER FUNCTIONS
function generateCorrelationId(contractId: text): nat64 {
    const correlationId = `${contractId}_${ic.caller().toText()}_${ic.time()}`;
    return hash(correlationId);
};

/*
    after the order is created, we give the `delay` amount of minutes to pay for the order.
    if it's not paid during this timeframe, the order is automatically removed from the pending orders.
*/
function discardByTimeout(memo: nat64, delay: Duration) {
    ic.setTimer(delay, () => {
        const order = pendingJobPay.remove(memo);
        console.log(`Reserve discarded ${order}`);
    });
};

async function verifyPaymentInternal(receiver: Principal, amount: nat64, block: nat64, memo: nat64): Promise<bool> {
    const blockData = await ic.call(icpCanister.query_blocks, { args: [{ start: block, length: 1n }] });
    const tx = blockData.blocks.find((block) => {
        if ("None" in block.transaction.operation) {
            return false;
        }
        const operation = block.transaction.operation.Some;
        const senderAddress = binaryAddressFromPrincipal(ic.caller(), 0);
        const receiverAddress = binaryAddressFromPrincipal(receiver, 0);
        return block.transaction.memo === memo &&
            hash(senderAddress) === hash(operation.Transfer?.from) &&
            hash(receiverAddress) === hash(operation.Transfer?.to) &&
            amount === operation.Transfer?.amount.e8s;
    });
    return tx ? true : false;
};