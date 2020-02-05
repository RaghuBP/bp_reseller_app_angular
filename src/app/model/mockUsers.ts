import { User } from './user';

export const USERS: User[] = [
  {id: '1', 
  name:'Uma',
  address: {buildingNumber: '11', addressLine1 : 'line1',
    addressLine2: 'line 2', city: 'chennai',
    state: 'TN', zipCode : '600001'},
  contactDetails: {primaryNumber: 'number1', secondaryNumber: 'number2',
    emailAddress: 'test@gmail.com'},
  startDate: 'date1',
  endDate: 'date2'
  }
];
