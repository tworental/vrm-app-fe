export default {
  team: {
    shared: {
      email: 'E-mail',
    },
    views: {
      form: {
        title: 'Team',
        placeholders: {
          email: 'E-mail of your team member',
          role: 'Role',
          makeAdmin: 'Migrate account owner privilages',
          makeAdminTooltip: 'This action will move all owner privileges from your account to the user',
        },
        headers: {
          name: 'Name',
          description: 'Description',
          read: 'Read',
          write: 'Write',
          delete: 'Delete',
        },
        roles: {
          choose: '-- choose --',
          custom: 'Custom',
          read: 'Read',
          write: 'Write',
          delete: 'Full Access',
        },
        abilities: {
          account: {
            title: 'Account settings',
            description: 'Access to account settings',
          },
          billings: {
            title: 'Billings',
            description: 'Change or cancel the plan',
          },
          properties: {
            title: 'Properties',
            description: 'Managing to your properties and rates',
          },
          storage: {
            title: 'Storage',
            description: 'Store & uploading new files',
          },
          users: {
            title: 'Team',
            description: 'Access to your Team',
          },
          owners: {
            title: 'Owners',
            description: 'Manage new property owners',
          },
          bookings: {
            title: 'Bookings',
            description: 'Access to properties bookings',
          },
          statistics: {
            title: 'Statistics',
            description: 'View properties statistics',
          },
          integrations: {
            title: 'Integrations',
            description: 'Enable or disable 3rd part integrations',
          },
          documentsInvoices: {
            title: 'Documents Invoices',
            description: 'Access Documents Invoices module',
          },
          documentsExpenses: {
            title: 'Documents Expenses',
            description: 'Access Documents Expenses module',
          },
          documentsQuotes: {
            title: 'Documents Quotes',
            description: 'Access Documents Quotes module',
          },
          settings: {
            title: 'Application Settings',
            description: 'Access to the application settings',
          },
          channels: {
            title: 'Channel Manager',
            description: 'Access to Channel Manager',
          },
          websites: {
            title: 'Website Builder',
            description: 'Access to the website builder module',
          },
          guests: {
            title: 'Guests',
            description: 'Access to Guests Management',
          },
          companies: {
            title: 'Companies',
            description: 'Access to Companies Management',
          },
          reminders: {
            title: 'Reminders',
            description: 'Access to Reminders Management',
          },
          services: {
            title: 'Services',
            description: 'Access to Services Templates',
          },
          taxes: {
            title: 'Taxes',
            description: 'Access to Taxes Templates',
          },
          fees: {
            title: 'Fees',
            description: 'Access to Fees Templates',
          },
          rateSeasons: {
            title: 'Rate Seasons',
            description: 'Access to Seasons Rates Templates',
          },
          salesChannels: {
            title: 'Sales Channels',
            description: 'Access to Sales Channels',
          },
          customerContacts: {
            title: 'Customer Contacts',
            description: 'Access to Customer Contacts',
          },
        },
        actions: {
          save: 'Save',
          cancel: 'Cancel',
        },
        ownerAgreement: 'Please confirm moving your administrator role to another user. This action will decrease your privileges.',
      },
      main: {
        addUser: 'Add new Sub-User',
        placeholder: {
          title: 'Team',
          label: 'Label',
          description: 'Currently there are no users in your Team created',
        },
        table: {
          subuser: 'Sub-User',
          status: 'Status',
          lastLogin: 'Last login',
          actions: 'Actions',
          createdAt: 'Created at {date}',
          never: 'Never',
        },
        actions: {
          edit: 'Edit',
          delete: 'Delete',
          sendEmailConfirmation: 'Resend confirmation link',
          suspend: 'Suspend',
          unsuspend: 'Unsuspend',
        },
        deleteConfirm: 'Are you sure you want to delete this user?',
        emailSentSuccess: 'Confirmation link has been sent successfully!',
        suspendUserSuccess: 'User has been suspended successfully!',
        unsuspendUserSuccess: 'User has been unsuspended successfully!',
      },
    },
    components: {
      memberPermissionRole: {
        owner: 'Account Owner',
        custom: 'No privilages assigned | 1 privilage assigned | {count} privileges assigned',
      },
    },
  },
};
