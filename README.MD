JobChain
===================
Registry for Work and Education history, built on the BlockChain.

<small>*Note: This project and source code is for demonstration purposes only!*</small>

This primary repository consists of three projects.

jobchain-blockchain
-------------
This project contains the definitions for chaincode, queries, transactions, contracts. It also contains a script to build the business network archive file (.bna file) and install it on to the composer runtime. 
<pre>
>>> npm start
</pre>

jobchain-api
-------------
This project contains the server side code for the distributed app, which will interact with the blockchain network to create and update records. 
<pre>
>>> npm start
</pre>

jobchain-api
-------------
This project contains the server side code for the distributed app, which will interact with the blockchain network to create and update records. 
<pre>
>>> npm start
</pre>

jobchain-ui
-------------
This project contains the client side code for the distributed app, which will allow the users to create user records for Organizations, or Individuals. It allows individuals to create work and education history records (assets) which can be verified by the associated Organization. 
<pre>
>>> npm start
</pre>

<small>For simplicity this application is built to allow both Individuals and Organizations (Companies/Education Institutions) access the blockchain network. However it is possible for two or three organizations to create server-side/client-side applications which interact with the blockchain network, for example: Workers Union Organization that builds and manages the application on behalf of Employees, Education Union that manages the application for Education Organizations, and lastly, Workplaces Union that builds and manages the application for Companies.</small>

<b>Prerequisites:</b>

    - Operating Systems: Ubuntu Linux 14.04 / 16.04 LTS (both 64-bit), or Mac OS 10.12
    - Docker Engine: Version 17.03 or higher
    - Docker-Compose: Version 1.8 or higher
    - Node: 8.9 or higher (note version 9 is not supported)
    - npm: v5.x
    - git: 2.9.x or higher
    - Python: 2.7.x
    - IDE. eg. vscode, atom etc.
