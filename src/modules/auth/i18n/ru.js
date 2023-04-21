export default {
  auth: {
    shared: {
      logo: 'TwoRentals',
      email: 'Электронный адрес',
      password: 'Пароль',
      backToLogin: 'На вход',
    },
    notifications: {
      confirmed: 'Your Account was confirmed successfully',
    },
    components: {
      forgotThankYou: {
        title: 'Пожалуйста, проверьте свою электронную почту',
        hint: 'В течении нескольких минут Вы получите письмо с ссылкой для восстановления пароля.',
      },
    },
    views: {
      signin: {
        title: 'Рады видеть Вас снова!',
        hint: 'Пожалуйста, ввойдите в Ваш аккаунт',
        forgotPassword: 'Забыли пароль?',
        signIn: 'Ввойти',
        orConnectWith: 'либо войдите через',
        google: 'Google',
      },
      forgotPassword: {
        title: 'Забыли пароль?',
        hint: 'Введите Ваш электронный адресс и следуйте инструкциям',
        send: 'Отправить',
      },
      changePassword: {
        title: 'Изменить пароль',
        hint: 'Пароль должен содержать: хотя бы 8 символом, 1 заглавную букву и 1 число',
        changePassword: 'Изменить мой пароль',
        confirmPassword: 'Поджтверждение пароля',
        success: 'Ваш пароль был успешно изменён!',
      },
    },
  },
};
