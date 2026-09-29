using po_srv from './pur_ordersrv';

// annotate po_srv.po_header with @UI.HeaderInfo :[ {
//     TypeName: 'Purchase Order',
//     TypeNamePlural: 'Purchase Orders',
//     Title: {
//         Value: po_number
//     },
//     Description: {
//         Value: vendorName
//     }
// }
// ];
annotate po_srv.po_header with @UI.SelectionFields :[
    po_number,pr_number,vendorId,status
];
annotate po_srv.po_header with @UI.LineItem : [
    { Label:'PO',Value:po_number},
    {
        Label: 'PR Number',
        Value: pr_number
    },
    {
        Label: 'Vendor ID',
        Value: vendorId
    },
    {
        Label: 'Vendor Name',
        Value: vendorName
    },
    {
        Label: 'Requester',
        Value: RequesterName
    },
    {
        Label: 'Status',
        Value: status
    },
    {
        Label:'Vendor Address',
        Value: vendorAddress
    },
    {
        Label:'Vendor Contact',
        Value: vendorContact
    },
    {
        Label: 'Department',
        Value: Department
    },
    {
        Label: 'PO Date',
        Value: PO_date
    },
    {
        Label: 'Valid From',
        Value: validfrom
    },
    {
        Label: 'Valid To',
        Value: validto
    },
    {
        Label: 'Currency',
        Value: Currency
    },
    {
        Label: 'Net Amount',
        Value: TotalNetAmount
    },
    {
        Label: 'Tax Amount',
        Value: TotalTaxAmount
    },
    {
        Label: 'Gross Amount',
        Value: TotalGrossAmount
    },
    {
        Label: 'Purchasing Group',
        Value: purchasingGroup
    },
    {
        Label: 'Buyer',
        Value: buyer
    },
    {
         Label: 'Payment Terms',
        Value: paymentTerms
    },
    {
        Label: 'Delivery Location',
        Value: deliveryLocation
    },
    {
        Label: 'Notes',
        Value: notes
    },
    {
        $Type : 'UI.DataFieldForAction',
        Action : 'submit',
        Label : 'Submit'
    },
    {
        $Type : 'UI.DataFieldForAction',
        Action : 'approve',
        Label : 'Approve'
    },
    {
        $Type : 'UI.DataFieldForAction',
        Action : 'reject',
        Label : 'Reject'
    },
    {
        $Type : 'UI.DataFieldForAction',
        Action : 'cancel',
        Label : 'Cancel'
    },
    {
        $Type : 'UI.DataFieldForAction',
        Action : 'rework',
        Label : 'Rework'
    }
];
annotate po_srv.po_header with @UI.Facets : [
{
    $Type : 'UI.ReferenceFacet',
    Label : 'Header Details',
    Target : '@UI.Identification#podetails'
},
{
    $Type : 'UI.ReferenceFacet',
    Label : 'Vendor Details',
    Target : '@UI.Identification#vendordetails'
},
{
    $Type : 'UI.ReferenceFacet',
    Label : 'Item Details',
    Target : 'items/@UI.LineItem#items'
}
];

annotate po_srv.po_header with @UI.Identification#podetails : [
    { Label:'PO',Value:po_number},
    {
        Label: 'PR Number',
        Value: pr_number
    },
    {
        Label: 'Requester',
        Value: RequesterName
    },
    {
        Label: 'Status',
        Value: status
    },
    {
        Label: 'Department',
        Value: Department
    },
    {
        Label: 'PO Date',
        Value: PO_date
    },
    {
        Label: 'Valid From',
        Value: validfrom
    },
    {
        Label: 'Valid To',
        Value: validto
    },
    {
        Label: 'Currency',
        Value: Currency
    },
    {
        Label: 'Net Amount',
        Value: TotalNetAmount
    },
    {
        Label: 'Tax Amount',
        Value: TotalTaxAmount
    },
    {
        Label: 'Gross Amount',
        Value: TotalGrossAmount
    },
    {
        Label: 'Purchasing Group',
        Value: purchasingGroup
    },
    {
        Label: 'Buyer',
        Value: buyer
    },
    {
         Label: 'Payment Terms',
        Value: paymentTerms
    },
    {
        Label: 'Delivery Location',
        Value: deliveryLocation
    },
    {
        Label: 'Notes',
        Value: notes
    },
    {
        $Type : 'UI.DataFieldForAction',
        Action : 'submit',
        Label : 'Submit'
    },
    {
        $Type : 'UI.DataFieldForAction',
        Action : 'approve',
        Label : 'Approve'
    },
    {
        $Type : 'UI.DataFieldForAction',
        Action : 'reject',
        Label : 'Reject'
    },
    {
        $Type : 'UI.DataFieldForAction',
        Action : 'cancel',
        Label : 'Cancel'
    },
    {
        $Type : 'UI.DataFieldForAction',
        Action : 'rework',
        Label : 'Rework'
    }
];

annotate po_srv.po_header with @UI.Identification#vendordetails : [
{
        Label: 'Vendor ID',
        Value: vendorId
    },
    {
        Label: 'Vendor Name',
        Value: vendorName
    },
    {
        Label:'Vendor Address',
        Value: vendorAddress
    },
    {
        Label:'Vendor Contact',
        Value: vendorContact
    },
];

annotate po_srv.po_items with @UI.LineItem#items : [
    {
        Label: 'PO Item Number',
        Value: poItemNumber
    },
    {
        Label: 'PR Item Number',
        Value: prItemNumber
    },
    {
        Label: 'Material Number',
        Value: materialNumber
    },
    {
        Label: 'Quantity',
        Value: quantity
    },
    {
        Label: 'Unit',
        Value: unit
    },
    {
        Label: 'Unit Price',
        Value: unitPrice
    },
    {
        Label: 'Tax Rate',
        Value: taxRate
    },
    {
        Label: 'Net Amount',
        Value: netAmount
    },
    {
        Label: 'Tax Amount',
        Value: taxAmount
    },
    {
        Label: 'Gross Amount',
        Value: grossAmount
    },
    {
        Label: 'Description',
        Value: description
    },
    {
        Label: 'Delivery Date',
        Value: deliveryDate
    },
    {
        Label: 'Delivery Location',
        Value: deliveryLocation
    },
    {
        Label: 'Item Status',
        Value: itemStatus
    },
    {
        Label: 'Consumed Quantity',
        Value: consumedQuantity
    },
    {
        Label: 'Remaining Quantity',
        Value: remainingQuantity
    }
];

annotate po_srv.po_items with @UI.Facets : [
    {
        $Type:'UI.ReferenceFacet',
        Label : 'Item Details',
        Target : '@UI.Identification'
    }
];

annotate po_srv.po_items with @UI.Identification :[
{
        Label: 'PO Item Number',
        Value: poItemNumber
    },
    {
        Label: 'PR Item Number',
        Value: prItemNumber
    },
    {
        Label: 'Material Number',
        Value: materialNumber
    },
    {
        Label: 'Quantity',
        Value: quantity
    },
    {
        Label: 'Unit',
        Value: unit
    },
    {
        Label: 'Unit Price',
        Value: unitPrice
    },
    {
        Label: 'Tax Rate',
        Value: taxRate
    },
    {
        Label: 'Net Amount',
        Value: netAmount
    },
    {
        Label: 'Tax Amount',
        Value: taxAmount
    },
    {
        Label: 'Gross Amount',
        Value: grossAmount
    },
    {
        Label: 'Description',
        Value: description
    },
    {
        Label: 'Delivery Date',
        Value: deliveryDate
    },
    {
        Label: 'Delivery Location',
        Value: deliveryLocation
    },
    {
        Label: 'Item Status',
        Value: itemStatus
    },
    {
        Label: 'Consumed Quantity',
        Value: consumedQuantity
    },
    {
        Label: 'Remaining Quantity',
        Value: remainingQuantity
    }
];

annotate po_srv.po_header with {
    Currency @Common.ValueListWithFixedValues:true
    @Common.ValueList: {
        CollectionPath: 'Currencies',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : Currency,
                ValueListProperty : 'ID'
            },
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : Currency,
                ValueListProperty : 'Name'
            }
        ]
    }
}

annotate po_srv.po_header with {
    pr_number 
    @Common.ValueList: {
        CollectionPath: 'ApprovedPRs',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : pr_number,
                ValueListProperty : 'pr_no'
            },
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : req_name,
                ValueListProperty : 'req_name'
            },
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : Status,
                ValueListProperty : 'Status'
            }
        ]
    }
}



