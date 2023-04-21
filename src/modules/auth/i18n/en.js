export default {
  auth: {
    shared: {
      logo: 'TwoRentals',
      email: 'E-mail',
      password: 'Password',
      backToLogin: 'Back To Login',
    },
    notifications: {
      confirmed: 'Your Account was confirmed successfully',
    },
    components: {
      forgotThankYou: {
        title: 'Please check your email inbox',
        hint: 'In a few minutes you will receive an email with a link to reset your password.',
      },
      phoneVerificationForm: {
        success: 'SMS-code has been sent successfully!',
      },
      phoneConfirmationForm: {
        success: 'Your phone number has been verified successfully!',
        timeEnded: 'SMS-code has expired',
      },
    },
    views: {
      signin: {
        title: 'Good to see you back!',
        hint: 'Please login to your account',
        forgotPassword: 'Forgot Password?',
        signIn: 'Sign in',
        orConnectWith: 'or connect with',
        google: 'Google',
      },
      forgotPassword: {
        title: 'Forgot your password?',
        hint: 'Enter your email address and follow the instructions',
        send: 'Send me reset password instructions',
      },
      changePassword: {
        title: 'Change password',
        hint: 'Password must contain: at least 8 characters, 1 upper case letter, 1 number',
        changePassword: 'Change my password',
        confirmPassword: 'Confirm password',
        success: 'Your password has been changed successfully!',
      },
      phoneVerification: {
        verify: {
          title: 'Verify Your Phone number!',
          description: 'To continue using our services you have to confirm your phone number',
          phoneNumber: 'Phone Number',
          submit: 'Send code',
        },
        confirm: {
          title: 'Confirm Your Phone Number!',
          description: 'Please, write the code from the sms to verify this number:',
          code: 'Code',
          submit: 'Confirm',
          change: 'change',
        },
      },
    },
  },
};
