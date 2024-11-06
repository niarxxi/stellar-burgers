import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import {
  registerUser,
  fetchUserProfile,
  selectIsLoading
} from '../../slices/burgerStoreSlice';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      await dispatch(
        registerUser({
          email,
          password,
          name: userName
        })
      ).unwrap();

      await dispatch(fetchUserProfile()).unwrap();
    } catch (error) {
      if (error instanceof Error) {
        setErrorText(error.message);
      } else {
        setErrorText('Произошла ошибка при регистрации');
      }
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
