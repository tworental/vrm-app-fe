export default {
  integrations: {
    shared: {
      free: 'FREE',
      btn: {
        save: 'Save',
        cancel: 'Cancel',
        activate: 'Activate',
        connect: 'Connect',
      },
    },
    components: {
      card: {
        status: {
          activated: 'Activated',
          disabled: 'Disabled',
        },
      },
      mailchimp: {
        title: 'Mailchimp',
        heading: 'MailChimp integration',
        description:
          "Connect your TwoRentals account with Mailchimp to export guests' mail addresses into mailing lists that you have inside your MailChimp account. For a successful connection, you have to provide your MailChimp API key, which is located under Account > Extras > API Keys menu.",
        apiKey: 'API KEY',
        server: 'Server',
        listId: 'List',
        success: 'Mailchimp settings have been saved successfully!',
        connectRequired: 'You must create a connection before saving!',
      },
      zapier: {
        title: 'Zapier',
        key: 'TwoRentals Api Key',
        description: {
          0: 'The Zapier app enables you to connect your TwoRentals account to your Zapier account. Zapier allows you to connect your TwoRentals account to more than 500 external apps.',
          1: 'In order to connect TwoRentals to Zapier, please use this invitation link. If you already have a Zapier account, simply login to Zapier. If you do not have a Zapier account, you can sign up for a free trial.',
          2: 'While you are setting up TwoRentals within your Zapier account, Zapier will ask you to enter your TwoRentals API key. This is your personal TwoRentals API key:',
          3: 'Once you are connected you can start creating Zaps. Learn more about Zapier',
        },
      },
      stripe: {
        title: 'Stripe',
        description:
          'The Stripe Premium Integration app removes the 1% transaction fee that TwoRentals charges on Stripe payments.',
      },
      whiteLabel: {
        title: 'White Label',
        description:
          'The Whitelabel Email app allows you to use your own domain name for emails sent from within TwoRentals.',
      },
      privateLabel: {
        title: 'Private Label',
        description: 'Some description about privateLabel',
      },
      integromat: {
        title: 'Integromat',
        description: 'Some description about integromat',
      },
      priceLabs: {
        title: 'Price Labs',
        description: {
          0: 'PriceLabs is a powerful revenue management and dynamic pricing software for vacation and short-term rentals. Our integration allows you to import your rates from PriceLabs to enable smart pricing and increase revenue and occupancy.',
          1: 'Log in to PriceLabs, select "Connect to your Airbnb/PMS account" and choose TwoRentals as your PMS.',
          2: 'Copy and paste your TwoRentals user ID and API key and fill the form in PriceLabs.',
          3: 'After connecting your account, finalize set up by enabling external rates in TwoRentals.',
          4: 'Done!',
          5: 'The connection is complete. To send your rates to TwoRentals, go to PriceLabs and click "Sync all". This will export your rates to TwoRentals.',
        },
        userId: 'TwoRentals User Id',
        appKey: 'TwoRentals App Key',
        stepsToConnect: 'Steps to connect',
        goToExternalRates: 'Go to External Rates',
      },
    },
  },
};
