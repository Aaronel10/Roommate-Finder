/*
 * Functions to mutate/change data on the API
 */
import { env } from "process";

import type { AuthSession } from "../types/auth.types";
import { getAuthSession } from "../utils/storage";
import doRequest from "./request";
const backend_api = "https://api.roomfin.xyz";
export async function login(email: string, password: string) {
  return await doRequest<AuthSession>(
    `${backend_api}/auth/login`,
    {
      email,
      password,
    },
    "POST"
  );
}

export async function register(
  email: string,
  password: string,
  name: string,
  LastName: string
) {
  return await doRequest<AuthSession>(
    `${backend_api}/auth/register`,
    {
      name,
      LastName,
      email,
      password,
    },
    "POST"
  );
}

export async function reset(email: string) {
  return await doRequest<AuthSession>(
    `${backend_api}/auth/resetPassword`,
    {
      email,
    },
    "POST"
  );
}

export async function authenticateUser() {
  return await doRequest<AuthSession>(
    `${backend_api}/auth/checkAuth`,
    {
      refreshToken: getAuthSession().refreshToken,
      accessToken: getAuthSession().accessToken,
    },
    "POST"
  );
}

export async function updatePassword(password: string, resetToken: string) {
  return await doRequest<AuthSession>(
    `${backend_api}/auth/updatePassword`,
    {
      password,
      resetToken,
    },
    "POST"
  );
}
//confirmEmail, sendConfirmationEmail

export async function confirmEmail(emailToken: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/auth/confirmEmail`,
    {
      emailToken,
    },
    "POST"
  );
}

export async function sendConfirmationEmail(email: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/auth/sendConfirmationEmail`,
    {
      email,
    },
    "POST"
  );
}
