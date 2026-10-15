import type { SanitizedUser } from "../../../utils/sanitizeUser.js";

export interface GetMeResponseDto {
  user: SanitizedUser;
}
