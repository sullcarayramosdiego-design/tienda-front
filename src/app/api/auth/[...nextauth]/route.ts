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
      console.log('SignIn callback:', { user, account, profile });
      
      // Si es login con Google, registrar/actualizar usuario en tu backend
      if (account?.provider === 'google' && profile?.email) {
        try {
          // TODO: Enviar datos a tu backend para crear/actualizar usuario
          // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
          //   method: 'POST',
          //   body: JSON.stringify({ email: profile.email, name: profile.name })
          // });
          console.log('Usuario Google autenticado:', profile.email);
        } catch (error) {
          console.error('Error al registrar usuario Google:', error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).provider = token.provider;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirigir a /catalog después del login exitoso
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return baseUrl + '/catalog';
    }
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
