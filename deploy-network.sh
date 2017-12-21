#!/bin/bash

composer runtime install --card PeerAdmin@hlfv1 --businessNetworkName loyalty-network

composer network start --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --archiveFile ./dist/loyalty-networkk.bna --file networkadmin.card

composer card import --file networkadmin.card

composer network ping --card admin@loyalty-network

