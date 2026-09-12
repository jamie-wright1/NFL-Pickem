import { redirect } from "next/navigation";

type WeekRedirectProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function WeekRedirect({ searchParams }: WeekRedirectProps) {
  const params = searchParams ? await searchParams : undefined;
  const requestedWeek = Number(params?.page);
  const week = Number.isInteger(requestedWeek) && requestedWeek >= 1 && requestedWeek <= 18
    ? requestedWeek
    : 1;

  redirect(`/ui/week/${week}`);
}