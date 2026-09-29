const cds = require('@sap/cds');
const { SELECT, UPDATE, INSERT } = require('@sap/cds/lib/ql/cds-ql');
const axios = require('axios');
module.exports = cds.service.impl(async function(){

// const prservice = await cds.connect.to('PR_SERVICE');
// this.on('getApprovedPRs', async (req) => {

// const prs = await prservice.run(
//     SELECT.from('headers_pro').where({ Status: 'Approved' })
// );
// });

//Rule 3 & Rule 4
// this.before('CREATE','po_header',async (req) => 
//     {
//     // const year = new Date().getFullYear();
//     // const pur_ord = `PO-${year}-`;
//     // const lastpo = await SELECT.one.from('purorder_header').columns('po_number').
//     // where(`po_number like '${pur_ord}%'`).orderBy('po_number desc');
    
//     // if(lastpo && lastpo.po_number){
//     //     const lastNumber = parseInt(lastpo.po_number.split('-')[2]);
//     //     next = lastNumber + 1;
//     // }
//     // const seq = String(next).padStart(6, '0');
//     // req.data.po_number = `${pur_ord}${seq}`;

//     const year1 = new Date().getFullYear();
//     const pur_ord1 = `PR-${year1}-`;
//     const lastpo1 = await SELECT.one.from('purorder_header').columns('pr_number').
//     where(`pr_number like '${pur_ord1}%'`).orderBy('pr_number desc');
    
//     if(lastpo1 && lastpo1.pr_number){
//         const lastNumber1 = parseInt(lastpo1.pr_number.split('-')[2]);
//         next = lastNumber1 + 1;
//     }
//     const seq1 = String(next).padStart(6, '0');
//     req.data.pr_number = `${pur_ord1}${seq1}`;
   
// });

this.before('CREATE', 'po_header', (req) => {
        const Status = req.data.status;
        if(!Status)
        {
            req.data.status = 'Draft';
        }
//Rule 12
    if(req.data.items){
        for(const i of req.data.items){
            i.taxRate = 0.18;
        }
    }

});

//Rule 8 & Rule 10 & Rule 13
this.before(['CREATE','UPDATE'],'po_header',async(req)=>{

    if(!req.data.vendorId){
        req.reject('Vendor ID is mandatory');
    }
    if(!req.data.vendorName){
        req.reject('Vendor Name is mandatory');
    }
    if(!req.data.vendorAddress){
        req.reject('Vendor Address is mandatory');

    }
    if(!req.data.vendorContact){
        req.reject('Vendor Contact is mandatory');
    }
    //Rule 17
    if(req.data.items.length > 5){
        req.reject('A Purchase Order cannot contain more than 5 items')
    }

    if(req.data.items){
        for(const i of req.data.items){
            if(i.quantity === null){
                req.reject('quantity should not be empty');
            }
            if(i.quantity <= 0)
            {
            req.reject('quantity should be greater than 0');            
            }
            if(i.unitPrice === null){
                req.reject('Unit Price Should not be empty');
            }
            if(i.unitPrice <= 0){
                req.reject('Unit Price should be greater than 0');
            }
        }
    }
});

//Rule 19
this.before('UPDATE','po_header',async(req)=>{
    const pur_ord = await SELECT.from('purorder_header').where({ID:req.params[0].ID})
    if(pur_ord[0].status !== 'Draft'){
        req.reject('It can only be updated if the status is Draft');
    }
});
//Rule 20
this.before(['UPDATE','DELETE'],'po_header',async(req)=>{
    const pur_ord = await SELECT.from('purorder_header').where({ID:req.params[0].ID})
    if(pur_ord[0].status !== 'Draft'){
        req.reject('It can only be deleted if the status is Draft');
    }
});

//Rule 18
this.before(['CREATE','UPDATE'],'po_header',async(req)=>{
    if(req.data.items){
        const prItems = new Set();
        for(const i of req.data.items){
            if(!i.poItemNumber){
                req.reject('PO Item Number is mandatory');
            }
            if(!i.prItemNumber){
                req.reject('PR Item Number is mandatory');
            }
            if(prItems.has(i.prItemNumber)){
                req.reject('The selected PR item already exists in this Purchase Order');
            }
            prItems.add(i.prItemNumber);
        }
    }
    //Rule 21
    if(req.data.items.length === 0){
        req.reject('Atleast one purchase item need to be there in the purchase order');
    }
});

// Rule 11
this.before(['CREATE','UPDATE'],'po_header',async(req)=>{
if(req.data.items){
    for(const i of req.data.items){
        i.netAmount = i.quantity * i.unitPrice;
        i.taxAmount = i.netAmount * i.taxRate;
        i.grossAmount = i.netAmount + i.taxAmount;
    //Rule 16
        if(i.deliveryDate < req.data.PO_date){
            req.reject('Delivery date cannot be greater than the Purchase Order date');
        }
        if(!req.data.PO_date){
            req.reject('PO Date is mandatory');
        }
        // const duplicate = await SELECT.one.from('purorder_items').where({po_ID : req.data.po_ID,prItemNumber : i.prItemNumber});
        // req.error(duplicate);
    }
}


// Rule 15
const vfrom = req.data.validfrom;
const vto = req.data.validto;
const pod = req.data.PO_date;
if(!vfrom || !vto){
    req.reject('valid from or valid to should not be empty');
}
if(vfrom > vto){
    req.reject('Valid From date cannot be greater than Valid To date');
}

});



//Rule 11
this.before(['CREATE','UPDATE'],'po_header',async(req)=>{
let TNA = 0;
if(req.data.items){
    for(const i of req.data.items){
        TNA = TNA + i.netAmount
    }
    req.data.TotalNetAmount = TNA ;
}
let TTA = 0;
for(const i of req.data.items){
        TTA = TTA + i.taxAmount
    }
    req.data.TotalTaxAmount = TTA ;
let TGA = 0;
for(const i of req.data.items){
        TGA = TGA + i.grossAmount
    }
    req.data.TotalGrossAmount = TGA ;


});


//Action buttons
//Rule 22
this.on('approve','po_header',async (req)=>{
    const pur_ord = await SELECT.from('purorder_header').where({ID:req.params[0].ID});
    if(pur_ord[0].status === 'Draft'){
        req.error('Purchase request Status can be approved after submitting');
    }
    if(pur_ord[0].status === 'Approved'){   
        req.notify('Purchase request Status is already approved');
    }
    //Rule 1 and Rule 3
    if(pur_ord[0].status === 'Submitted'){   
        // const year = new Date().getFullYear();
        // const pur_ord = `PO-${year}-`;
        // const lastpo = await SELECT.one.from('purorder_header').columns('po_number').
        // where(`po_number like '${pur_ord}%'`).orderBy('po_number desc');
    
        // if(lastpo && lastpo.po_number){
        //     const lastNumber = parseInt(lastpo.po_number.split('-')[2]);
        //     next = lastNumber + 1;
        //                 }
        // const seq = String(next).padStart(6, '0');
        // req.data.po_number = `${pur_ord}${seq}`;
        await UPDATE('purorder_header').set({status : 'Approved'}).where({ID:req.params[0].ID});
       const pur_ord1 = await SELECT.from('purorder_header').where({ID:req.params[0].ID});
        //Rule 30
        await INSERT.into('Notifications').entries({
            poid : pur_ord1[0].po_number,
            message : 'PO is Approved',
            notificationType : 'Approved',
            createdAt : new Date()
         });
        await INSERT.into('POStatusHistory').entries({
                po_sh: pur_ord1[0].po_number,
                oldStatus:pur_ord1[0].status,
                newStatus: 'Approved',
                user:req.user.id,
                timestamp: new Date(),
                comments: 'Approved Successfully'
            });
        req.notify('Purchase request Status approved successfully and purchase order created sucessfully');
    }
    if(pur_ord[0].status === 'Cancelled'){
        req.error('Purchase request Status cannot be approved after cancelled');
    }
    if(pur_ord[0].status === 'Rejected'){
        req.error('Purchase request Status cannot be approved after rejection');
    }
});
this.on('submit', 'po_header', async (req) => {
    const pur_ord = await SELECT.from('purorder_header').where({ ID: req.params[0].ID });

    if (pur_ord[0].status === 'Draft') {
        await UPDATE('purorder_header').set({status : 'Submitted'}).where({ID:req.params[0].ID});
         await INSERT.into('Notifications').entries({
            poid : pur_ord[0].po_number,
            message : 'PO is Submitted',
            notificationType : 'Submitted',
            createdAt : new Date()
         });
        //Rule 30
        await INSERT.into('POStatusHistory').entries({
                po_sh: pur_ord[0].po_number,
                oldStatus:pur_ord[0].status,
                newStatus: 'Submitted',
                user:req.user.id,
                timestamp: new Date(),
                comments: 'Submitted Successfully'
            });
        req.notify('Purchase request status is submitted successfully and Purchase Order can only be created from an approved Purchase Request');
    }

    if (pur_ord[0].status === 'Submitted') {
        req.notify('Purchase request Status is already submitted and Purchase Order can only be created from an approved Purchase Request');
    }

    if (pur_ord[0].status === 'Approved') {
        req.error('Purchase request Status cannot be submitted after approval');
    }

    if (pur_ord[0].status === 'Cancelled') {
        req.error('Purchase request Status cannot be submitted after cancellation');
    }

    if (pur_ord[0].status === 'Rejected') {
        req.error('Purchase request Status cannot be submitted after rejection and Purchase Order can only be created from an approved Purchase Request');
    }
});


this.on('reject', 'po_header', async (req) => {
    const pur_ord = await SELECT.from('purorder_header').where({ ID: req.params[0].ID });
    if (pur_ord[0].status === 'Draft') {
        req.error('Purchase request Status can be rejected after submitting and Purchase Order can only be created from an approved Purchase Request');
    }

    if (pur_ord[0].status === 'Submitted') {
        await UPDATE('purorder_header').set({status : 'Rejected'}).where({ID:req.params[0].ID});
        await INSERT.into('Notifications').entries({
            poid : pur_ord[0].po_number,
            message : 'PO is Rejected',
            notificationType : 'Rejected',
            createdAt : new Date()
         });
        //Rule 23 & Rule 30
                await INSERT.into('POStatusHistory').entries({
                po_sh: pur_ord[0].po_number,
                oldStatus:pur_ord[0].status,
                newStatus: 'Rejected',
                user:req.user.id,
                timestamp: new Date(),
                comments: req.data.comments
            });  
    
        req.notify('Purchase request Status rejected successfully and Purchase Order can only be created from an approved Purchase Request');
    }

    if (pur_ord[0].status === 'Approved') {
        req.error('Purchase request Status cannot be rejected after approval and Purchase Order can only be created from an approved Purchase Request');
    }

    if (pur_ord[0].status === 'Cancelled') {
        req.error('Purchase request Status cannot be rejected after cancellation and Purchase Order can only be created from an approved Purchase Request');
    }

    if (pur_ord[0].status === 'Rejected') {
        req.notify('Purchase request Status is already rejected and Purchase Order can only be created from an approved Purchase Request');
    }
});

//Rule 25
this.on('cancel', 'po_header', async (req) => {
    const pur_ord = await SELECT.from('purorder_header').where({ ID: req.params[0].ID });
    if (pur_ord[0].status === 'Draft') {
        await UPDATE('purorder_header').set({status : 'Cancelled'}).where({ID:req.params[0].ID});
        await INSERT.into('Notifications').entries({
            poid : pur_ord[0].po_number,
            message : 'PO is Cancelled',
            notificationType : 'Cancelled',
            createdAt : new Date()
         });
        //Rule 30
        await INSERT.into('POStatusHistory').entries({
                po_sh: pur_ord[0].po_number,
                oldStatus:pur_ord[0].status,
                newStatus: 'Cancelled',
                user:req.user.id,
                timestamp: new Date(),
                comments: 'Cancelled Successfully'
            });
        req.notify('Purchase request Status cancelled sucessfully and Purchase Order can only be created from an approved Purchase Request');
    }
    if (pur_ord[0].status === 'Submitted') {
        await UPDATE('purorder_header').set({status : 'Cancelled'}).where({ID:req.params[0].ID});
        await INSERT.into('Notifications').entries({
            poid : pur_ord[0].po_number,
            message : 'PO is Cancelled',
            notificationType : 'Cancelled',
            createdAt : new Date()
         });
        //Rule 30
        await INSERT.into('POStatusHistory').entries({
                po_sh: pur_ord[0].po_number,
                oldStatus:pur_ord[0].status,
                newStatus: 'Cancelled',
                user:req.user.id,
                timestamp: new Date(),
                comments: 'Cancelled Successfully'
            });
        req.notify('Purchase request Status cancelled sucessfully and Purchase Order can only be created from an approved Purchase Request');

    }
    if (pur_ord[0].status === 'Approved') {
        req.error('Purchase request Status cannot be cancelled after approval');
    }
    if (pur_ord[0].status === 'Cancelled') {
        req.notify('Purchase request Status is already cancelled and Purchase Order can only be created from an approved Purchase Request');
    } 
    if (pur_ord[0].status === 'Rejected') {
        req.error('Purchase request Status cannot be cancelled after rejection');
    }
});

//Rule 24
this.on('rework','po_header',async(req)=>{
const pur_ord = await SELECT.from('purorder_header').where({ ID: req.params[0].ID });
if (pur_ord[0].status === 'Draft') {
        req.error('It can be performed when the purchase request status is rejected only');
    }
    if (pur_ord[0].status === 'Submitted') {
        req.error('It can be performed when the purchase request status is rejected only');

    }
    if (pur_ord[0].status === 'Approved') {
      req.error('It can be performed when the purchase request status is rejected only');    
}
    if (pur_ord[0].status === 'Cancelled') {
        req.error('It can be performed when the purchase request status is rejected only');
    } 
    if (pur_ord[0].status === 'Rejected') {
        await UPDATE('purorder_header').set({status : 'Draft'}).where({ID:req.params[0].ID});
        
        //Rule 30
        await INSERT.into('POStatusHistory').entries({
                po_sh: pur_ord[0].po_number,
                oldStatus:pur_ord[0].status,
                newStatus: 'Draft',
                user:req.user.id,
                timestamp: new Date(),
                comments: 'Rejected purchase order moved to Draft successfully'
            });
        req.notify('Rejected purchase order moved to Draft successfully');
    }
});

//Validation for currencies
//Rule 14
    const validCurrencies = ['USD', 'EUR', 'INR','AUD','CAD'];
    this.before(['CREATE', 'UPDATE'], 'po_header', (req) => {
        const currency = req.data.Currency;
        if (!validCurrencies.includes(currency)) {
            req.error(`Invalid currency: ${currency}. Valid currencies are: ${validCurrencies.join(', ')}`);
        }
    });

async function fetchApprovedPRs() {
 
        const accessToken = await getPRAccessToken();
 
        // IMPORTANT:
        // Build the OData filter directly in the URL.
        const url = `${process.env.PR_SERVICE_URL}`;
        //?$filter=Status%20eq%20%27Approved%27`
        console.log("PR_URL",url);
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json'
            }
        });
          console.log("STATUS:", response.status);
          console.log("Odata:", response.headers["@odata.count"]);
        console.log("VALUE LENGTH:", response.data.value?.length);
console.log(
        "PR NUMBERS:",
        response.data.value?.map(pr => pr.pr_no)
    );
 console.log(
        "FULL RESPONSE:",
        JSON.stringify(response.data, null, 2)
    );

          console.log("DATA:", JSON.stringify(response.data, null, 2));

        return response.data.value || [];
    }
async function getPRAccessToken() {
        const response = await axios.post(
            process.env.PR_TOKEN_URL,
            new URLSearchParams({
                grant_type: 'client_credentials'
            }).toString(),
            {
                auth: {
                    username: process.env.PR_CLIENT_ID,
                    password: process.env.PR_CLIENT_SECRET
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return response.data.access_token;
    }

 this.on('READ', 'ApprovedPRs', async (req) => {
    try {
        console.log("======================================");
        console.log("READ ApprovedPRs");
        console.log("Incoming query:");
        console.log(JSON.stringify(req.query, null, 2));
        console.log("======================================");

        const prs = await fetchApprovedPRs();

        console.log("Received from PR:", prs.length);
        console.log(
            "Received PRs:",
            prs.map(pr => pr.pr_no)
        );

        const result = prs.map(pr => ({
            pr_no: pr.pr_no,
            req_name: pr.req_name,
            dept: pr.dept,
            Currency: pr.Currency,
            Total_amount: pr.Total_amount,
            Status: pr.Status
        }));

        console.log("Returning to PO client:", result.length);
        console.log(
            "Returning PRs:",
            result.map(pr => pr.pr_no)
        );

        return result;

    } catch (error) {
        console.error(
            'Failed to load Approved Purchase Requests:',
            error.message
        );

        return req.reject(
            502,
            'Unable to fetch Approved Purchase Requests'
        );
    }
});
 


 });