export default {
  documents: {
    shared: {
      paid: 'Paid',
      unpaid: 'Unpaid',
    },
    views: {
      main: {
        title: 'Documents',
        locations: {
          accountancy: 'Accountancy',
        },
        links: {
          invoices: 'Invoices',
        },
      },
      invoices: {
        title: 'Invoices',
        placeholder: {
          title: 'INVOICES',
          label: 'label',
          description: 'Currently there are no invoices!',
        },
        add: 'Create new Invoice',
        invoiceNo: 'Number',
        invoiceType: 'Type',
        invoiceDate: 'Date',
        buyerName: 'Guest',
        totalAmount: 'Total amount',
        isPaid: 'Is Paid',
        status: 'Status',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        download: 'Download',
        deleteConfirm: 'Are you sure you want to delete this invoice?',
        deleteSuccess: 'An invoice has been deleted successfully!',
      },
      invoicesForm: {
        titleCreate: 'Create Invoice',
        titleUpdate: 'Update Invoice',
        invoiceDate: 'Invoice Date',
        dueDate: 'Due Date',
        paymentType: 'Payment Type',
        buyerName: 'Buyer Name',
        buyerTaxId: 'Buyer Tax ID',
        buyerAddress: 'Buyer Address',
        buyerCountry: 'Buyer Country',
        buyerCity: 'Buyer City',
        buyerZip: 'Buyer Zip',
        sellerName: 'Seller Name',
        sellerTaxId: 'Seller Tax ID',
        sellerAddress: 'Seller Address',
        sellerCountry: 'Seller Country',
        sellerCity: 'Seller City',
        sellerZip: 'Seller Zip',
        notes: 'Notes',
        invoiceNo: 'Invoice Number',
        cancel: 'Cancel',
        saveAsDraft: 'Save Draft',
        saveAsIssued: 'Issue',
        table: {
          name: 'Name',
          quantity: 'Qty',
          price: 'Price',
          discount: 'Discount',
          amount: 'Amount',
          tax: 'Tax',
          total: 'Total',
          addItem: 'Add Item',
          totalAmount: 'Total: {num}',
        },
        currency: 'Currency',
        successSave: 'Invoice has been saved successfully!',
      },
    },
    dicts: {
      invoices: {
        statuses: {
          draft: 'Draft',
          issued: 'Issued',
        },
        types: {
          invoice: 'Invoice',
          proForma: 'Pro Forma',
          correction: 'Correction',
        },
        paymentTypes: {
          cash: 'Cash',
          check: 'Check',
          cc: 'Credit Card',
          bankTransfer: 'Bank Transfer',
          online: 'Online',
          mobile: 'Mobile',
          auto: 'Auto',
        },
      },
    },
  },
};
