import { api } from './src/services/api.ts';

(async () => {
  try {
    console.log('Testing login...');
    const result = await api.auth.login('trainee@example.com', 'Trainee123!');
    console.log('Login successful:', {
      accessToken: result.access_token.substring(0, 20) + '...',
      refreshToken: result.refresh_token.substring(0, 20) + '...'
    });

    console.log('Testing /me endpoint...');
    const user = await api.auth.me(result.access_token);
    console.log('User info:', {
      email: user.email,
      role: user.role,
      id: user.id
    });

    console.log('All tests passed!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();