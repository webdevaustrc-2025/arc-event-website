import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

// Custom adapter to handle:
// 1. Int IDs in database mapped to String IDs in NextAuth.
// 2. avatarUrl in database mapped to image in NextAuth.
export function CustomPrismaAdapter(p: PrismaClient) {
  const baseAdapter = PrismaAdapter(p);

  const mapUser = (user: any) => {
    if (!user) return null;
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.avatarUrl,
      role: user.role,
    };
  };

  return {
    ...baseAdapter,
    createUser: async (data: any) => {
      const dbUser = await p.user.create({
        data: {
          name: data.name || "",
          email: data.email,
          emailVerified: data.emailVerified,
          avatarUrl: data.image,
          role: "user",
        },
      });
      return mapUser(dbUser);
    },
    getUser: async (id: string) => {
      const numId = parseInt(id, 10);
      if (isNaN(numId)) return null;
      const dbUser = await p.user.findUnique({
        where: { id: numId },
      });
      return mapUser(dbUser);
    },
    getUserByEmail: async (email: string) => {
      const dbUser = await p.user.findUnique({
        where: { email },
      });
      return mapUser(dbUser);
    },
    getUserByAccount: async (provider_providerAccountId: any) => {
      const account = await p.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: provider_providerAccountId.provider,
            providerAccountId: provider_providerAccountId.providerAccountId,
          },
        },
        include: { user: true },
      });
      return account?.user ? mapUser(account.user) : null;
    },
    updateUser: async (user: any) => {
      const numId = parseInt(user.id, 10);
      if (isNaN(numId)) throw new Error("Invalid user ID");
      const dbUser = await p.user.update({
        where: { id: numId },
        data: {
          name: user.name !== undefined ? user.name : undefined,
          email: user.email !== undefined ? user.email : undefined,
          emailVerified: user.emailVerified !== undefined ? user.emailVerified : undefined,
          avatarUrl: user.image !== undefined ? user.image : undefined,
        },
      });
      return mapUser(dbUser);
    },
    deleteUser: async (id: string) => {
      const numId = parseInt(id, 10);
      if (isNaN(numId)) return;
      await p.user.delete({
        where: { id: numId },
      });
    },
    linkAccount: async (account: any) => {
      const numUserId = parseInt(account.userId, 10);
      if (isNaN(numUserId)) throw new Error("Invalid user ID");

      const data: any = {
        userId: numUserId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      };

      return await p.account.create({ data });
    },
    createSession: async (session: any) => {
      const numUserId = parseInt(session.userId, 10);
      if (isNaN(numUserId)) throw new Error("Invalid user ID");
      const dbSession = await p.session.create({
        data: {
          sessionToken: session.sessionToken,
          userId: numUserId,
          expires: session.expires,
        },
      });
      return {
        ...dbSession,
        userId: dbSession.userId.toString(),
      };
    },
    getSessionAndUser: async (sessionToken: string) => {
      const sessionAndUser = await p.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!sessionAndUser) return null;
      return {
        session: {
          ...sessionAndUser,
          userId: sessionAndUser.userId.toString(),
        },
        user: mapUser(sessionAndUser.user)!,
      };
    },
    updateSession: async (session: any) => {
      const data: any = {
        expires: session.expires,
      };
      if (session.userId) {
        const numUserId = parseInt(session.userId, 10);
        if (!isNaN(numUserId)) {
          data.userId = numUserId;
        }
      }
      const dbSession = await p.session.update({
        where: { sessionToken: session.sessionToken },
        data,
      });
      return {
        ...dbSession,
        userId: dbSession.userId.toString(),
      };
    },
  };
}
