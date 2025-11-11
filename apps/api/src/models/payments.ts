// import {Schema, model} from "mongoose";

// //This is an enum for the field types since they are constants
// enum FIELDTYPE {
//   SINGLE_LINE_TEXT,
//   MULTI_LINE_TEXT,
//   EMAIL,
//   PHONE,
//   URL,
//   NUMBER,
//   CURRENCY,
//   DATE,
//   BOOLEAN,
//   SINGLE_SELECT_RADIO,
//   SINGLE_SELECT_DROPDOWN,
//   MULTI_SELECT_DROPDOWN,
//   MULTI_SELECT_CHECKBOX,
// }

// //Interface to create an additional field.
// //This is created for better data validation, else we could have just done it from the from end.
// export interface IAdditionalFields {
//     fieldName: string;
//     fieldType: FIELDTYPE;
//     fieldOptions?: string[];
//     fieldLabel: string
// }

// //This is an interface/structure for businesses basic information (Both for users and clients)
// export interface IBusinessInfo {
//   businessLogo?: string;

//   basicInfo: {
//     vendorBusinessname: string;
//     town: string;
//     country: string;
//   };

//   taxInfo?: {
//     vatNo: number;
//   };

//   address?: {
//     country: string;
//     state: string;
//     town: string;
//     postalCode: number;
//     streetAddress: string;
//   };
// }

// export interface IInvoice {
//   title?: string;
//   subTitle?: string;
//   invoiceNo: number;
//   createdAt: Date;
//   dueAt?: Date;
//   additionFields?: IAdditionalFields[];

//   userBusinessInfo: {
//     businessInfo: IBusinessInfo;

//     additionalDetails?: {
//       forPreviousAndFutureInvoice: boolean;
//       onlyForFutureInvoice: boolean;
//     };
//   };

//   clentBusinessInfo: {
//     businessInfo: IBusinessInfo;

//     additionalDetails?: {
//         businessAlias: string;
//         uniqueKey: number;
//         email: string;
//         phoneNo: number;
//         showEmail: boolean;
//         showPhoneNo: boolean;
//         additionFields?: IAdditionalFields[];
//     };

//     accountDetails?: {}

//   };
