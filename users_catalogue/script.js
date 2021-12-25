window.onload = () => {
  const getNewPerson = () => {
    const date = Date.now();
    return {
      id: `id_${date}`,
      name: `name_${date}`,
      country: `country_${date}`,
    }
  }

  var gun = Gun();
  window.gun = gun;

  gun
  .get('#user_catalogue_1')
  .on((indexedCatalogueOfPubKeys) => {
    delete indexedCatalogueOfPubKeys._;
    const allPubKeys = Object.values(indexedCatalogueOfPubKeys);

    const container = document.getElementById('all_people_container');
    container.innerHTML = '';

    allPubKeys.forEach(async (justSomePubKey) => {
      gun.user(justSomePubKey).get('profile').load(({ name, country }) => {
        let element = document.createElement('li');
        element.innerText = `${name} -> ${country}`;
        container.appendChild(element);
      })
    })
  })

  document
    .getElementById('create_random_user_button')
    .addEventListener('click', () => {
      const person = getNewPerson();

      gun.user().create(person.name, 'simplepassword123', async () => {
        // login as the registered user
        gun.user().auth(person.name, 'simplepassword123', () => {
          // put some data in a public profile
          gun.user().get('profile').put(person, async () => {
            // register the user in a content addressed node
            const pub = gun.user().is.pub;
            const hash = await SEA.work(pub, null, null, {name: "SHA-256"});
            gun.get('#user_catalogue_1').get(hash).put(pub);

            // logout
            gun.user().leave();
          });
        });
      });
  });
}