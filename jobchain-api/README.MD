jobchain-api
===================
This project contains the server side code for the distributed app, which will interact with the blockchain network to create and update records. 

Index&nbsp;
> **index.ts**
> Connects to the blockchain network and starts the server on port 3000.
> `>>> npm start`

BlockChainNetwork &nbsp;
> **./src/blockChainNetwork.ts**
> BlockChainNetwork class initiates the connection with the jobchain network using the `connect()` method. 
> References to the Participant and Asset registries are also contained within this class. Routes and actions interacting with the blockchain network use the registries to access records from the blockchain network.
> <small>Note: cardName and networkIdentifier should not be hardcoded. </small>
> Routes and actions interacting with the blockchain network can use the `factory` object to create Concept, Relationship or Resource objects.  For example:  
`factory.newResource('ca.jobchain','EducationHistory',educationHistory.educationHistoryId);`

AuthApi&nbsp;
> **./src/api/auth.api.ts** <br/>
> `authenticate` method authenticates the Person or Organization and logs them in. Responds with a jwt token containing the Person, or Organization object. <br/>
> `createPerson` validates and creates a new Person Participant on the blockchain network. <br/>
> `createOrganization` validates and creates a new Organization Participant on the blockchain network. <br/>

EducationHistoryApi&nbsp;
> **./src/api/educationHistory.api.ts**<br/>
>`createEducationHistory`<br/>
POST /education-history - Person creates a new education history record<br/>
> `updateEducationHistory`<br/>
PUT /education-history/:id - Organization updates the education history record after reviewing the education history record created by the Person.<br/>
> `getEducationHistories`<br/>
GET /education-history/person/:personId - Get Education History records related to the PersonId <br/>
GET /education-history/organization/:organizationId - Get Education History records related to the OrganizationId<br/>

WorkHistoryApi&nbsp;
> **./src/api/workHistory.api.ts**<br/>
> `createWorkHistory` <br/>
POST /work-history - Person creates a new work history record<br/>
> `updateWorkHistory`<br/>
PUT /work-history/:id - Organization updates the work history record after reviewing the work history record created by the Person.<br/>
> `getWorkHistories`<br/>
GET /work-history/person/:personId - Get Work History records related to the PersonId <br/>
GET /work-history/organization/:organizationId - Get Work History records related to the OrganizationId<br/>

PersonApi&nbsp;
> **./src/api/person.api.ts**<br/>
> `getPerson`<br/>
GET /person/:email - Searches a person by using the email address. <br/>

OrganizationApi&nbsp;
> **./src/api/organization.api.ts**<br/>
> `getOrganizations`<br/>
GET /organizations - Retrieves a list of all Organizations in the blockchain network.<br/>
> `getEducationOrgs`<br/>
GET /organizations/education - Retrieves a list of all Education Organizations in the blockchain network.<br/>
> `getCompanyOrgs`<br/>
GET /organizations/company - Retrieves a list of all Company Organizations in the blockchain network.<br/>
> `getOrganization`<br/>
GET /organization/:email - Searches an organization by using the email address. <br/>

Website&nbsp;
> **/www** folder<br/>
> This folder contains the bundled html,js,css files from jobchain-ui project. If the application is deployed, the files from this folder are served by the server.<br/>
