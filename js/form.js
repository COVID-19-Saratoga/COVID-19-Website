const addToFirebase = async (ref, obj) => {
  const { address } = obj;
  const { lat, lng } = await toCoords(address);
  const key = ref.push().key;
  const geoFire = new geofire.GeoFire(ref)
  await geoFire.set(`geo${key}`, [lat, lng]);

  ref.child(key).set(obj);
}

var submit = async function (section) {
  var name = $(`${section} #name`).val();
  var email = $(`${section} #email`).val();
  var address = $(`${section} #address`).val();
  var subject = $(`${section} #subject`).val();
  var message = $(`${section} #message`).val();

  await addToFirebase(refMarkers, { name, email, address, subject, message });
};

var submit2 = async function (section) {
  var name = $(`${section} #name2`).val();
  var email = $(`${section} #email2`).val();
  var address = $(`${section} #address2`).val();
  var phone = $(`${section} #phone`).val();
  
  await addToFirebase(refVolunteers, { name, email, address, phone });
};

const search = async section => {
  const address = $(`${section} #address3`).val();
  const center = await toCoords(address);
  const radius = 0.310686; // 0.5 mi in km

  geoFireVolunteers.query({ center, radius });

  geoFireVolunteers.on('key_entered', (key, location, distance) => {
    
  })
  // Add new section with loaded results ordered by distance and go to that section
};


$("#formbutton").click(async e => {
  e.preventDefault();
  console.log('IN SUBMIT');
  await submit('#input');
  location.reload();
});

$("#formbutton2").click(async e => {
  e.preventDefault();
  console.log('IN SUBMIT');
  await submit2('#input2');
  location.reload();
});

$("#searchbutton").click(e => {
  e.preventDefault();
  console.log('IN SUBMIT');
  search('#map2');
});
