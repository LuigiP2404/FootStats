import { Bricolage_Grotesque, IBM_Plex_Sans } from "next/font/google";

export const display = Bricolage_Grotesque({
  subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display",
});
export const sans = IBM_Plex_Sans({
  subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans",
});