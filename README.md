# Basic Sample Business Network

> This is the "Sample Demonstration" of disaster management in case of Fire , build with Hyperledger Composer and Blockchain.

This business network defines:

**Participant**
`User`

**Asset**
`Complaint`

**Transaction**
`SetupDemo`,
`RegisterComplaint`,
`ConfirmFire`,
`NotifyAuthorities`

**Event**
`ComplaintEvent`

User is a Participant who can Register a Complaint of fire in a particular area by submitting RegComplaint transaction. Then another participant will confirm that there is an actual fire has happened by submitting FireConfirm transactoin. By submitting Done transaction system will notify required authorities like Ambulance,Fire Brigade, Police Station,Insurance Company,etc

To test this Business Network Definition in the **Test** tab:

Submit a `SetupDemo` transaction:

```
{
  "$class": "org.example.basic.SetupDemo"
}
```
Above will create a demo data for this project

Submit a `RegisterComplaint` transaction:

```
{
  "$class": "org.example.basic.RegisterComplaint",
  "asset": "resource:org.example.basic.Complaint#6",
  "user": "resource:org.example.basic.User#10",
  "newStatus": "Received"
}
```
Above will generate a transaction and will register a complaint of fire.

Submit a `ConfirmFire` transaction:

```
{
  "$class": "org.example.basic.ConfirmFire",
  "asset": "resource:org.example.basic.Complaint#6",
  "user": "resource:org.example.basic.User#3106",
  "is_confirmed": "True"
}
```
Above will generate a transaction and participant will confirm that there is a Fire.

Submit a `NotifyAuthorities` transaction:

```
{
  "$class": "org.example.basic.NotifyAuthorities",
  "asset": "resource:org.example.basic.Complaint#6",
  "user": "resource:org.example.basic.User#2424",
  "is_autotity_notified": "True"
}
```
Above will generate a transaction and system will confirm that required authorities like Ambulance,Fire Brigade, Police Station,Insurance Company,etc are notified.


After submitting this transaction, you should now see the transaction in the Transaction Registry and that a `ComplaintEvent` has been emitted.

Congratulations!