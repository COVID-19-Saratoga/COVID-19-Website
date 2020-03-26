const geoFireVolunteers = new geofire.GeoFire(refVolunteers);
const nearbyVolunteersList = $('.nearby-volunteers-list');
const nearbyVolunteersLoadingSpinner = $('.nearby-volunteers-loading-spinner');

const SearchResult = ({ name, distance, email, phone }) => sanitize`
  <div class="nearby-volunteers-search-result">
    <img class="nearby-volunteers-search-result__avatar" src="//images.weserv.nl/?url=unavatar.now.sh/${email}&w=125&h=125&mask=circle">
    <address class="nearby-volunteers-search-result__contact-info">
      <h3 class="nearby-volunteers-search-result__name">${name}</h3>
      <h4 class="nearby-volunteers-search-result__distance">${distance} miles</h4>
      <h4 class="nearby-volunteers-search-result__email">${email}</h4>
      <h4 class="nearby-volunteers-search-result__phone">${phone}</h4>
    </address>
  </div> 
`;

const search = async section => {
  $('.nearby-volunteers-search-result').remove(); // remove all stale results
  nearbyVolunteersList.show();
  nearbyVolunteersLoadingSpinner.show();

  const address = $(`${section} #address3`).val();
  const { lat, lng } = await toCoords(address);
  const center = [lat, lng];
  const radius = 0.310686; // 0.5 mi in km

  const geoQuery = geoFireVolunteers.query({ center, radius });

  geoQuery.on('key_entered', async (geoKey, _, distance) => {
    const key = geoKey.substring('geo'.length);
    const snapshot = await refVolunteers.child(key).once('value');
    const { name, email, phone } = snapshot.val();

    nearbyVolunteersList.prepend(SearchResult({ name, distance, email, phone }));
  });

  // 'ready' means query is done
  geoQuery.on('ready', () => nearbyVolunteersLoadingSpinner.hide()); 
};