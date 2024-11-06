import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUser, selectIsLoading } from '../../slices/burgerStoreSlice';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { Preloader } from '@ui';

export const Login: FC = () => {
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
        loginUser({
          email,
          password
        })
      ).unwrap();
    } catch (error) {
      if (error instanceof Error) {
        setErrorText(error.message);
      } else {
        setErrorText('Произошла ошибка при входе');
      }
    }
  };

  if (isLoading) return <Preloader />;

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
