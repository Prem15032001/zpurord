using poms  from '../db/pur_order';
service po_srv {
    @odata.draft.enabled
    entity po_header as projection on poms.purorder_header
    actions {
        action submit() returns String;
        action approve() returns String;
        action reject(comments : String(70) @mandatory) returns String;
        action cancel() returns String;
        action rework() returns String;
    }
    entity po_items as projection on poms.purorder_items;
    entity po_history as projection on poms.POStatusHistory;
    entity Currencies as projection on poms.Currencies;
    entity notify as projection on poms.Notifications;
    entity ApprovedPRs {
    key pr_no        : String(30);
    req_name         : String(30);
    dept             : String(20);
    Currency         : String(3);
    Total_amount     : Decimal(15,2);
    Status           : String(10);
}


}
