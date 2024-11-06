import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect } from 'react';
import { Preloader } from '@ui';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { useForm } from '../../hooks/useForm';
import {
  selectIsLoading,
  selectUserData,
  updateUserProfile
} from '../../slices/burgerStoreSlice';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUserData);
  const isLoading = useAppSelector(selectIsLoading);

  const {
    values: formValue,
    handleChange,
    setValues: setFormValue
  } = useForm({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user, setFormValue]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUserProfile(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleChange}
    />
  );
};
