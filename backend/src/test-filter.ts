import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';

// Function to test transaction filters
async function testTransactionFilters() {
  try {
    // Login first to get JWT token
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: process.env.TEST_USER_EMAIL || 'user@example.com',
      password: process.env.TEST_USER_PASSWORD || 'password123',
    });

    const token = loginResponse.data.access_token;
    console.log('Successfully logged in and got JWT token');

    // Test different filter combinations
    const filters = [
      {
        name: 'All transactions',
        params: {},
      },
      {
        name: 'Income transactions only',
        params: { type: 'income' },
      },
      {
        name: 'Expense transactions only',
        params: { type: 'expense' },
      },
      {
        name: 'Transactions in January 2023',
        params: { startDate: '2023-01-01', endDate: '2023-01-31' },
      },
      {
        name: 'Transactions with amount >= 500',
        params: { minAmount: 500 },
      },
      {
        name: 'Transactions with amount <= 300',
        params: { maxAmount: 300 },
      },
      {
        name: 'Transactions with "payment" in description',
        params: { search: 'payment' },
      },
      {
        name: 'Complex filter: Income transactions in March 2023 with amount >= 1000',
        params: {
          type: 'income',
          startDate: '2023-03-01',
          endDate: '2023-03-31',
          minAmount: 1000,
        },
      },
    ];

    // Test each filter
    for (const filter of filters) {
      console.log(`\nTesting filter: ${filter.name}`);

      const response = await axios.get(`${API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filter.params,
      });

      console.log(`Found ${response.data.length} transactions`);

      // Log brief summary of each transaction
      response.data.forEach((tx: any, index: number) => {
        console.log(
          `${index + 1}. ${tx.type} - ${tx.amount} - ${tx.description} - ${new Date(tx.date).toISOString().split('T')[0]}`,
        );
      });
    }

    // Test statistics endpoint
    console.log('\nTesting statistics endpoint');
    const statsResponse = await axios.get(
      `${API_URL}/transactions/statistics`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    console.log('Statistics:', statsResponse.data);

    // Test date-filtered statistics
    console.log('\nTesting statistics with date filter (January 2023)');
    const dateStatsResponse = await axios.get(
      `${API_URL}/transactions/statistics`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          startDate: '2023-01-01',
          endDate: '2023-01-31',
        },
      },
    );

    console.log('Filtered Statistics:', dateStatsResponse.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
  }
}

// Run the test
testTransactionFilters().catch(console.error);
