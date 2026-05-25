import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Aquí conectarías con tu backend API
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          // TODO: Llamar a tu API backend para validar credenciales
          // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {...})
          // return response.user;
          
          return {
            id: '1',
            email: credentials.email,
            name: 'Usuario',
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Solo validamos que el perfil exista para Google
      if (account?.provider === 'google' && !profile?.email) {
        return false;
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      // El objeto account solo está definido la primera vez que se inicia sesión
      if (account && user) {
        token.provider = account.provider;
        
        if (account.provider === 'google' && profile) {
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX || 'api/v1';
            
            const response = await fetch(`${apiUrl}/${apiPrefix}/auth/google`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                email: profile.email, 
                name: profile.name,
                googleId: account.providerAccountId,
                image: profile.image || user.image
              })
            });

            if (response.ok) {
              const data = await response.json();
              // Guardamos los tokens del backend en el token de NextAuth
              token.backendTokens = {
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
                user: data.data.user
              };
              console.log('Tokens del backend obtenidos exitosamente para Google auth');
            }
          } catch (error) {
            console.error('Error al obtener tokens del backend para Google:', error);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).provider = token.provider;
      }
      // Pasamos los tokens del backend a la sesión del cliente
      if (token.backendTokens) {
        (session as any).backendTokens = token.backendTokens;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirigir siempre a /catalog después del login exitoso (layout del cliente)
      return `${baseUrl}/catalog`;
    }
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
