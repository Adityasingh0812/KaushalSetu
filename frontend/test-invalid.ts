import { api } from './src/services/api.ts';

(async () => {
  try {
    await api.auth.login('wrong@example.com', 'wrong');
    console.log('ERROR: Login should have failed');
    process.exit(1);
  } catch (err: any) {
    if (err.message?.includes('Login failed: 401')) {
      console.log('Invalid credentials test passed');
    } else {
      console.log('Unexpected error:', err.message);
      process.exit(1);
    }
  }
})();