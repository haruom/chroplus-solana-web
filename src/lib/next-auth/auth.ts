import { redirect } from "next/navigation";
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from '@prisma/client'
import { TokenSet } from "@auth/core/types";

const prisma = new PrismaClient();

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  providers: [{
    userinfo: 'https://api.ouraring.com/v2/usercollection/personal_info',
    type: 'oauth',
    profile: async (profile, tokens) => {
      // データの例
      // profile = {
      //   id: '7b70d750d968d-e3441a92d2ad949a--0ae2',
      //   age: 31, weight: 66, height: 1.9, biological_sex: 'male',
      //   email: 'ebi@example.com',
      // };
      // tokens = {
      //   access_token: '7ZWDT93WM2DA6RC9QTBEFEGV6M6VDQMC',
      //   token_type: 'Bearer',
      //   expires_at: 1706959796, // トークン取得から24時間後
      //   refresh_token: 'XZ9XL4MD2R4UQ3QGLGTMS7TSE2WU4RDT',
      // };
      const { id, email } = profile;

      await updateTokensByOuraId(id, tokens);

      return {
        id, email,
      };
    },
    id: 'oura',
    name: 'Oura',
    checks: ['state'],
    authorization: {
      url: 'https://cloud.ouraring.com/oauth/authorize',
      // TODO: Ouraによると指定しない場合は全部要求したことになるらしいので、そっちの方がいいかも
      params: { scope: 'email personal daily heartrate workout tag session spo2' }
    },
    token: 'https://api.ouraring.com/oauth/token',
  }],
});

export async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw 'no_session';
  }

  return session.user.id
}

// ----- 認証関連のDB操作 -----

export async function logoutAndGoHome() {
  try {
    const userId = await getUserId();
    await prisma.session.deleteMany({
      where: { userId },
    });
  } finally {
    redirect("/");
  }
}

export type AccountData = Awaited<ReturnType<typeof prisma.account.findFirst>>;

export async function findOuraAccountByUserId(userId: string) {
  return await prisma.account.findFirst({
    where: {
      userId: userId,
      provider: "oura",
    },
    orderBy: { expires_at: "desc" },
  });
}

export async function updateTokens(account: NonNullable<AccountData>, tokens: TokenSet) {
  await prisma.account.update({
    data: toTokenUpdateData(tokens),
    where: { id: account.id },
  });
}
async function updateTokensByOuraId(ouraId: string, tokens: TokenSet) {
  await prisma.account.updateMany({
    data: toTokenUpdateData(tokens),
    where: { providerAccountId: ouraId, provider: 'oura' },
  });
}
function toTokenUpdateData(tokens: TokenSet) {
  const { access_token, expires_at, refresh_token } = tokens;
  return { access_token, expires_at, refresh_token }
}
