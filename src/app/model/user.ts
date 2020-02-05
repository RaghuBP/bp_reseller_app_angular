import { Address } from './address';
import { ContactDetails } from './contactDetails';

export class User {
  id: string;
  name : string;
  address : Address;
  contactDetails : ContactDetails;
  startDate : string;
  endDate : string;
}
