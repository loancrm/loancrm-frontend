export const projectConstantsLocal = {
  LEAD_STATUS: [
    { id: 0, name: 'all', displayName: 'All Leads' },
    { id: 1, name: 'new', displayName: 'New Leads' },
    { id: 2, name: 'archived', displayName: 'Archived Leads' },
  ],
  FILE_STATUS: [
    { id: 0, name: 'all', displayName: 'All Files' },
    { id: 3, name: 'files', displayName: 'New Files' },
    { id: 4, name: 'cni', displayName: 'CNI Files' },
  ],
  LOGIN_STATUS: [
    { id: 0, name: 'all', displayName: 'All Logins' },
    { id: 11, name: 'readyToLogin', displayName: 'Ready To Login' },
    { id: 12, name: 'filesInProcess', displayName: 'All Processed Files' },
  ],
  REJECTED_STATUS: [
    // { id: 0, name: 'all', displayName: 'All Rejects' },
    { id: 10, name: 'inHouseRejects', displayName: 'In House Rejects' },
    { id: 14, name: 'bankersRejects', displayName: 'Bankers Rejects' },
    { id: 15, name: 'cnis', displayName: 'CNIs' },
  ],
  BANKSSAVED_STATUS: [
    { id: 0, name: 'statusNotUpdated', displayName: 'Status Not Updated' },
    { id: 1, name: 'loginPending', displayName: 'Login Pending' },
    { id: 2, name: 'loginDone', displayName: 'Login Done' },
    { id: 3, name: 'camPending', displayName: 'CAM Pending' },
    { id: 4, name: 'pdPending', displayName: 'PD Pending ' },
    { id: 5, name: 'pdDone', displayName: 'PD Done' },
    { id: 6, name: 'recommending', displayName: 'Recommending' },
    { id: 7, name: 'approved', displayName: 'Approved' },
    { id: 8, name: 'rejected', displayName: 'Rejected' },
    { id: 9, name: 'hold', displayName: 'Hold' },
  ],
  APPROVALS_STATUS: [
    { id: 0, name: 'statusNotUpdated', displayName: 'Status Not Updated' },
    { id: 1, name: 'disbursed', displayName: 'Disbursed' },
    { id: 2, name: 'cnis', displayName: 'CNI' },
    { id: 3, name: 'hold', displayName: 'Hold' },
    { id: 4, name: 'agreement Done', displayName: 'Agreement Done' },
  ],
  PROCESS_CODES: [
    { id: 0, name: 'STARPOWERZ', displayName: 'STARPOWERZ' },
    { id: 1, name: 'FINBUD', displayName: 'FINBUD' },
    { id: 2, name: 'RULOANS', displayName: 'RULOANS' },
    { id: 3, name: 'ANDROMEDA', displayName: 'ANDROMEDA' },
  ],

  PRODUCT_TYPES: [
    { id: 1, name: 'UBL', displayName: 'UBL' },
    { id: 2, name: 'DOD', displayName: 'DOD' },
  ],
  CALLBACK_STATUS: [
    { id: 0, name: 'all', displayName: 'All Callbacks' },
    { id: 1, name: 'new', displayName: 'New Callbacks' },
    { id: 2, name: 'archived', displayName: 'Archived Callbacks' },
    { id: 3, name: 'converted', displayName: 'Converted Callbacks' },
  ],
  // CALLBACK_STATUS: [
  //   { id: 0, name: 'all', displayName: 'All Callbacks' },
  //   { id: 1, name: 'new', displayName: 'New Callbacks' },
  //   { id: 2, name: 'archived', displayName: 'Archived Callbacks' },
  // ],

  CALLBACK_STATUS_REPORTS: [
    { id: 1, name: 'new', displayName: 'New Callbacks' },
    { id: 2, name: 'archived', displayName: 'Archived Callbacks' },
  ],
  LENDERS_STATUS: [
    { id: 0, name: 'all', displayName: 'All Lenders' },
    { id: 1, name: 'new', displayName: 'New Lenders' },
    { id: 2, name: 'archived', displayName: 'Archived Lenders' },
  ],
  USER_STATUS: [
    { id: 0, name: 'all', displayName: 'All Users' },
    { id: 1, name: 'Active', displayName: 'Active Users' },
    { id: 2, name: 'Inactive', displayName: 'Inactive Users' },
  ],

  EMPLOYMENT_STATUS: [
    { id: 1, name: 'employed', displayName: 'Employed' },
    { id: 2, name: 'self-employed', displayName: 'Self Employed' },
  ],

  USER_TYPE: [
    { id: 1, name: 'Super Admin', displayName: 'Super Admin' },
    { id: 2, name: 'Admin', displayName: 'Admin ' },
    { id: 3, name: 'Tele Sales', displayName: 'Tele Sales' },
    { id: 4, name: 'Operational Team', displayName: 'Operational Team' },
    { id: 5, name: 'HR Admin', displayName: 'HR Admin' },
  ],
  BANK_DOCUMENTS_STATUS: [
    { id: 0, name: 'all', displayName: 'All Documents' },
    { id: 1, name: 'new', displayName: 'New Documents' },
    { id: 2, name: 'archived', displayName: 'Archived Documents' },
  ],
  BANKERS_STATUS: [
    { id: 0, name: 'all', displayName: 'All Lenders' },
    { id: 1, name: 'new', displayName: 'New Lenders' },
    { id: 2, name: 'archived', displayName: 'Archived Lenders' },
  ],

  LOAN_TYPES: [
    { id: 1, name: 'businessLoan', displayName: 'Business Loan' },
    { id: 2, name: 'personalLoan', displayName: 'Personal Loan' },
    { id: 3, name: 'homeLoan', displayName: 'Home Loan' },
    { id: 4, name: 'lap', displayName: 'LAP' },
  ],
  LEAD_INTERNAL_STATUS: [
    { id: '1', status: 'new', displayName: 'New' },
    { id: '2', status: 'archived', displayName: 'Archived' },
    { id: '3', status: 'files', displayName: 'Files' },
    { id: '4', status: 'cni', displayName: 'CNI' },
    { id: '5', status: 'creditEvaluation', displayName: 'Credit Evaluation' },
    { id: '6', status: 'login', displayName: 'Login' },
    { id: '7', status: 'approval', displayName: 'Approval' },
    { id: '8', status: 'disbursal', displayName: 'Disbursal' },
    { id: '9', status: 'rejected', displayName: 'Rejected' },
    { id: '10', status: 'inHouseRejects', displayName: 'In House Rejects' },
    { id: '11', status: 'readyForLogin', displayName: 'Ready For Login' },
    { id: '12', status: 'filesInProcess', displayName: 'Files In Process' },
    // { id: '13', status: 'partialFiles', displayName: 'Partial Files' },
    { id: '14', status: 'bankerRejects', displayName: 'Banker Rejects' },
    { id: '15', status: 'cni', displayName: 'CNI' },
    { id: '16', status: 'followups', displayName: 'Follow Ups' },
  ],

  CALLBACK_INTERNAL_STATUS: [
    { id: '1', status: 'new', displayName: 'New' },
    { id: '2', status: 'archived', displayName: 'Archived' },
    { id: '3', status: 'converted', displayName: 'Converted' },
  ],
  LEAD_INTERNAL_STATUS_REPORTS: [
    { id: '1', status: 'new', displayName: 'New Leads' },
    { id: '2', status: 'archived', displayName: 'Archived Leads' },
    { id: '16', status: 'followups', displayName: 'Follow Ups' },
    { id: '3', status: 'files', displayName: 'Files' },
    // { id: '4', status: 'partialFiles', displayName: 'Partial Files' },
    { id: '5', status: 'creditEvaluation', displayName: 'Credit Evaluation' },
    { id: '11', status: 'readyForLogin', displayName: 'Ready For Login' },
    { id: '10', status: 'inHouseRejects', displayName: 'In House Rejects' },
  ],

  TIMELINE_STATUS: [
    { index: 1, name: 'Draft', displayName: 'Draft' },
    { index: 2, name: 'ApprovalRequired', displayName: 'Approval Required' },
    { index: 3, name: 'CreditApproved', displayName: 'Credit Verified' },
    { index: 4, name: 'SchemeConfirmed', displayName: 'Scheme Confirmed' },
    { index: 5, name: 'BranchApproved', displayName: 'BM Approved' },
    { index: 6, name: 'ConsumerAccepted', displayName: 'Consumer Accepted' },
    { index: 7, name: 'Sanctioned', displayName: 'Sanctioned' },
    { index: 8, name: 'OperationsVerified', displayName: 'Operations Verify' },
  ],
  BUSINESS_ENTITIES: [
    { displayName: 'Proprietorship', name: 'proprietorship' },
    { displayName: 'Partnership', name: 'partnership' },
    { displayName: "LLP", name: "llp" },
    { displayName: 'Private Limited', name: 'privateLimited' },
  ],
  STATE_ENTITIES: [
    { displayName: 'Andhra Pradesh', name: 'andhra pradesh' },
    { displayName: 'Telangana', name: 'telangana' },
  ],
  BUSINESS_TURNOVER: [
    { displayName: 'Upto 1 Crore', name: 'upto 1 crore' },
    { displayName: '1 - 3 Crores', name: '1 - 3 crores' },
    { displayName: '3 - 5 Crores', name: '3 - 5 crores' },
    { displayName: '5 - 10 Crores', name: '5 - 10 crores' },
    { displayName: 'Above 10 Crores', name: 'above 10 crores' },
  ],
  YES_OR_NO: [
    { displayName: 'Yes', name: 'yes' },
    { displayName: 'No', name: 'no' },
  ],
  NATURE_OF_BUSINESS: [
    { displayName: 'Manufacturing', name: 'manufacturing' },
    { displayName: 'Trading - Distribution', name: 'trading - distribution' },
    { displayName: 'Trading - Wholesaler', name: 'trading - wholesaler' },
    { displayName: 'Trading - Retail', name: 'trading - retail' },
    { displayName: 'Service Provider', name: 'service provider' },
    { displayName: 'Constructions', name: 'constructions' },
  ],
  FILE_REMARKS: [
    { id: 1, status: 'will_share_documents', displayName: 'Will Share Documents' },
    { id: 2, status: 'received_partials', displayName: 'Received Partials' },
    { id: 3, status: 'roi_and_tenure_concern', displayName: 'ROI Concern & Tenure Concern' },
    { id: 4, status: 'client_not_responding', displayName: 'Client Not Responding to Calls' },
    { id: 5, status: 'client_out_of_station', displayName: 'Client Out of Station' },
    { id: 6, status: 'not_interested_presently', displayName: 'Present Not Interested' },
    { id: 7, status: 'low_vintage', displayName: 'Low Vintage' },
    { id: 8, status: 'multiple_banks_not_interested', displayName: 'Multiple Banks Not Interested' }
  ],

  // RAZORPAY_KEY_ID: "rzp_test_OryiPavGPST3CU",
  // BASE_URL: 'http://localhost:5002/',
  BASE_URL: 'https://rest.thefintalk.in:5002/',
  RAZORPAY_KEY_ID: "rzp_live_ZC5B0vsPZ7UxUs",
  VERSION_DESKTOP: '0.0.0',
};
