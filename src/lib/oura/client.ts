import { AccountData, findOuraAccountByUserId, getUserId, updateTokens } from "../next-auth/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const baseUrl = 'https://api.ouraring.com/v2/usercollection/';

/**
 * OuraのAPIにリクエストを飛ばす部分を共通化したもの
 * @param accountId 開発用
 * @returns 
 */
async function call<ResponseData>(url: string, accountId?: string) {
  const access_token = await getToken(accountId);

  const res = await fetch(url, {
    method: 'GET',
    headers: [['Authorization', `Bearer ${access_token}`]],
    mode: 'cors',
  });

  const data = await res.json() as ResponseData;

  console.log(`API - ${url}`)

  return data;
}
const toDateStr = (d: Date) => d.toISOString().substring(0, 10);

/**
 * (昼寝なども含めた)1日の睡眠データを取得。
 * 睡眠スコアは分かるが詳細な情報は得られない。
 * https://cloud.ouraring.com/v2/docs#operation/Multiple_daily_sleep_Documents_v2_usercollection_daily_sleep_get
 */
export async function dailySleep(startDate: Date, endDate: Date) {
  const start_date = toDateStr(startDate);
  const end_date = toDateStr(endDate);
  const url = `${baseUrl}daily_sleep?start_date=${start_date}&end_date=${end_date}`

  type ResponseData = {
    data: Array<{
      id: string
      contributors: {
        deep_sleep: number | null
        efficiency: number | null
        latency: number | null
        rem_sleep: number | null
        restfulness: number | null
        timing: number | null
        total_sleep: number | null
      }
      day: string
      score?: number
      timestamp: string
    }>
    next_token?: string
  };
  const data = await call<ResponseData>(url);

  return data;
}

/**
 * 睡眠データを取得。
 * 情報は細かく、昼寝は独立した睡眠としてカウントされる。
 * https://cloud.ouraring.com/v2/docs#tag/Sleep-Routes
 * @param accountId 開発用
 */
export async function sleep(startDate: Date, endDate: Date, accountId?: string) {
  const start_date = toDateStr(startDate);
  const end_date = toDateStr(endDate);
  const url = `${baseUrl}sleep?start_date=${start_date}&end_date=${end_date}`

  type ResponseData = {
    data: Array<{
      id: string
      average_breath?: number; average_heart_rate?: number
      average_hrv?: number; awake_time?: number
      bedtime_end: string; bedtime_start: string
      day: string; deep_sleep_duration?: number
      efficiency?: number
      heart_rate?: {
        interval: number
        items: Array<number | null>
        timestamp: string
      }
      hrv?: {
        interval: number
        items: Array<number | null>
        timestamp: string
      }
      latency?: number; light_sleep_duration?: number
      low_battery_alert: boolean; lowest_heart_rate?: number
      movement_30_sec?: string; period: number
      readiness?: {
        contributors: {
          activity_balance: number | null
          body_temperature: number | null
          hrv_balance: number | null
          previous_day_activity: number | null
          previous_night: number | null
          recovery_index: number | null
          resting_heart_rate: number | null
          sleep_balance: number | null
        }
      }
      readiness_score_delta?: number; rem_sleep_duration?: number
      restless_periods?: number; sleep_phase_5_min?: string
      sleep_score_delta?: number; sleep_algorithm_version?: 'v1' | 'v2'
      time_in_bed: number; total_sleep_duration: number
      type: 'deleted' | 'sleep' | 'long_sleep' | 'late_nap' | 'rest'
    }>
    next_token?: string
  };
  const data = await call<ResponseData>(url, accountId);

  return data;
}

// ----- 認証関連 -----

const authBaseUrl = 'https://api.ouraring.com/';

/**
 * ログインセッションのユーザIDからOuraのアクセストークンを取得する。期限切れの場合はトークンの更新処理もする
 * @param accountId 開発用に使う。指定されたIDのアクセストークンを返すようになる
 */
async function getToken(accountId?: string) {
  const userId = await getUserId();
  const account = !accountId
    ? await findOuraAccountByUserId(userId)
    : await prisma.account.findFirst({ where: { providerAccountId: accountId, provider: 'oura' }})

  if (!account) {
    throw "Oura アカウントとの連携を許可する必要があります";
  }

  if (!hasValidTokens(account)) {
    return await rotateToken(account);
  }

  return account.access_token!;
}

async function rotateToken(account: NonNullable<AccountData>) {
  try {
    if (!account.refresh_token) {
      throw "refresh_token does not exist";
    }

    const client_id = process.env.AUTH_OURA_ID;
    const client_secret = process.env.AUTH_OURA_SECRET;

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: account.refresh_token,
      client_id: client_id!,
      client_secret: client_secret!,
    });

    // https://cloud.ouraring.com/docs/authentication#oauth2-get-new-access-token-for-refresh-token
    const res = await fetch(`${authBaseUrl}oauth/token`, {
      method: "POST",
      mode: "cors",
      body,
    });

    if (res.status !== 200) {
      throw `fetch of /oauth/token was failure. ${res.status} - ${res.statusText}`;
    }

    type ResponseData = {
      token_type: "bearer";
      access_token: string;
      expires_in: number;
      refresh_token: string;
    };
    const data = (await res.json()) as ResponseData;

    const { access_token, expires_in, refresh_token } = data;
    const expires_at = Math.floor(Date.now() / 1000 + expires_in);
    await updateTokens(account, { access_token, expires_at, refresh_token });

    return access_token;
  } catch (e) {
    // Oura APIが壊れていない限り、ユーザが通常行う操作でここに到達するケースは考えられない
    // Accountテーブルのデータが壊れているか、refresh_tokenが失効しているかもしれない
    // 再度Ouraアカウントでログインし直してもらうことでトークン情報が設定し直されるはず
    console.log('failed to rotateToken');
    console.log(e);

    // TODO: ユーザに伝える
    throw 'もう一度Ouraアカウントでログインし直してください';
  }
}

function hasValidTokens(account: NonNullable<AccountData>) {
  const { access_token, expires_at } = account;
  return access_token && (expires_at ?? 0) > Math.ceil(Date.now() / 1000);
}
