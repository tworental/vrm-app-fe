export default {
  account: {
    shared: {
      name: 'Name',
      email: 'E-mail',
      firstName: 'First Name',
      lastName: 'Last Name',
      address: 'Address',
      phoneNumber: 'Phone Number',
      country: 'Country',
      state: 'State',
      city: 'City',
      zip: 'ZIP',
      vatId: 'Vat ID',
      uiLanguage: 'UI Language',
      timezone: 'Timezone',
      oldPassword: 'Old Password',
      newPassword: 'New Password',
      repeatNewPassword: 'Repeat New Password',
      form: {
        details: {
          title: 'Details',
        },
        company: {
          title: 'Company Data',
        },
        settings: {
          title: 'Application Settings',
        },
        changePassword: {
          title: 'Password Change',
        },
        google: {
          title: 'Single Sign On',
          description: 'Enable Google SSO provider',
        },
      },
      btn: {
        save: 'Save',
        changePassword: 'Change Password',
      },
    },
    views: {
      main: {
        title: 'Profile',
      },
    },
    components: {
      detailsForm: {
        successUpdate: 'Your account has been updated successfully!',
      },
      settings: {
        successUpdate: 'Your account has been updated successfully!',
      },
      changePassword: {
        successUpdate: 'Your account has been updated successfully!',
      },
      googleSync: {
        disconnectConfirm: 'Are you sure you want to disconnect this Google Account?',
        connect: 'Connect with Google',
        disconnect: 'Disconnect Google',
        connected: 'Your Google account has been connected successfully!',
        disconnected: 'Your Google account has been disconnected successfully!',
      },
    },
    dicts: {
      languages: {
        en: 'English',
        ru: 'Russian',
      },
    },
  },
};
