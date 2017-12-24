jobchain-blockchain
===================
This project contains the definitions for chaincode, queries, transactions, contracts. It also contains a script to build the business network archive file (.bna file) and install it on to the composer runtime. 

> **./models/ca.jobchain.cto**
> Participants: Persons and Organizations
> Assets: WorkHistory and EducationHistory

> **./scripts.sh**
> Executes a series of commands which build the .bna file and installs the business network archive on to the composer runtime. 
> Finally it pings the runtime with the admin@jobchain card in order to test the business network archive is installed properly.
> 
> **permission.acl**
> Defines the access control logic for accessing the participants and assets on the blockchain network. 
> 
> **queries.qry**
> Contains a list of queries which can be used to quickly access the data on the blockchain network by leveraging the world-state data stored in CouchDB. 
> 
> **./copyModels.sh**
> Builds the typescript source code for the models used by the network (Person, Organization, WorkHistory, EducationHistory) and copies them to the models folders of jobchain-ui and jobchain-api folders so that the two subprojects can use the same model files.

Sequence Diagrams: WorkHistory
```sequence
Person->Company: Create WorkHistory
Note right of Company: Reviews WorkHistory
Company-->Person: Approves WorkHistory
```

Sequence Diagrams: EducationHistory
```sequence
Person->University: Create EducationHistory
Note right of University: Reviews EducationHistory
University-->Person: Approves EducationHistory
```