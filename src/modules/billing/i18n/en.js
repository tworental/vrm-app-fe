export default {
  billing: {
    subscription: {
      success: 'Success!',
    },
    components: {
      periodSwitcher: {
        upTo: 'up to {num}',
      },
    },
    views: {
      main: {
        title: 'Billing',
        heading: 'Plans & Pricing',
        chooseRentalsNumber: 'Choose your number of rentals:',
        chooseBillingPeriod: 'Choose your billing period:',
        chooseBestPlan: 'Choose your best plan',
        bestPlanDescription: 'Setup your best plan. Cancel anytime',
        recommended: 'Most Popular',
        choosePlan: 'Select',
        currentPlan: 'Current',
        monthlyDescription: 'Billed per month until you cancel',
        yearlyDescription: 'Per month, billed annually until you cancel',
        goBilling: 'Go Billing',
        pay: 'Pay',
        updateSubscriptionSuccess: 'Subscription has been updated successfully!',
        downgrade: 'Downgrade',
        upgrade: 'Upgrade',
      },
    },
    dicts: {
      period: {
        month: 'Monthly',
        year: 'Annual',
      },
      sections: {
        main: 'Main Features',
        channels: 'Channels',
      },
      features: {
        account: {
          module: {
            storage: {
              enabled: 'Storage',
              quota: 'Storage quota',
            },
            team: {
              enabled: 'Team',
              limit: 'Team limit',
            },
            owners: {
              enabled: 'Owners',
            },
            rateSeasons: {
              limit: 'Season Rates limit',
            },
            documents: {
              invoices: {
                enabled: 'Document Invoices',
              },
            },
            statistics: {
              enabled: 'Statistics',
            },
            websites: {
              enabled: 'Websites',
            },
            integrations: {
              enabled: 'Integrations',
            },
            services: {
              enabled: 'Services',
              limit: 'Services limit',
              reminders: {
                enabled: 'Service Reminders',
                limit: 'Service Reminders limit',
              },
            },
            fees: {
              enabled: 'Fees',
              limit: 'Fees limit',
            },
            taxes: {
              enabled: 'Taxes',
              limit: 'Taxes limit',
            },
            properties: {
              limit: 'Properties limit',
              unitTypes: {
                limit: 'Property Unit Types limit',
                rateSeasons: {
                  limit: 'Unit Type Season Rates limit',
                },
              },
              units: {
                limit: 'Property Units limit',
              },
            },
            channels: {
              enabled: 'Channels',

              channex: {
                enabled: 'Channex',
              },
            },
          },
        },
      },
      plans: {
        basic: {
          title: 'Basic',
          description: 'The basic service with extra features',
        },
        professional: {
          title: 'Professional',
          description: 'The professional service with extra features',
        },
        enterprise: {
          title: 'Enterprise',
          description: 'The enterprise service with extra features',
        },
      },
    },
  },
};
