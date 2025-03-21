'use client';

import type { User } from '@/types/user';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;

    // Make API request

    // We do not handle the API, so we'll check if the credentials match with the hardcoded ones.

	const requestBody = {
	  username: email,
	  password: password
	};

	try {
		
  		const response = await fetch('http://localhost:7001/trainos-admin/login', {
		    method: 'POST',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify(requestBody), // Convert object to JSON string
		});
	
		if (response.ok) {
			console.log('Successfully logged in');
			const data = await response.json();
    		localStorage.setItem('custom-auth-token', data.data.token);
			localStorage.setItem('token', data.data.token);
			localStorage.setItem('userId', data.data.userId);
			localStorage.setItem('fullName', data.data.fullName);
			localStorage.setItem('username', data.data.username);
		} else {
		   	console.error('Error login:', response.status);
			console.log(requestBody.username +" "+requestBody.password);
            return { error: 'Invalid credentials' };
		}
	} catch (error) {
	  console.error('Error login:', error);
	   console.log(requestBody.username +" "+requestBody.password);
	   return { error: 'Invalid credentials' };
	}

    /*if (email !== 'sofia@devias.io' || password !== 'Secret1') {
      return { error: 'Invalid credentials' };
    }*/

    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
