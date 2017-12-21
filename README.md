# Loyalty Network

> The Loyalty Network allows partners and members to transact using points earning offers. Members shop with the Partner businesses and will earn points for their loyalty. Members can then redem these points when Partner businesses off ponts redemption offers. The points are carried and tracked in a membership card. 

This business network defines:

**Participants**
`Partner` `Member`

**Assets**
`Card` `Offer`

**Transactions**
`IssuePoints` `RedeemPoints`

The `IssuePoints` transaction between a `Member` and a `Partner` will add points to the `Member`'s `Card` as specified in the `Offer`.

The `RedeemPoints` transaction between a `Member` and a `Partner` will reduce points in the `Member`'s `Card` as specified in the `Offer`.

To test this Business Network Definition in the **Test** tab:

Create a `Member` participant:

```
{
  "$class": "co.tyrell.loyalty.Member",
  "email": "life@mars.com",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "01-11-1975"
}
```

Create a `Partner` participant:

```
{
  "$class": "co.tyrell.loyalty.Partner",
  "partnerId": "4514",
  "partnerName": "Coles Supermarkets"
}
```

Create a `Card` asset using the above new `Member`'s email as the id:

```
{
  "$class": "co.tyrell.loyalty.Card",
  "cardNumber": "8623",
  "pointBalance": 0,
  "owner": "resource:co.tyrell.loyalty.Member#life@mars.com"
}
```

Create a `Offer` asset using the above new `Partner`'s partnerId as the id and pointsAmount set to 1:

```
{
  "$class": "co.tyrell.loyalty.Offer",
  "offerId": "3832",
  "pointsAmount": 1,
  "partner": "resource:co.tyrell.loyalty.Partner#4514"
}
```

Submit a `IssuePoints` transaction using the offerId from the above new `Offer` and cardNumber from the above new `Card`:

```
{
  "$class": "co.tyrell.loyalty.IssuePoints",
  "pointsOffer": "resource:co.tyrell.loyalty.Offer#3832",
  "receivingCard": "resource:co.tyrell.loyalty.Card#8623"
}
```

The `IssuePoints` transaction above will increase the pointBalance of the `Member`'s `Card` by 1 in the Asset Registry.

Congratulations!


## Running our Business Network

1. Install a runtime for our business network.

  `composer runtime install --card PeerAdmin@hlfv1 --businessNetworkName loyalty-points-network`

2. Deploy our network archive file (.bna) and start the business network.

  `composer network start -c PeerAdmin@hlfv1 --A admin -S adminpw -a ./dist/loyalty-network.bna -f networkadmin.card`

3. Import the business network card generated above into the composer.

  `composer card import -f networkadmin.card`

4. Ping the network to confirm that it's running.

  `composer network ping -c admin@loyalty-points-network`


If all went well, you will see a new Docker container spinning up.

```
  CONTAINER ID        IMAGE                                                                                                                       COMMAND                  CREATED             STATUS              PORTS                                            NAMES
  38c256b0e43a        dev-peer0.org1.example.com-loyalty-points-network-0.16.1-53f00d9f9c0a1a0da850bca1c48edcf1ed0607d9b5fb24b51944db551372b354   "chaincode -peer.a..."   4 minutes ago       Up 5 minutes                                                         dev-peer0.org1.example.com-loyalty-points-network-0.16.1
  fdf1ebde3533        hyperledger/composer-playground                                                                                             "pm2-docker compos..."   7 minutes ago       Up 8 minutes        0.0.0.0:8080->8080/tcp                           composer
  7f8f694dfcdf        hyperledger/fabric-peer:x86_64-1.0.4                                                                                        "peer node start -..."   7 minutes ago       Up 8 minutes        0.0.0.0:7051->7051/tcp, 0.0.0.0:7053->7053/tcp   peer0.org1.example.com
  d693bea5725a        hyperledger/fabric-couchdb:x86_64-1.0.4                                                                                     "tini -- /docker-e..."   7 minutes ago       Up 8 minutes        4369/tcp, 9100/tcp, 0.0.0.0:5984->5984/tcp       couchdb
  619a883e8852        hyperledger/fabric-ca:x86_64-1.0.4                                                                                          "sh -c 'fabric-ca-..."   7 minutes ago       Up 8 minutes        0.0.0.0:7054->7054/tcp                           ca.org1.example.com
  b1f381ee6934        hyperledger/fabric-orderer:x86_64-1.0.4                                                                                     "orderer"                7 minutes ago       Up 8 minutes        0.0.0.0:7050->7050/tcp                           orderer.example.com
```


### Generating the REST server

```
  Tyrells-MacBook-Air:loyalty-points-network tyrell$ composer-rest-server
  ? Enter the name of the business network card to use: admin@loyalty-points-network
  ? Specify if you want namespaces in the generated REST API: never use namespaces
  ? Specify if you want to enable authentication for the REST API using Passport: No
  ? Specify if you want to enable event publication over WebSockets: Yes
  ? Specify if you want to enable TLS security for the REST API: No

  To restart the REST server using the same options, issue the following command:
    composer-rest-server -c admin@loyalty-points-network -n never -w true

  Discovering types from business network definition ...
  Discovered types from business network definition
  Generating schemas for all types in business network definition ...
  Generated schemas for all types in business network definition
  Adding schemas for all types to Loopback ...
  Added schemas for all types to Loopback
  Web server listening at: http://localhost:3000
  Browse your REST API at http://localhost:3000/explorer
```
