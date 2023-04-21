export default {
  calendar: {
    components: {
      gstc: {
        searchLabel: 'Select unit types',
      },
      scheduler: {
        collision: 'You can\'t have two bookings at once',
        notAvailableRange: 'This range is not available',
        updatedSuccess: 'This booking has been saved successfully!',
        newBooking: 'New Booking',
        tooltip: {
          details: 'Booking Details',
          period: 'Period:',
          guest: 'Guest:',
          amount: 'Amount:',
          checkGuest: 'Check in/out:',
        },
      },
    },
    views: {
      main: {
        addRental: 'Add New Rental',
        addReservation: 'Add Reservation',
        groupReservation: 'Group Reservation',
        placeholder: {
          title: 'Calendar',
          description: 'Currently there are no Rentals created',
          label: 'label',
        },
      },
    },
  },
};
