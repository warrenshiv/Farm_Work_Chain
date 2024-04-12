import { Principal, nat64, text, Option, Result, Variant, Vec, Duration, StableBTreeMap, None, Some, update, query, Canister } from "azle";
import { Ledger, hexAddressFromPrincipal } from "azle/canisters/ledger";
import { v4 as uuidv4 } from "uuid";

// Define record types for data models
const EmploymentContract = Record({
    contractId: text,
    farmerId: text,
    jobOfferId: text,
    workerId: Option(text),
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
    paid_at_block: Option(nat64),
    memo: nat64
});

const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
    PaymentFailed: text,
    PaymentCompleted: text
});

// Initialize storage for different data models
const contractStorage = StableBTreeMap(0, text, EmploymentContract);
const workerStorage = StableBTreeMap(1, text, WorkerProfile);
const jobStorage = StableBTreeMap(2, text, JobOffer);
const farmerStorage = StableBTreeMap(3, text, FarmerProfile);
const pendingJobPay = StableBTreeMap(4, nat64, JobPay);
const persistedJobPay = StableBTreeMap(5, Principal, JobPay);

// Define timeout period for reservation
const TIMEOUT_PERIOD: Duration = 9600n; // in seconds

// Initialize Ledger canister
const ledgerCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

// Define the Canister
export default Canister({
    // Function to create a contract
    createContract: update([EmploymentContractPayload], Result(EmploymentContract, Message), (payload) => {
        const contractId = uuidv4();
        const contract = { ...payload, contractId, workerId: None, status: "PENDING" };
        contractStorage.insert(contractId, contract);
        return Ok(contract);
    }),

    // Function to create a worker profile
    createWorkerProfile: update([WorkerProfilePayload], Result(WorkerProfile, Message), (payload) => {
        const workerId = uuidv4();
        const worker = { ...payload, workerId, owner: ic.caller(), skills: [], references: [], earnedPoints: 0n, verified: false };
        workerStorage.insert(workerId, worker);
        return Ok(worker);
    }),

    // Function to create a job offer
    createJobOffer: update([JobOfferPayload], Result(JobOffer, Message), (payload) => {
        const jobOfferId = uuidv4();
        const jobOffer = { ...payload, jobOfferId, status: "PENDING" };
        jobStorage.insert(jobOfferId, jobOffer);
        return Ok(jobOffer);
    }),

    // Function to create a farmer profile
    createFarmerProfile: update([FarmerProfilePayload], Result(FarmerProfile, Message), (payload) => {
        const farmerId = uuidv4();
        const farmer = { ...payload, farmerId, owner: ic.caller(), rating: 0n, verified: false };
        farmerStorage.insert(farmerId, farmer);
        return Ok(farmer);
    }),

    // Function to get a contract by id
    getContract: query([text], Result(EmploymentContract, Message), (contractId) => {
        const contractOpt = contractStorage.get(contractId);
        return contractOpt.match({
            Some: (contract) => Ok(contract),
            None: () => Err({ NotFound: `Contract with id=${contractId} not found` })
        });
    }),

    // Function to get a worker profile by id
    getWorkerProfile: query([text], Result(WorkerProfile, Message), (workerId) => {
        const workerOpt = workerStorage.get(workerId);
        return workerOpt.match({
            Some: (worker) => Ok(worker),
            None: () => Err({ NotFound: `Worker with id=${workerId} not found` })
        });
    }),

    // Function to get a farmer profile by id
    getFarmerProfile: query([text], Result(FarmerProfile, Message), (farmerId) => {
        const farmerOpt = farmerStorage.get(farmerId);
        return farmerOpt.match({
            Some: (farmer) => Ok(farmer),
            None: () => Err({ NotFound: `Farmer with id=${farmerId} not found` })
        });
    }),

    // Function to get a job offer by id
    getJobOffer: query([text], Result(JobOffer, Message), (jobOfferId) => {
        const jobOpt = jobStorage.get(jobOfferId);
        return jobOpt.match({
            Some: (job) => Ok(job),
            None: () => Err({ NotFound: `Job offer with id=${jobOfferId} not found` })
        });
    }),

    // Fetch Accepted Contracts
    getAcceptedContracts: query([], Vec(EmploymentContract), () => {
        return contractStorage.values().filter((contract) => contract.status === "ACCEPTED");
    }),

    // Fetch Completed Contracts
    getCompletedContracts: query([], Vec(EmploymentContract), () => {
        return contractStorage.values().filter((contract) => contract.status === "COMPLETED");
    }),

    // Function to create a reserve job payment
    createReserveJobPay: update([text], Result(JobPay, Message), (contractId) => {
        // Implementation remains the same
    }),

    // Function to complete a job payment to worker
    completeJobPay: update([Principal, text, nat64, nat64, nat64], Result(JobPay, Message), async (worker, contractId, payPrice, block, memo) => {
        // Implementation remains the same
    }),

    // Function to verify payment
    verifyPayment: query([Principal, nat64, nat64, nat64], bool, async (receiver, amount, block, memo) => {
        // Implementation remains the same
    }),

    // Helper function to get address from the principal
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