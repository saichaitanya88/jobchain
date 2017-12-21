import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace ca.jobchain{
   export class Credentials {
      email: string;
      password: string;
   }
   export class Address {
      address: string;
   }
   export enum OrganizationType {
      Company,
      Education,
   }
   export class Person extends Participant {
      personId: string;
      firstName: string;
      lastName: string;
      credentials: Credentials;
      phone: string;
      description: string;
   }
   export class Organization extends Participant {
      organizationId: string;
      name: string;
      address: Address;
      description: string;
      credentials: Credentials;
      verified: boolean;
      organizationTypes: OrganizationType[];
   }
   export class WorkHistory extends Asset {
      workHistoryId: string;
      title: string;
      description: string;
      startDate: Date;
      endDate: Date;
      verified: boolean;
      owner: Person;
      organization: Organization;
   }
   export class EducationHistory extends Asset {
      educationHistoryId: string;
      title: string;
      description: string;
      startDate: Date;
      endDate: Date;
      verified: boolean;
      owner: Person;
      organization: Organization;
   }
// }
