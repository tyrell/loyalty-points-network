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
  "firstName": "John",ß
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
