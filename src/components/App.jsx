import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Section } from './section/Section';
import { FormaContacts } from './formaContacts/FormaContacts';
import { Filter } from './filter/Filter';
import { Contacts } from './contacts/Contacts';

const CONTACTS_LOCAL_sTORAGE_KEY = 'BI8886EB';

const getLocalData = (key, defaultValue) => {
  const localData = JSON.parse(
    localStorage.getItem(CONTACTS_LOCAL_sTORAGE_KEY)
  );
  console.log(localData);
  return localData ? localData[key] : defaultValue;
};

export const App = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [contacts, setContacts] = useState(
    getLocalData('contacts', [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ])
  );
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem(
      CONTACTS_LOCAL_sTORAGE_KEY,
      JSON.stringify({ contacts })
    );
  }, [contacts]);

  const handleChange = event => {
    const { value, name } = event.target;

    switch (name) {
      case 'name':
        setName(value);
        break;

      case 'number':
        setNumber(value);
        break;

      default:
        return;
    }
  };

  const hendleSubmit = event => {
    event.preventDefault();

    if (name.trim() === '') {
      alert('Name cannot be empty');
      return;
    }

    if (
      contacts.some(
        contact => contact.name === name || contact.number === number
      )
    ) {
      alert(`${name} is already in contacts`);
      return;
    }

    const newContact = { id: nanoid(), name: name, number: number };

    setContacts(prevContacts => [...prevContacts, newContact]);

    setName('');

    setNumber('');
  };

  const hendleChangeFilter = event => {
    const { value } = event.target;
    setFilter(value);
  };

  const andleDeleteContact = contactId => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== contactId)
    );
  };

  const applyFilters = () => {
    let filteredContacts = [...contacts];

    filteredContacts = filteredContacts.filter(({ name }) =>
      name.toUpperCase().includes(filter.toUpperCase().trim())
    );
    return filteredContacts;
  };

  return (
    <>
      <Section title={'Phonebook'}>
        <FormaContacts
          handleChange={handleChange}
          hendleSubmit={hendleSubmit}
          value={name}
          number={number}
        />
      </Section>
      <Section title={'Contacts'}>
        <Filter filter={filter} onChange={hendleChangeFilter} />
        <Contacts
          contacts={applyFilters()}
          onDeleteContact={andleDeleteContact}
        />
      </Section>
    </>
  );
};
