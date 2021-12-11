window.onload = () => {
  localStorage.clear();

  const getNewPerson = (gender) => {
    const date = Date.now();
    return {
      id: `id_${date}`,
      name: `name_${date}`,
      gender,
    }
  }

  var gun = Gun();

  gun.get('people').get('friends').open((data) => {
    const container = document.getElementById("all_people_container");
    container.innerHTML = '';

    const people = Object.values(data);
    people.forEach((person) => {
      let element = document.createElement('li');
      element.innerText = `${person.gender} -> ${person.name}`;
      container.appendChild(element);
    })
  })


  document.getElementById('male').addEventListener('click', () => {
    const someGuy = getNewPerson('male');
    const ref = gun.get('people').get('friends').get(someGuy.id).put(someGuy);
    gun.get('people').get('genderIndex').get('male').get(someGuy.id).put(ref);
  });

  document.getElementById('female').addEventListener('click', () => {
    const someGirl = getNewPerson('female');
    const ref = gun.get('people').get('friends').get(someGirl.id).put(someGirl);
    gun.get('people').get('genderIndex').get('female').get(someGirl.id).put(ref);
  });

  document.getElementById('load_male_only').addEventListener('click', () => {
    const container = document.getElementById("filtered_people_container");
    container.innerHTML = '';
    gun.get('people').get('genderIndex').get('male').load((data) => {
      const people = Object.values(data);
      people.forEach((person) => {
        let element = document.createElement('li');
        element.innerText = `${person.gender} -> ${person.name}`;
        container.appendChild(element);
      })
    })
  });

  document.getElementById('load_female_only').addEventListener('click', () => {
    const container = document.getElementById("filtered_people_container");
    container.innerHTML = '';
    gun.get('people').get('genderIndex').get('female').load((data) => {
      const people = Object.values(data);
      people.forEach((person) => {
        let element = document.createElement('li');
        element.innerText = `${person.gender} -> ${person.name}`;
        container.appendChild(element);
      })
    })
  });
}