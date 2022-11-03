import { FC } from 'react';
import { useState, useEffect } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';

import { Image, User, Account } from '../types';
import { Table, Filters, Sort, Search, Row } from './components';
import { getImages, getUsers, getAccounts } from './mocks/api';
import rows from './mocks/rows.json';

import styles from './App.module.scss';

// mockedData has to be replaced with parsed Promises’ data
const mockedData: Row[] = rows.data;

const dataConverter = (
  users: User[],
  accounts: Account[],
  images: Image[]
): Row[] => {
  let rows: Row[] = users.map(user => {
    let image = images.find(img => user.userID === img.userID);
    let account = accounts.find(acc => user.userID === acc.userID);
    return {
      username: user.username,
      country: user.country,
      name: user.name,
      avatar: image?.url,
      posts: account?.posts,
      lastPayments: account?.payments[0].totalSum,
    };
  });
  return rows;
};

export const App: FC = () => {
  const [data, setData] = useState<Row[]>(undefined);

  useEffect(() => {
    // fetching data from API
    Promise.all([getImages(), getUsers(), getAccounts()]).then(
      ([images, users, accounts]: [Image[], User[], Account[]]) => {
        const rows = dataConverter(users, accounts, images);
        setData(rows);
      }
    );
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <div className="App">
        <div className={styles.container}>
          <div className={styles.sortFilterContainer}>
            <Filters />
            <Sort />
          </div>
          <Search />
        </div>
        <Table rows={data || mockedData} />
      </div>
    </StyledEngineProvider>
  );
};
