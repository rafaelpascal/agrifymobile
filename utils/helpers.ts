import clsx, { ClassArray } from "clsx";
import { twMerge } from "tailwind-merge";
interface CreateAvatarUrlArgs {
  /** Can be the user's name or the imgSrc. */
  avatarUrl: string;
  /** @see https://ui-avatars.com/ for additional properties. */
  additionalParams?: Record<string, string | number>;
}

export function cn(...inputs: ClassArray) {
  return twMerge(clsx(inputs));
}

export const createAvatarUrl = (args: CreateAvatarUrlArgs) => {
  const { avatarUrl: url, additionalParams } = args;

  if (url.includes("http")) return url;

  const params = new URLSearchParams();
  params.append("name", url);
  params.append("size", "256");

  if (additionalParams) {
    Object.keys(additionalParams).forEach((key) => {
      params.append(key, String(additionalParams[key]));
    });
  }

  return `https://ui-avatars.com/api.jpg?${params.toString()}`;
};
