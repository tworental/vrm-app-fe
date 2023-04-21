export default {
  integrations: {
    shared: {
      free: 'БЕСПЛАТНО',
      btn: {
        save: 'Сохранить',
        cancel: 'Отменить',
        activate: 'Активировать',
      },
    },
    components: {
      card: {
        status: {
          activated: 'Активирован',
          disabled: 'Отключён',
        },
      },
      mailchimp: {
        title: 'Mailchimp',
        description:
          'The Mailchimp app enables you to connect TwoRentals to your Mailchimp account. Activating the app will automatically show a newsletter subscription form on your website. Whenever a visitor signs up for your newsletter, the email will be added to your specified Mailchimp audience',
      },
      zapier: {
        title: 'Zapier',
        key: 'TwoRentals API-ключ',
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
        userId: 'Идентификатор пользователя TwoRentals',
        appKey: 'Ключ приложения TwoRentals',
        stepsToConnect: 'Как подключить',
        goToExternalRates: 'Перейти к внешним тарифам',
      },
    },
  },
};
