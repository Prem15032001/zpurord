namespace poms;
using { cuid } from '@sap/cds/common';
entity purorder_header : cuid {
po_number:String(30) @readonly;
pr_number:String(30);
vendorId : String(7);
vendorName : String(50);
vendorAddress : String(70);
vendorContact : String(10);
status : String(9) @readonly;
RequesterName : String(25);
Department : String;
PO_date : Date;
validfrom : Date;
validto:Date;
Currency : String(3);
TotalNetAmount : Decimal @readonly;
TotalTaxAmount : Decimal @readonly;
TotalGrossAmount : Decimal @readonly;
purchasingGroup     : String;
buyer               : String;
paymentTerms        : String;
deliveryLocation     : String;
notes               : String;
items               : Composition of many purorder_items
                            on items.po = $self;
//status_history : Composition of many POStatusHistory on status_history.poh = $self;
}

entity purorder_items:cuid {
poItemNumber        : String(15);
prItemNumber        : String(15);
materialNumber      : String(15);
description         : String(50);
quantity            : Decimal;
unit                : String(3);
unitPrice           : Decimal;
//Rule 12
taxRate             : Decimal  default 0.18 @readonly;
netAmount           : Decimal @readonly;
taxAmount           : Decimal @readonly;
grossAmount         : Decimal @readonly;
deliveryDate        : Date;
deliveryLocation    : String;
itemStatus          : String;
consumedQuantity    : Decimal;
remainingQuantity   : Decimal;
po                  : Association to purorder_header;
}

entity Currencies {
    key ID : String(3);
    Name   : String(20);
}

entity POStatusHistory : cuid {
    //poh : Association to purorder_header;
    po_sh:String(15);
    oldStatus : String(20);
    newStatus : String(20);
    user : String(30);
    timestamp : Timestamp;
    comments : String(70);
}

entity Notifications : cuid {
   // pur_ord : Association to purorder_header;
    poid : String(15);
    recipient : String(100) default 'Buyer';
    message : String(500);
    notificationType : String(30);
    createdAt : Timestamp;
    isRead : Boolean default false;
}

entity ApprovalMatrix : cuid {
    minimumAmount : Decimal;
    maximumAmount : Decimal;
    approverRole : String(50);
    active : Boolean default true;
}

entity Attachments : cuid {
    po : Association to purorder_header;
    fileName : String(255);
    fileType : String(50);
    fileSize : Integer;
    content : LargeBinary;
    uploadedBy : String(100);
    uploadedAt : Timestamp;
}
