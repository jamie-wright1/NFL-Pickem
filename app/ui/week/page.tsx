import { fetchActiveWeek } from "@/app/lib/data";
import { redirect } from "next/navigation";

type WeekRedirectProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function WeekRedirect({ searchParams }: WeekRedirectProps) {
  const params = searchParams ? await searchParams : undefined;
  const requestedWeek = Number(params?.page);
  let currWeek = await fetchActiveWeek();

  if (currWeek === null) {
    currWeek = 1; // Default to week 1 if fetchActiveWeek returns null
  }

  const week =
    Number.isInteger(requestedWeek) &&
    requestedWeek >= 1 &&
    requestedWeek <= 18
      ? requestedWeek
      : currWeek;
      
  redirect(`/ui/week/${week}`);
}