export default {
  statistics: {
    components: {
      accommodationRevenue: {
        title: {
          income: 'Accommodation revenue',
          nights: 'Accommodation nights',
        },
        label: {
          income: 'The graph is showing your monthly revenue, based on the dates of the actual booking (not the actual stay)',
          nights: 'The graph is showing your monthly revenue, based on the dates of the actual booking (not the actual stay)',
        },
        revenue: 'Revenue',
        nights: 'Nights',
      },
      occupancyPerMonth: {
        title: 'Occupancy Per Month',
        label: 'The percentage of booked units per month',
      },
      paceReport: {
        title: 'Pace report',
        avg: 'Avg. Rate for {year}',
        total: 'Nights for {year}',
        nightsLabel: '{nights} nights',
        label: 'Shows number of booked nights with an average price',
      },
      reservationsPerCountry: {
        title: 'Reservations per country (%)',
        label: 'Shows number of reservations from a particular country for your properties',
        rate: '{rate} - Avg. Rate {price}',
        others: 'Others',
      },
    },
    views: {
      main: {
        title: 'Statistics',
        allProperties: 'All Properties',
        placeholder: {
          title: 'Statistics',
          description: 'You don\'t have any statistics yet',
          label: 'label',
        },
      },
    },
    dicts: {
      months: {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December',
      },
    },
  },
};
