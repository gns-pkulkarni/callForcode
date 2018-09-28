/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */


async function onRegisterComplaint(tx) {  // eslint-disable-line no-unused-vars

  	if (tx.newStatus !== 'Received') {
        throw new Error('While Registering a complaint NewStatus should be, "Received"');
    }
   	
  if (tx.asset.status != "") {
        throw new Error("Complaint's status is "+ tx.asset.status +" hence can not register a complaint.");
    }
  
    /*await userRegistry.getAll();*/
    // Save the old value of the asset.
    const oldValue = tx.asset.status;

    // Update the asset with the new value.
    tx.asset.status = tx.newStatus;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.example.basic.Complaint');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.asset);
	//Registering User Participant
  	const NS = 'org.example.basic';
  	const userRegistry = await getParticipantRegistry(NS + '.User');
  
    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.example.basic', 'ComplaintEvent');
    event.asset = tx.asset;
  	event.user = tx.user;
    event.oldValue = oldValue;
    event.newValue = tx.newStatus;
    emit(event);
  	alert("Fire complaint has been registered.");
}

/*
Logic of an event which confirms that either there is fire or not 
*/
async function onConfirmFire(tx) {
  const assetRegistry = await getAssetRegistry('org.example.basic.Complaint');
  const oldValue = tx.asset.status;
  
  if (tx.is_confirmed == 'True' && tx.asset.status == 'Received') {
    tx.asset.status = "In Progress(Fire Confirmed)";
    await assetRegistry.update(tx.asset);
    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.example.basic', 'ComplaintEvent');
    event.asset = tx.asset;
  	event.user = tx.user;
    event.oldValue = oldValue;
    event.newValue = "In Progress(Fire Confirmed)";
    emit(event);
    alert("Fire has been confirmed by participant,authorites will be informed shortly.");
  }
  else{
    if (tx.is_confirmed == 'False' && tx.asset.status == 'Received') {
      tx.asset.status = "Rejected(Fire Was Not Confirmed)";
      await assetRegistry.update(tx.asset);
      
      // Emit an event for the modified asset.
      let event = getFactory().newEvent('org.example.basic', 'ComplaintEvent');
      event.asset = tx.asset;
      event.user = tx.user;
      event.oldValue = oldValue;
      event.newValue = "Rejected(Fire Was Not Confirmed)";
      emit(event);
      alert("Fire has been not detected and complaint is rejected.");
    }
    else{
      throw new Error('is_confirmed should be either "True" or "False" and/or Complaint status should be "Received"');
    }
  }
}

/*
Logic of an event which confirms Authority is notified with fire information or not 
*/
async function onNotifyAuthorities(tx) {
  const assetRegistry = await getAssetRegistry('org.example.basic.Complaint');
  const oldValue = tx.asset.status;
  
  if (tx.is_autotity_notified == 'True' && tx.asset.status == 'In Progress(Fire Confirmed)') {
    tx.asset.status = "Done(Fire notification sent to Autorities)";
    await assetRegistry.update(tx.asset);
    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.example.basic', 'ComplaintEvent');
    event.asset = tx.asset;
  	event.user = tx.user;
    event.oldValue = oldValue;
    event.newValue = "Done(Fire notification sent to Autorities)";
    emit(event);
    alert("Authorities have been informed about Fire.");
  }
  else{
    if (tx.is_autotity_notified == 'False' && tx.asset.status == 'In Progress(Fire Confirmed)') {
      tx.asset.status = "In Progress(Notifying Autority is Pending!)";
      await assetRegistry.update(tx.asset);
      
      // Emit an event for the modified asset.
      let event = getFactory().newEvent('org.example.basic', 'ComplaintEvent');
      event.asset = tx.asset;
      event.user = tx.user;
      event.oldValue = oldValue;
      event.newValue = "In Progress(Notifying Autority is Pending!)";
      emit(event);
      alert("There is some problem while informing authorities , we will be contacting you shortly.");
    }
    else{
      throw new Error('is_autotity_notified should be either "True" or "False" and/or Complaint status should be "In Progress(Fire Confirmed)"');
    }
  }
}

/*
Creating dummy data for demo
*/
async function onSetupDemo() {
    const factory = getFactory();
    const NS = 'org.example.basic';

    // Adding 2 users Participants
   	const user = factory.newResource(NS, 'User', '10');
  	user.userName = 'Akshay';
    const userRegistry = await getParticipantRegistry(NS + '.User');
    await userRegistry.addAll([user]);

  	const user1 = factory.newResource(NS, 'User', '11');
  	user1.userName = 'Amol';
    const user1Registry = await getParticipantRegistry(NS + '.User');
    await user1Registry.addAll([user1]);
  
  	//End of code to add User Participants//
  
    // Adding 2 Complaint Assets
  	var today = new Date();
    const complaints = factory.newResource(NS, 'Complaint', '6');
  	complaints.status = '';
  	complaints.owner = factory.newRelationship(NS, 'User', user);
  	complaints.timestamp = today;
    const complaintReg = await getAssetRegistry(NS + '.Complaint');
    await complaintReg.addAll([complaints]);

  	const complaints1 = factory.newResource(NS, 'Complaint', '7');
  	complaints1.status = '';
  	complaints1.owner = factory.newRelationship(NS, 'User', user);
  	complaints1.timestamp = today;
    const complaintReg1 = await getAssetRegistry(NS + '.Complaint');
    await complaintReg1.addAll([complaints1]);
  
    //End of code to add Complaint Assets//
  	alert("Data has been created.");
    
}